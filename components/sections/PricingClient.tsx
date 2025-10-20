"use client";
import Link from "next/link";

export default function PricingClient({ plans }: { plans: any[] }) {
    return (
        <section id="pricing" className="section pricing">
            <div className="site-container-pricing">
                <h2 className="pricing-heading">Service Packages</h2>
                <p className="pricing-sub">Save more with TechCare monthly plans.</p>

                <div className="pricing-grid">
                    {plans.map((p) => {
                        const priceDisplay =
                            p.price && Number(p.price) > 0 ? `$${p.price}` : "$—";
                        const durationDisplay = p.duration || "/month";

                        return (
                            <div
                                key={p._id}
                                className={`pricing-card ${p.featured ? "featured" : ""}`}
                            >
                                <h3 className="plan-title">{p.title}</h3>
                                <p className="plan-price">
                                    {priceDisplay} <span>{durationDisplay}</span>
                                </p>

                                {p.features?.length > 0 && (
                                    <ul className="plan-features">
                                        {p.features.map((f: string, i: number) => (
                                            <li key={i}>{f}</li>
                                        ))}
                                    </ul>
                                )}

                                {p.slug?.current && (
                                    <Link
                                        href={`/plans/${p.slug.current}`}
                                        className="btn btn-primary wide"
                                    >
                                        {p.buttonText || "Join Today"}
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
