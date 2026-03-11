import type { Metadata } from "next";
import Link from "next/link";
import {
  Headphones,
  Phone,
  Mail,
  HelpCircle,
  FileText,
  Clock,
  Users,
  BadgeCheck,
  Zap
} from "lucide-react";

import ContactFaqSection from "./ContactFaqSection";
import ContactMessageSection from "./ContactMessageSection";

/* =========================
   PAGE METADATA
========================= */

export const metadata: Metadata = {
  title: "Contact Us – CallTechCare | Local Home, Outdoor & Tech Services",

  description:
    "Contact CallTechCare for TV mounting, security camera installation, Wi-Fi troubleshooting, computer support, sprinkler repair, and home services across Miami and South Florida.",

  alternates: {
    canonical: "https://www.calltechcare.com/contact",
  },
};

/* =========================
   PAGE COMPONENT
========================= */

export default function ContactPage() {

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact CallTechCare",
    url: "https://www.calltechcare.com/contact",
    about: {
      "@type": "LocalBusiness",
      name: "CallTechCare",
      telephone: "+1-786-366-2729",
      email: "support@calltechcare.com",
      areaServed: "South Florida"
    }
  };

  return (
    <main className="contact-page">

      {/* ContactPage Schema */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactSchema),
        }}
      />

      {/* Hero */}
      <section className="contact-support-section contact-support-heroSection">
        <div className="contact-support-inner">
          <header className="contact-support-hero">

            <div
              className="contact-support-heroIcon"
              aria-hidden="true"
            >
              <Headphones size={34} />
            </div>

            <h1 className="contact-support-title">
              Customer Support
            </h1>

            <p className="contact-support-subtitle">
              We're here to help. Contact CallTechCare for service requests,
              quotes, or questions about our home, outdoor, and tech services
              across Miami and South Florida.
            </p>

          </header>
        </div>
      </section>

      {/* Stats */}
      <section
        className="contact-support-section contact-support-statsSection"
        aria-label="Support statistics"
      >
        <div className="contact-support-inner">
          <div className="contact-support-stats">

            <div className="contact-support-stat">
              <div className="contact-support-statTop">
                <Zap size={35} strokeWidth={2.2}
                  className="contact-support-statIcon"
                  aria-hidden="true"
                />
                <div className="contact-support-statValue">
                  &lt; 15min
                </div>
              </div>

              <div className="contact-support-statLabel">
                Avg Response Time
              </div>
            </div>

            <div className="contact-support-stat">
              <div className="contact-support-statTop">
                <BadgeCheck size={35} strokeWidth={2.2}
                  className="contact-support-statIcon"
                  aria-hidden="true"
                />
                <div className="contact-support-statValue">
                  98%
                </div>
              </div>

              <div className="contact-support-statLabel">
                Resolution Rate
              </div>
            </div>

            <div className="contact-support-stat">
              <div className="contact-support-statTop">
                <Users size={35} strokeWidth={2.2}
                  className="contact-support-statIcon"
                  aria-hidden="true"
                />
                <div className="contact-support-statValue">
                  50K+
                </div>
              </div>

              <div className="contact-support-statLabel">
                Happy Customers
              </div>
            </div>

            <div className="contact-support-stat">
              <div className="contact-support-statTop">
                <Clock size={35} strokeWidth={2.2}
                  className="contact-support-statIcon"
                  aria-hidden="true"
                />
                <div className="contact-support-statValue">
                  Mon–Sat
                </div>
              </div>

              <div className="contact-support-statLabel">
                Support Availability
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Support Options */}
      <section
        className="contact-support-section contact-support-optionsSection"
        aria-label="Support options"
      >
        <div className="contact-support-inner">

          <div className="contact-support-options">

            <h2 className="contact-support-optionsTitle">
              How Can We Help You?
            </h2>

            <div className="contact-support-grid">

              <a
                className="contact-support-card"
                href="tel:+17863662729"
              >
                <div
                  className="contact-support-cardIcon contact-support-cardIcon--phone"
                  aria-hidden="true"
                >
                  <Phone size={22} />
                </div>

                <h3 className="contact-support-cardTitle">
                  Phone Support
                </h3>

                <p className="contact-support-cardText">
                  Talk to a live technician
                </p>

                <div className="contact-support-cardLink">
                  +1 (786) 366-2729
                </div>

                <div className="contact-support-cardMeta">
                  Available Mon–Sat
                </div>
              </a>

              <a
                className="contact-support-card"
                href="mailto:support@calltechcare.com"
              >
                <div
                  className="contact-support-cardIcon contact-support-cardIcon--mail"
                  aria-hidden="true"
                >
                  <Mail size={22} />
                </div>

                <h3 className="contact-support-cardTitle">
                  Email Support
                </h3>

                <p className="contact-support-cardText">
                  Get a response within 24 hours
                </p>

                <div className="contact-support-cardLink">
                  support@calltechcare.com
                </div>
              </a>

              <Link
                className="contact-support-card"
                href="#contact-faq"
              >
                <div
                  className="contact-support-cardIcon contact-support-cardIcon--faq"
                  aria-hidden="true"
                >
                  <HelpCircle size={22} />
                </div>

                <h3 className="contact-support-cardTitle">
                  FAQs
                </h3>

                <p className="contact-support-cardText">
                  Find quick answers
                </p>
              </Link>

              <Link
                className="contact-support-card"
                href="/request-quote"
              >
                <div
                  className="contact-support-cardIcon contact-support-cardIcon--quote"
                  aria-hidden="true"
                >
                  <FileText size={22} />
                </div>

                <h3 className="contact-support-cardTitle">
                  Request a Quote
                </h3>

                <p className="contact-support-cardText">
                  Get a free estimate
                </p>
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="contact-faq"
        className="contact-support-section contact-faq-section"
      >
        <div className="contact-support-inner contact-support-inner--narrow">
          <ContactFaqSection />
        </div>
      </section>

      {/* Contact Form */}
      <section
        className="contact-support-section contact-message-section"
      >
        <div className="contact-support-inner">
          <ContactMessageSection />
        </div>
      </section>

    </main>
  );
}