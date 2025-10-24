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
        // ===========================================================
        // AUTHENTICATION
        // ===========================================================
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id ?? "";
        const email = session.user.email ?? "";
        const name = session.user.name ?? "";

        if (!email || !userId) {
            return NextResponse.json(
                { error: "Missing user information" },
                { status: 400 }
            );
        }

        // ===========================================================
        // PARSE REQUEST BODY
        // ===========================================================
        const body = await req.json();
        const planName: string | undefined = body?.planName;
        if (!planName) {
            return NextResponse.json({ error: "Missing plan name" }, { status: 400 });
        }

        // ===========================================================
        // FETCH PLAN FROM SANITY
        // ===========================================================
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

        // ===========================================================
        // CONNECT TO MONGODB & FIND USER
        // ===========================================================
        await connectDB();
        const dbUser = await User.findById(userId);
        if (!dbUser) {
            return NextResponse.json(
                { error: "User not found in database" },
                { status: 404 }
            );
        }

        // ===========================================================
        // ENSURE STRIPE CUSTOMER EXISTS
        // ===========================================================
        let customerId = dbUser.stripeCustomerId as string | undefined;

        async function ensureStripeCustomer(): Promise<string> {
            if (customerId) {
                try {
                    const existing = await stripe.customers.retrieve(customerId);
                    if (!("deleted" in existing)) return existing.id;
                } catch {
                    console.warn(" Invalid Stripe customer, recreating...");
                }
            }

            const newCustomer = await stripe.customers.create({
                email,
                name,
                metadata: { userId: String(userId) },
            });

            dbUser.stripeCustomerId = newCustomer.id;
            await dbUser.save();
            return newCustomer.id;
        }

        const verifiedCustomerId = await ensureStripeCustomer();

        // ===========================================================
        // ENSURE CORRECT RECURRING PRICE
        // ===========================================================
        const planPrice = Number(plan.price);
        const planInterval = plan.duration.includes("year") ? "year" : "month";

        const allPrices = await stripe.prices.list({
            product: plan.stripeProductId,
            limit: 100,
        });

        let matchingPrice = allPrices.data.find(
            (p) =>
                p.active &&
                p.type === "recurring" &&
                p.recurring?.interval === planInterval &&
                (p.unit_amount || 0) / 100 === planPrice
        );

        if (!matchingPrice) {
            console.log(`Creating new ${planInterval}ly recurring price for $${planPrice}`);

            await Promise.all(
                allPrices.data
                    .filter((p) => p.active)
                    .map((p) => stripe.prices.update(p.id, { active: false }))
            );

            matchingPrice = await stripe.prices.create({
                unit_amount: Math.round(planPrice * 100),
                currency: "usd",
                recurring: { interval: planInterval },
                product: plan.stripeProductId,
            });

            await stripe.products.update(plan.stripeProductId, {
                default_price: matchingPrice.id,
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
        }

        const priceId = matchingPrice.id;

        // ===========================================================
        // CREATE STRIPE CHECKOUT SESSION (SUBSCRIPTION)
        // ===========================================================
        const metadata = {
            userId,
            email,
            planName: plan.title,
            planPrice: String(planPrice),
            planInterval,
            stripeProductId: plan.stripeProductId,
        };

        const stripeSession = await stripe.checkout.sessions.create({
            mode: "subscription",
            customer: verifiedCustomerId,
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/#pricing`,
            metadata,
            subscription_data: { metadata },
        });

        // ===========================================================
        // RETURN SESSION URL TO FRONTEND
        // ===========================================================
        return NextResponse.json({ url: stripeSession.url });
    } catch (error) {
        console.error("Subscribe error:", error);
        return NextResponse.json(
            { error: "Failed to create subscription" },
            { status: 500 }
        );
    }
}
