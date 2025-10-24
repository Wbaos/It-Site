import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sanity } from "@/lib/sanity";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-08-27.basil",
});

export async function POST(req: Request) {
    try {
        const data = await req.json().catch(() => ({}));
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

        let updates: string[] = [];

        for (const plan of plans) {
            if (!plan.stripeProductId) continue;

            // Fetch all existing prices for the product
            const allPrices = await stripe.prices.list({
                product: plan.stripeProductId,
                limit: 100,
            });

            // --------------------------
            //  Handle monthly price
            // --------------------------
            if (plan.price) {
                const monthlyActive = allPrices.data.find(
                    (p) =>
                        p.active &&
                        p.recurring?.interval === "month" &&
                        (p.unit_amount || 0) / 100 === Number(plan.price)
                );

                if (!monthlyActive) {
                    // Deactivate old monthly prices
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

                    console.log(`✅ Updated monthly price for ${plan.title}: $${plan.price}`);
                    updates.push(`${plan.title} (month)`);
                }
            }

            // --------------------------
            //  Handle yearly price
            // --------------------------
            if (plan.annualPrice) {
                const yearlyActive = allPrices.data.find(
                    (p) =>
                        p.active &&
                        p.recurring?.interval === "year" &&
                        (p.unit_amount || 0) / 100 === Number(plan.annualPrice)
                );

                if (!yearlyActive) {
                    // Deactivate old yearly prices
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

                    console.log(`✅ Updated yearly price for ${plan.title}: $${plan.annualPrice}`);
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
        console.error(" Sync error:", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function GET() {
    return await POST(new Request("http://localhost", { method: "POST" }));
}
