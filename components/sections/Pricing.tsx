import { sanity } from "@/lib/sanity";
import Link from "next/link";

export const revalidate = 60;

export default async function Pricing() {
  const plans = await sanity.fetch(`
    *[_type == "pricingPlan"] | order(order asc) {
      _id,
      title,
      price,
      duration,
      features,
      buttonText,
      buttonLink,
      featured
    }
  `);

  return (
    <section id="pricing" className="section pricing">
      <div className="site-container-pricing">
        <h2 className="pricing-heading">Simple Pricing</h2>
        <p className="pricing-sub">
          Choose the option that fits your needs best.
        </p>

        <div className="pricing-grid">
          {plans.map((p: any) => (
            <div
              key={p._id}
              className={`pricing-card ${p.featured ? "featured" : ""}`}
            >
              <h3 className="plan-title">{p.title}</h3>
              <p className="plan-price">
                {p.price} <span>{p.duration}</span>
              </p>

              {p.features?.length > 0 && (
                <ul className="plan-features">
                  {p.features.map((f: string, i: number) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              )}

              <Link href={p.buttonLink || "#contact"} className="btn btn-primary wide">
                {p.buttonText || "Book Now"}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
