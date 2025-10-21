import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { sanity } from "@/lib/sanity";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/app/models/User";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-08-27.basil",
});

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }


        const { planName } = await req.json();
        if (!planName) {
            return NextResponse.json({ error: "Missing plan name" }, { status: 400 });
        }

        // Fetch plan details from Sanity
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

        if (!email) {
            console.warn("Unauthorized access attempt to /api/subscribe");
            return NextResponse.json(
                { error: "You must be logged in." },
                { status: 401 }
            );
        }

        // Connect to DB and find user
        await connectDB();
        const dbUser = await User.findById(userId);
        if (!dbUser) {
            return NextResponse.json(
                { error: "User not found in database." },
                { status: 404 }
            );
        }

        // ===========================================================
        //  Create or reuse Stripe customer (auto-healing version)
        // ===========================================================
        let customerId = dbUser.stripeCustomerId as string | undefined;

        async function ensureStripeCustomer(
            email: string,
            name?: string | null
        ): Promise<string> {
            let validCustomerId: string | null = null;

            if (customerId) {
                try {
                    const existing = await stripe.customers.retrieve(customerId);
                    if (!("deleted" in existing) && existing.id) {
                        validCustomerId = existing.id;
                    }
                } catch (err: any) {
                    console.error(" Unexpected error checking Stripe customer:", err);
                }
            }

            if (!validCustomerId) {
                const newCustomer = await stripe.customers.create({
                    email: email ?? "",
                    name: name ?? "",
                    metadata: { userId: String(userId) },
                });
                validCustomerId = newCustomer.id;
                dbUser.stripeCustomerId = validCustomerId;
                await dbUser.save();
            }

            return validCustomerId;
        }

        const verifiedCustomerId = await ensureStripeCustomer(
            email ?? "",
            session.user?.name ?? ""
        );

        // ===========================================================
        // Retrieve active price for plan
        // ===========================================================
        const prices = await stripe.prices.list({
            product: plan.stripeProductId,
            active: true,
            limit: 1,
        });

        let priceId = prices.data[0]?.id;
        const currentStripePrice = prices.data[0]?.unit_amount
            ? prices.data[0].unit_amount / 100
            : undefined;
        const planPrice = Number(plan.price);

        // Sync if Sanity and Stripe differ
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
                } catch (err) {
                    console.error(" Background price update failed:", err);
                }
            })();
        }

        // ===========================================================
        // Create Checkout Session with full metadata
        // ===========================================================
        const metadata = {
            userId: String(userId),
            email: String(email),
            planName: String(plan.title),
            planPrice: String(plan.price),
            planInterval: String(plan.duration).replace("/", "").trim(),
            stripeProductId: String(plan.stripeProductId),
        };


        const stripeSession = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            customer: verifiedCustomerId,
            line_items: [{ price: priceId!, quantity: 1 }],
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/#pricing`,
            metadata,
            subscription_data: {
                metadata,
            },
        });


        // Return checkout URL
        return NextResponse.json({ url: stripeSession.url });
    } catch (error) {
        console.error(" Subscribe error:", error);
        return NextResponse.json(
            { error: "Failed to create subscription" },
            { status: 500 }
        );
    }
}
