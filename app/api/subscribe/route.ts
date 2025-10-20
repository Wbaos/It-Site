import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { sanity } from "@/lib/sanity";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-08-27.basil",
});

export async function POST(req: Request) {
    try {
        // Get the authenticated user session
        const session = await getServerSession(authOptions);
        console.log("SESSION:", session?.user);

        const { planName } = await req.json();

        if (!planName) {
            return NextResponse.json({ error: "Missing plan name" }, { status: 400 });
        }

        // Fetch the plan details from Sanity
        const plan = await sanity.fetch(
            `*[_type == "pricingPlan" && title == $planName][0]{
        _id,
        title,
        price,
        duration,
        stripeProductId,
        lastSyncedPrice
      }`,
            { planName }
        );

        if (!plan || !plan.stripeProductId) {
            return NextResponse.json(
                { error: "Plan not found or missing Stripe product ID" },
                { status: 404 }
            );
        }

        const email = session?.user?.email ?? "";
        const userId = session?.user?.id ?? "";

        // If user not logged in, block the request
        if (!email) {
            console.warn("Unauthorized access attempt to /api/subscribe");
            return NextResponse.json(
                { error: "You must be logged in." },
                { status: 401 }
            );
        }

        // Get existing Stripe price for the plan
        const prices = await stripe.prices.list({
            product: plan.stripeProductId,
            active: true,
            limit: 1,
        });

        let priceId: string | undefined = prices.data[0]?.id;
        const currentStripePrice = prices.data[0]?.unit_amount
            ? prices.data[0].unit_amount / 100
            : undefined;
        const planPrice = Number(plan.price);

        // Background price sync if Sanity and Stripe differ
        if (currentStripePrice !== planPrice) {
            (async () => {
                try {
                    await stripe.products.update(plan.stripeProductId as string, {
                        default_price: null as unknown as string,
                    });

                    for (const p of prices.data) {
                        await stripe.prices.update(p.id, { active: false });
                    }

                    const newPrice = await stripe.prices.create({
                        unit_amount: Math.round(planPrice * 100),
                        currency: "usd",
                        recurring: {
                            interval: plan.duration.includes("month") ? "month" : "year",
                        },
                        product: plan.stripeProductId as string,
                    });

                    await stripe.products.update(plan.stripeProductId as string, {
                        default_price: newPrice.id,
                    });

                    await fetch(
                        `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2023-08-01/data/mutate/production`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${process.env.SANITY_WRITE_TOKEN}`,
                            },
                            body: JSON.stringify({
                                mutations: [
                                    {
                                        patch: {
                                            id: plan._id,
                                            set: { lastSyncedPrice: planPrice },
                                        },
                                    },
                                ],
                            }),
                        }
                    );

                    console.log(" Stripe price updated and synced with Sanity");
                } catch (err) {
                    console.error(" Background price update failed:", err);
                }
            })();
        }

        // Create Stripe Checkout session
        const stripeSession = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            customer_email: email,
            line_items: [{ price: priceId!, quantity: 1 }],
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/#pricing`,
            metadata: {
                userId: userId || "guest",
                email,
                planName: plan.title,
                planPrice: plan.price,
                planInterval: plan.duration,
                stripeProductId: plan.stripeProductId,
            },
        });

        console.log(" Stripe Checkout session created:", stripeSession.id);
        return NextResponse.json({ url: stripeSession.url });
    } catch (error) {
        console.error(" Subscribe error:", error);
        return NextResponse.json(
            { error: "Failed to create subscription" },
            { status: 500 }
        );
    }
}
