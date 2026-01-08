import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "About Us – CallTechCare | Tech Support for Seniors & Homes",
    description:
        "Learn more about CallTechCare, our mission to make technology easier for seniors, and how we provide trusted tech support across South Florida.",
};

export default function AboutPage() {
    return (
        <main className=" about-page-container">
            <div className="about-page">
            <section className="about-hero">
                <h1 className="about-title">About CallTechCare</h1>
                <p className="about-subtitle">
                    Reliable Tech Support for Seniors & Homes in South Florida
                </p>
            </section>

            <section className="about-section">
                <h2 className="about-heading">Our Mission</h2>
                <p className="about-text">
                    At CallTechCare, our mission is to make technology simple, safe, and
                    accessible for everyone — especially seniors who want to stay
                    connected and confident with their devices. We believe that great tech
                    support starts with patience, trust, and a friendly human touch.
                </p>
            </section>

            <section className="about-section">
                <h2 className="about-heading">Our Story</h2>
                <p className="about-text">
                    We started CallTechCare after realizing how many people — particularly
                    older adults — felt frustrated or left behind by constant tech
                    changes. Whether it’s setting up a smart TV, syncing a phone, or
                    troubleshooting Wi-Fi, we’re here to help with honesty and care.
                </p>
                <p className="about-text">
                    Based in South Florida, we proudly serve homes and small offices from
                    Broward County down to Homestead, combining technical expertise with
                    real-world understanding.
                </p>
            </section>

            <section className="about-values">
                <h2 className="about-heading">Our Values</h2>
                <div className="values-grid">
                    <div className="value-card">
                        <h3>🧑‍🤝‍🧑 Compassion</h3>
                        <p>We treat every client like family — with patience, respect, and empathy.</p>
                    </div>
                    <div className="value-card">
                        <h3>⚙️ Reliability</h3>
                        <p>We show up on time, solve problems efficiently, and stand behind our work.</p>
                    </div>
                    <div className="value-card">
                        <h3>🔒 Trust</h3>
                        <p>Your privacy and security matter. We handle every device with care and discretion.</p>
                    </div>
                </div>
            </section>

            <section className="about-cta">
                <h2>Need Tech Help Today?</h2>
                <p>
                    Let’s make technology work for you — not against you. Book a trusted
                    in-home or remote support session with our experts.
                </p>
                <Link href="/#booking" className="about-button">
                    Book a Service
                </Link>
            </section>
            </div>
        </main>
    );
}
