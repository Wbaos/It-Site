import { sanity } from "@/lib/sanity";
import { PlanDetails } from "@/components/PlanDetails";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default async function PlanPage({
  params,
}: {
  params: { slug: string };
}) {
  const plan = await sanity.fetch(
    `*[_type == "pricingPlan" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      price,
      annualPrice,
      duration,
      features,
      stripeProductId,
      description
    }`,
    { slug: params.slug }
  );

  if (!plan) {
    notFound(); 
  }

  return <PlanDetails plan={{ ...plan, features: plan.features || [] }} />;
}