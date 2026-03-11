import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About CallTechCare | TV Mounting, Security Cameras & Tech Support in Miami",
  description:
    "Learn about CallTechCare, a trusted provider of TV mounting, security camera installation, tech support, sprinkler repair, and home services across Miami, Miramar, Pembroke Pines, and South Florida.",
};

export default function AboutPage() {
  return (
    <main className="about-page-container">
      <div className="about-page">

        <section className="about-hero">
          <h1 className="about-title">About CallTechCare</h1>
          <p className="about-subtitle">
            Reliable TV Mounting, Security Camera, Sprinkler & Tech Services in South Florida
          </p>
        </section>

        <section className="about-section">
          <h2 className="about-heading">Our Mission</h2>
          <p className="about-text">
            At CallTechCare, our mission is to make home services simple, safe, and accessible.
            We specialize in in-home tech support including TV mounting, security camera installation,
            Wi-Fi troubleshooting, computer setup, printer support, and smart device configuration.
            We also provide outdoor services such as sprinkler and irrigation repair and tree trimming
            for homeowners across South Florida.
          </p>
        </section>

        <section className="about-section">
          <h2 className="about-heading">Our Story</h2>
          <p className="about-text">
            We started CallTechCare after realizing how many people — particularly older adults —
            felt frustrated or left behind by constant technology changes. Whether it’s setting up
            a smart TV, syncing a phone, or troubleshooting Wi-Fi, we’re here to help with honesty
            and patience.
          </p>

          <p className="about-text">
            As our clients continued to trust us, many also asked for help with other practical
            services around their homes. Over time we expanded to offer reliable home and outdoor
            services alongside our technology support. Based in Miami, we proudly serve homeowners
            across Miami, Miramar, Pembroke Pines, Hollywood, Fort Lauderdale, and surrounding
            South Florida communities.
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
            Book a trusted service visit for TV wall mounting, security camera installation,
            Wi-Fi troubleshooting, computer and printer support, phone and tablet help,
            senior-friendly tech support, or outdoor services like sprinkler repair,
            irrigation troubleshooting, and tree trimming.
          </p>

          <Link href="/#booking" className="about-button">
            Book a Service
          </Link>
        </section>

      </div>
    </main>
  );
}