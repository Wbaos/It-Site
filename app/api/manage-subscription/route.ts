import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/app/models/User";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-08-27.basil",
});

export async function POST() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }

        let customerId = user.stripeCustomerId;

        async function getOrFixCustomer() {
            if (customerId) {
                try {
                    const existing = await stripe.customers.retrieve(customerId);
                    if (!("deleted" in existing)) {
                        return existing.id;
                    }
                } catch (err) {
                    console.warn(" Stripe customer ID invalid. Repairing…");
                }
            }

            const found = await stripe.customers.list({
                email: user.email,
                limit: 1,
            });

            if (found.data.length > 0) {
                customerId = found.data[0].id;
            } else {
                const newCustomer = await stripe.customers.create({
                    email: user.email,
                    name: user.name,
                    metadata: { userId: String(user._id) },
                });
                customerId = newCustomer.id;
            }

            user.stripeCustomerId = customerId;
            await user.save();

            return customerId;
        }

        const verifiedCustomerId = await getOrFixCustomer();

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: verifiedCustomerId,
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/account`,
        });

        return NextResponse.json({ url: portalSession.url });

    } catch (error) {
        console.error("Manage subscription error:", error);
        return NextResponse.json(
            { error: "Failed to create billing portal session" },
            { status: 500 }
        );
    }
}
