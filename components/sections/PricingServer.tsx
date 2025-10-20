import { sanity } from "@/lib/sanity";
import PricingClient from "./PricingClient";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export const revalidate = 0;

export default async function PricingServer() {
  const plans = await sanity.fetch(`
    *[_type == "pricingPlan"] | order(order asc) {
      _id,
      title,
      slug,
      price,
      duration,
      features,
      buttonText,
      featured,
      stripeProductId
    }
  `);

  const enrichedPlans = await Promise.all(
    plans.map(async (plan: any) => {
      try {
        const prices = await stripe.prices.list({
          product: plan.stripeProductId,
          active: true,
          limit: 1,
        });

        const unitAmount = prices.data[0]?.unit_amount ?? 0;
        const price = unitAmount / 100;
        return { ...plan, price };
      } catch (err) {
        console.error("Stripe price fetch failed:", err);
        return { ...plan, price: 0 };
      }
    })
  );

  return <PricingClient plans={enrichedPlans} />;
}
