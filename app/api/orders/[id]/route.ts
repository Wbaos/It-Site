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
