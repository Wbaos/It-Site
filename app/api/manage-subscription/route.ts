import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/app/models/User";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json(
                { error: "User not found." },
                { status: 404 }
            );
        }

        // Auto-fix: create customer if missing
        if (!user.stripeCustomerId) {
            const customers = await stripe.customers.list({
                email: user.email,
                limit: 1,
            });

            if (customers.data.length > 0) {
                user.stripeCustomerId = customers.data[0].id;
                await user.save();
            } else {
                return NextResponse.json(
                    { error: "No Stripe customer ID found for user." },
                    { status: 404 }
                );
            }
        }

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
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
