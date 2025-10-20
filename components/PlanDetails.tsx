"use client";

import { PortableText } from "@portabletext/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loader from "./common/Loader";

interface Plan {
    _id: string;
    title: string;
    price: number;
    duration: string;
    features: string[];
    description?: any;
}

interface PlanDetailsProps {
    plan: Plan;
}

export function PlanDetails({ plan }: PlanDetailsProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ planName: plan.title }),
                credentials: "include",
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

    if (loading) {
        return <Loader message="Redirecting to checkout..." />;
    }

    return (
        <section className="plan-section">
            <div className="plan-container">
                <button className="plan-container-back-btn" onClick={() => router.back()}>
                    ← Back
                </button>

                <header className="plan-header">
                    <h1 className="plan-title">{plan.title}</h1>
                    <p className="plan-price">
                        ${plan.price}
                        <span className="plan-duration">{plan.duration}</span>
                    </p>
                </header>

                {plan.features.length > 0 && (
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
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Subscribe Now"}
                    </button>
                </div>
            </div>
        </section>
    );
}
