"use client";
import { useState } from "react";
import Link from "next/link";

export default function PricingClient({ plans }: { plans: any[] }) {
    const [isAnnual, setIsAnnual] = useState(false);

    return (
        <section
            id="pricing"
            className={`pricing-section ${isAnnual ? "annual-mode" : "monthly-mode"}`}
        >
            <div className="pricing-container">
                <h2 className="pricing-heading">Our Pricing</h2>

                {/* Toggle */}
                <div className="toggle-wrapper">
                    <span className={!isAnnual ? "active" : ""}>Monthly</span>
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={isAnnual}
                            onChange={() => setIsAnnual(!isAnnual)}
                        />
                        <span className="slider"></span>
                    </label>
                    <span className={isAnnual ? "active" : ""}>Annually</span>
                </div>

                <p className="discount-note">
                    Save up to <strong>20%</strong> with annual billing!
                </p>

                <div className="pricing-grid">
                    {plans.map((p) => {
                        let displayPrice: number | null = null;

                        if (isAnnual) {
                            if (p.annualPrice && !isNaN(Number(p.annualPrice))) {
                                displayPrice = Number(p.annualPrice);
                            } else {
                                displayPrice = null;
                            }
                        } else {
                            if (p.price && !isNaN(Number(p.price))) {
                                displayPrice = Number(p.price);
                            } else {
                                displayPrice = null;
                            }
                        }

                        const durationDisplay = isAnnual ? "/year" : "/month";

                        return (
                            <div
                                key={p._id}
                                className={`pricing-card ${p.featured ? "featured" : ""}`}
                            >
                                <h3 className="plan-title">{p.title}</h3>

                                {displayPrice !== null ? (
                                    <p className="plan-price">
                                        ${displayPrice.toFixed(2)}
                                        <span>{durationDisplay}</span>
                                    </p>
                                ) : (
                                    <p className="plan-price missing">
                                        <span>Price unavailable</span>
                                        <small>Please update this plan in Sanity</small>
                                    </p>
                                )}

                                {p.features?.length > 0 && (
                                    <ul className="plan-features">
                                        {p.features.map((f: string, i: number) => (
                                            <li key={i}>{f}</li>
                                        ))}
                                    </ul>
                                )}

                                {p.slug?.current && displayPrice !== null && (
                                    <Link
                                        href={`/plans/${p.slug.current}?interval=${isAnnual ? "year" : "month"}`}
                                        className="btn wide"
                                        onClick={() => {
                                            sessionStorage.setItem("scrollY", window.scrollY.toString());
                                        }}
                                    >
                                        Learn More
                                        <span className="sr-only">
                                            about the {p.title.replace(/Plan/i, "").trim()} plan ({isAnnual ? "annual" : "monthly"} billing)
                                        </span>
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
