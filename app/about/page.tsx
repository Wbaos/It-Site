import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About CallTechCare | Sprinkler Repair in Miami & Broward",
  description: "Learn about CallTechCare, Miami and Broward's sprinkler repair and irrigation company. Same-day service within business hours, free inspection, and a 1-year warranty when CallTechCare performs the work and provides the materials.",
  alternates: {
    canonical: "https://www.calltechcare.com/about",
  },
};

export default function AboutPage() {
  return (
    <main className="about-page-container">
      <div className="about-page">

        <section className="about-hero">
          <h1 className="about-title">About CallTechCare</h1>
          <p className="about-subtitle">
            Sprinkler Repair & Irrigation Services in Miami & Broward
          </p>
        </section>

        <section className="about-section">
          <h2 className="about-heading">Our Mission</h2>
          <p className="about-text">
            At CallTechCare, our mission is to make service simple, safe, and accessible for homeowners and small businesses.
            Our primary focus is <Link href="/sprinkler-repair-miami">sprinkler repair and irrigation troubleshooting in Miami and Broward</Link>.
            We also provide security camera installation
            when you need help beyond irrigation.
          </p>
        </section>

        <section className="about-section">
          <h2 className="about-heading">Our Story</h2>
          <p className="about-text">
            We started CallTechCare after seeing how many homeowners struggled to find reliable help for their sprinkler systems and cameras.
            Whether it’s a sprinkler system that won’t run, a leak in the yard, or cameras that need placing, we’re here to help with honesty and patience.
          </p>

          <p className="about-text">
            As our clients continued to trust us, we focused on what we do best: sprinkler repair and irrigation, plus security camera installation.
            Based in Miami, we proudly serve homeowners
            across Miami-Dade and Broward, including Miami, Miramar, Pembroke Pines, Hollywood, and Fort Lauderdale.
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
          <h2>Need Help Today?</h2>
          <p>
            Book a trusted service visit for sprinkler repair and irrigation troubleshooting in Miami and Broward.
            We also provide security camera installation.
            If you're looking for <Link href="/sprinkler-repair-miami">Sprinkler Repair Miami</Link>, start here.
          </p>

          <Link href="/request-quote" className="about-button">
            Book a Service
          </Link>
        </section>

      </div>
    </main>
  );
}