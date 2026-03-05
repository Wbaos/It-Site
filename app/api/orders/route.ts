import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/app/models/Order";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-08-27.basil" })
    : null;

function buildServiceDescriptionFromItems(items: any[]): string {
    if (!Array.isArray(items) || items.length === 0) return "";

    const parts: string[] = [];
    for (const item of items) {
        const title = String(item?.navDescription || item?.title || item?.slug || "").trim();
        if (!title) continue;
        const options = Array.isArray(item?.options) ? item.options : [];
        const optionNames = options
            .map((opt: any) => String(opt?.name || "").trim())
            .filter(Boolean);

        parts.push(optionNames.length ? `${title} (Add-ons: ${optionNames.join(", ")})` : title);
    }

    return parts.join(" • ");
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        await connectDB();

        if (!session?.user) {
            return NextResponse.json({ orders: [] });
        }

        const query = {
            $or: [
                { userId: session.user.id },
                { email: session.user.email },
            ],
        };

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .lean();

        // Best-effort backfill for older orders missing UI fields
        const defaultTechnicianName = String(process.env.DEFAULT_TECHNICIAN_NAME || "Wilber Banos").trim();
        const defaultWarrantyText = String(process.env.DEFAULT_WARRANTY_TEXT || "90-Day Warranty").trim();

        const maxBackfill = 10;
        for (const raw of orders.slice(0, maxBackfill) as any[]) {
            const updates: Record<string, unknown> = {};

            if (!raw?.orderNumber && raw?._id) {
                const id = String(raw._id);
                updates.orderNumber = id.slice(-6).toUpperCase();
                raw.orderNumber = updates.orderNumber;
            }

            if (!raw?.technicianName && defaultTechnicianName) {
                updates.technicianName = defaultTechnicianName;
                raw.technicianName = defaultTechnicianName;
            }

            if (!raw?.warrantyText && defaultWarrantyText) {
                updates.warrantyText = defaultWarrantyText;
                raw.warrantyText = defaultWarrantyText;
            }

            if (!raw?.serviceDescription) {
                const desc = buildServiceDescriptionFromItems(raw?.items || []);
                if (desc) {
                    updates.serviceDescription = desc;
                    raw.serviceDescription = desc;
                }
            }

            // Backfill payment last4 from Stripe when possible (one-time orders only)
            if (!raw?.paymentLast4 && stripe && raw?.stripeSessionId && !raw?.isSubscription) {
                try {
                    const fullSession = (await stripe.checkout.sessions.retrieve(raw.stripeSessionId, {
                        expand: ["payment_intent", "payment_intent.latest_charge"],
                    })) as any;

                    const charge = fullSession?.payment_intent?.latest_charge;
                    const last4 = charge?.payment_method_details?.card?.last4;
                    if (typeof last4 === "string" && last4.trim()) {
                        updates.paymentLast4 = last4.trim();
                        raw.paymentLast4 = last4.trim();
                    }
                } catch {
                    // Ignore Stripe lookup failures for list view
                }
            }

            if (Object.keys(updates).length) {
                try {
                    await Order.findByIdAndUpdate(raw._id, { $set: updates }, { runValidators: false });
                } catch {
                    // Ignore backfill persistence errors
                }
            }
        }

        return NextResponse.json({ orders });
    } catch (err) {
        console.error("Orders fetch error:", err);
        return NextResponse.json({ orders: [] });
    }
}
