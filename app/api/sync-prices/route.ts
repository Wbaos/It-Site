import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sanity } from "@/lib/sanity";
import { logger } from "@/lib/logger";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-08-27.basil",
});

export async function POST(req: Request) {
    try {
        console.log(" Sanity webhook received or manual sync");

        const plans = await sanity.fetch(`
      *[_type == "pricingPlan"] {
        _id,
        title,
        price,
        annualPrice,
        stripeProductId
      }
    `);

        const updates: string[] = [];

        for (const plan of plans) {
            if (!plan.stripeProductId) continue;

            const allPrices = await stripe.prices.list({
                product: plan.stripeProductId,
                limit: 100,
            });

            // ==========================
            // Handle Monthly Price
            // ==========================
            if (plan.price) {
                const existingMonthly = allPrices.data.find(
                    (p) => p.active && p.recurring?.interval === "month"
                );

                if (
                    !existingMonthly ||
                    (existingMonthly.unit_amount || 0) / 100 !== Number(plan.price)
                ) {
                    await stripe.products.update(plan.stripeProductId, {
                        default_price: null as any,
                    });

                    await Promise.all(
                        allPrices.data
                            .filter((p) => p.active && p.recurring?.interval === "month")
                            .map((p) => stripe.prices.update(p.id, { active: false }))
                    );

                    const newPrice = await stripe.prices.create({
                        unit_amount: Math.round(plan.price * 100),
                        currency: "usd",
                        recurring: { interval: "month" },
                        product: plan.stripeProductId,
                    });

                    await stripe.products.update(plan.stripeProductId, {
                        default_price: newPrice.id,
                    });

                    logger.info(`Updated monthly price for ${plan.title}`, { price: plan.price });
                    updates.push(`${plan.title} (month)`);
                }
            }

            // ==========================
            // Handle Yearly Price
            // ==========================
            if (plan.annualPrice) {
                const existingYearly = allPrices.data.find(
                    (p) => p.active && p.recurring?.interval === "year"
                );

                if (
                    !existingYearly ||
                    (existingYearly.unit_amount || 0) / 100 !== Number(plan.annualPrice)
                ) {
                    await stripe.products.update(plan.stripeProductId, {
                        default_price: null as any,
                    });

                    await Promise.all(
                        allPrices.data
                            .filter((p) => p.active && p.recurring?.interval === "year")
                            .map((p) => stripe.prices.update(p.id, { active: false }))
                    );

                    const newYearPrice = await stripe.prices.create({
                        unit_amount: Math.round(plan.annualPrice * 100),
                        currency: "usd",
                        recurring: { interval: "year" },
                        product: plan.stripeProductId,
                    });

                    await stripe.products.update(plan.stripeProductId, {
                        default_price: newYearPrice.id,
                    });

                    logger.info(`Updated yearly price for ${plan.title}`, { price: plan.annualPrice });
                    updates.push(`${plan.title} (year)`);
                }
            }
        }

        if (updates.length === 0) {
            return NextResponse.json({ message: "No updates needed" });
        }

        return NextResponse.json({
            message: "Stripe prices synced successfully",
            updated: updates,
        });
    } catch (err: any) {
        logger.error("Price sync error", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function GET() {
    return await POST(new Request("http://localhost", { method: "POST" }));
}
