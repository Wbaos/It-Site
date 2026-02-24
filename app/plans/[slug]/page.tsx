import { sanity } from "@/lib/sanity";
import { PlanDetails } from "@/components/PlanDetails";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const canonical = `https://www.calltechcare.com/plans/${slug}`;

  return {
    alternates: { canonical },
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

export default async function PlanPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

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
    { slug }
  );

  if (!plan) {
    return (
      <section className="section">
        <div className="site-container">
          <h2>Plan not found</h2>
        </div>
      </section>
    );
  }

  return <PlanDetails plan={{ ...plan, features: plan.features || [] }} />;
}
