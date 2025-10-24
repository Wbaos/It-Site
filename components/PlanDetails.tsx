"use client";

import { PortableText } from "@portabletext/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Loader from "./common/Loader";

interface Plan {
    _id: string;
    title: string;
    slug?: { current: string };
    price: number | string;
    annualPrice?: number | string;
    duration: string;
    features: string[];
    description?: any;
}

interface PlanDetailsProps {
    plan: Plan;
}

export function PlanDetails({ plan }: PlanDetailsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);

    const interval = searchParams.get("interval") === "year" ? "year" : "month";

    const monthly = plan.price ? Number(plan.price) : null;
    const yearly = plan.annualPrice ? Number(plan.annualPrice) : null;

    let displayPrice: number | null = null;
    if (interval === "year") {
        if (yearly && !isNaN(yearly)) {
            displayPrice = yearly;
        } else {
            console.warn(` Missing annualPrice for plan: ${plan.title}`);
        }
    } else {
        if (monthly && !isNaN(monthly)) {
            displayPrice = monthly;
        } else {
            console.warn(` Missing monthly price for plan: ${plan.title}`);
        }
    }

    const durationDisplay = interval === "year" ? "/year" : "/month";

    const handleSubscribe = async () => {
        try {
            setLoading(true);

            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    planSlug: plan.slug?.current || plan.slug,
                    interval,
                    returnUrl: window.location.href,
                }),
            });

            const data = await res.json();
            if (res.ok && data.url) {
                window.location.href = data.url;
            } else {
                alert(data.error || "Subscription failed.");
                setLoading(false);
            }
        } catch (err) {
            console.error("Error subscribing:", err);
            alert("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    if (loading) return <Loader message="Redirecting to checkout..." />;

    return (
        <section className="plan-section">
            <div className="plan-container">
                <header className="plan-header">
                    <h1 className="plan-title">{plan.title}</h1>

                    {displayPrice !== null ? (
                        <p className="plan-price">
                            ${displayPrice.toFixed(2)}
                            <span className="plan-duration">{durationDisplay}</span>
                        </p>
                    ) : (
                        <p className="plan-price missing">
                            <span>Price unavailable</span>
                            <small>Please update this plan in Sanity.</small>
                        </p>
                    )}
                </header>

                {plan.features?.length > 0 && (
                    <div className="plan-features">
                        <h2>What’s included:</h2>
                        <ul>
                            {plan.features.map((f, i) => (
                                <li key={i}>{f}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {plan.description && (
                    <div className="plan-description">
                        <PortableText value={plan.description} />
                    </div>
                )}

                <div className="plan-actions">
                    <button
                        onClick={handleSubscribe}
                        className="btn btn-primary wide"
                        disabled={loading || displayPrice === null}
                    >
                        {loading ? "Processing..." : "Subscribe Now"}
                    </button>
                </div>
            </div>
        </section>
    );
}
