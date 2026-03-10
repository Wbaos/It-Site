import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/app/models/Order";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        //  Authenticate user
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        //  Connect to DB
        await connectDB();
        const order = await Order.findById(id);

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        if (order.email !== session.user.email) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        if (order.isSubscription) {
            return NextResponse.json(
                { error: "Cannot refund subscription orders." },
                { status: 400 }
            );
        }

        if (order.stripeSessionId) {
            try {
                const stripeSession = await stripe.checkout.sessions.retrieve(
                    order.stripeSessionId
                );
                const paymentIntentId = stripeSession.payment_intent as string | null;

                if (paymentIntentId) {
                    await stripe.refunds.create({ payment_intent: paymentIntentId });
                    console.log(` Refunded payment for order ${order._id}`);
                } else {
                    console.warn(` No payment intent found for order ${order._id}`);
                }
            } catch (refundErr: any) {
                console.error("Refund failed:", refundErr.message);
                return NextResponse.json(
                    { error: "Refund failed: " + refundErr.message },
                    { status: 500 }
                );
            }
        }

        order.status = "refunded";
        order.refunded = true;
        order.deleted = false;
        await order.save();

        console.log(` Order ${order._id} marked as refunded`);

        return NextResponse.json({
            message: "Order refunded successfully",
            refunded: true,
        });
    } catch (err: any) {
        console.error("Delete order error:", err);
        return NextResponse.json(
            { error: "Failed to delete order" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: orderId } = await context.params;
        if (!orderId) {
            return NextResponse.json({ error: "Missing order id" }, { status: 400 });
        }

        const body = await req.json().catch(() => null);
        const action = typeof body?.action === "string" ? body.action.trim().toLowerCase() : "";

        await connectDB();

        const existing = (await Order.findOne({ _id: orderId }).lean()) as any;
        if (!existing) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        const sessionEmail = session.user.email?.toLowerCase();
        const orderEmail = typeof existing.email === "string" ? existing.email.toLowerCase() : undefined;

        if (!sessionEmail || !orderEmail || sessionEmail !== orderEmail) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const normalizeStatus = (status: unknown): string =>
            String(status || "")
                .trim()
                .toLowerCase()
                .replace(/[_-]+/g, " ");

        const status = normalizeStatus((existing as any).status);
        const hasSchedule = Boolean((existing as any)?.schedule?.date || (existing as any)?.schedule?.time);

        // Cancel order
        if (action === "cancel") {
            if (Boolean((existing as any).isSubscription)) {
                return NextResponse.json(
                    { error: "Subscription orders must be canceled from subscription management." },
                    { status: 400 }
                );
            }

            if (Boolean((existing as any).refunded) || status.includes("refund")) {
                return NextResponse.json({ error: "This order is already refunded." }, { status: 400 });
            }

            if (status.includes("cancel")) {
                return NextResponse.json({ error: "This order is already canceled." }, { status: 400 });
            }

            if (Boolean((existing as any).completedAt) || status.includes("complete")) {
                return NextResponse.json(
                    { error: "Completed orders cannot be canceled." },
                    { status: 400 }
                );
            }

            // Only allow canceling when the order is pending or scheduled (paid + scheduled also allowed).
            const cancelable =
                status.includes("pending") || status.includes("schedule") || (status === "paid" && hasSchedule);
            if (!cancelable) {
                return NextResponse.json(
                    { error: "Only pending or scheduled orders can be canceled." },
                    { status: 400 }
                );
            }

            // If the order was paid via Stripe Checkout, cancelling should refund the payment.
            const stripeSessionId = typeof (existing as any).stripeSessionId === "string" ? (existing as any).stripeSessionId : "";
            const shouldAttemptRefund = status === "paid" || status.includes("paid");
            let refunded = false;

            if (stripeSessionId && shouldAttemptRefund) {
                try {
                    const stripeSession = await stripe.checkout.sessions.retrieve(stripeSessionId);
                    const paymentIntentId = stripeSession.payment_intent as string | null;

                    if (paymentIntentId) {
                        await stripe.refunds.create({ payment_intent: paymentIntentId });
                        refunded = true;
                    } else {
                        console.warn(` No payment intent found for order ${orderId} (session ${stripeSessionId})`);
                    }
                } catch (refundErr: any) {
                    console.error("Refund failed:", refundErr?.message || refundErr);
                    return NextResponse.json(
                        { error: "Refund failed: " + (refundErr?.message || "Unknown error") },
                        { status: 500 }
                    );
                }
            }

            const updated = (await Order.findOneAndUpdate(
                { _id: orderId },
                {
                    $set: {
                        status: refunded ? "refunded" : "canceled",
                        refunded,
                        deleted: false,
                    },
                },
                { new: true, runValidators: false }
            ).lean()) as any;

            if (!updated) {
                return NextResponse.json({ error: "Order not found" }, { status: 404 });
            }

            return NextResponse.json({ order: updated, refunded });
        }

        // Reschedule order (default PATCH behavior)
        const date = typeof body?.date === "string" ? body.date.trim() : "";
        const time = typeof body?.time === "string" ? body.time.trim() : "";

        if (!date || !time) {
            return NextResponse.json(
                { error: "Missing required fields: date, time" },
                { status: 400 }
            );
        }

        // Only allow rescheduling of scheduled orders.
        if (!status.includes("schedule") && !(status === "paid" && hasSchedule)) {
            return NextResponse.json(
                { error: "Only scheduled orders can be rescheduled." },
                { status: 400 }
            );
        }

        // Use an update query to avoid enum validation issues on seeded/test statuses.
        const updated = (await Order.findOneAndUpdate(
            { _id: orderId },
            {
                $set: {
                    "schedule.date": date,
                    "schedule.time": time,
                    "items.0.schedule.date": date,
                    "items.0.schedule.time": time,
                },
            },
            { new: true, runValidators: false }
        ).lean()) as any;

        if (!updated) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({ order: updated });
    } catch (error) {
        console.error("Error rescheduling order:", error);
        return NextResponse.json({ error: "Failed to reschedule order" }, { status: 500 });
    }
}
