import { sanity } from "@/lib/sanity";
import PricingClient from "./PricingClient";

export const revalidate = 0;

export default async function PricingServer() {
  const plans = await sanity.fetch(`
    *[_type == "pricingPlan"] | order(order asc) {
      _id,
      title,
      slug,
      price,
      annualPrice,
      duration,
      features,
      buttonText,
      featured,
      stripeProductId
    }
  `);

  const normalizedPlans = plans.map((p: any) => ({
    ...p,
    price: Number(p.price) || 0,
    annualPrice: Number(p.annualPrice) || 0,
  }));

  return <PricingClient plans={normalizedPlans} />;
}
