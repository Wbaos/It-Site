import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ – CallTechCare | Local Home, Outdoor & Tech Services",

  description:
    "Find answers to common questions about CallTechCare services including TV mounting, security camera installation, Wi-Fi troubleshooting, computer support, sprinkler repair, and home tech services across Miami and South Florida.",

  alternates: {
    canonical: "https://www.calltechcare.com/faq",
  },
};

export default function FAQPage() {
  const faqs = [
    {
      q: "What areas do you serve?",
      a: "CallTechCare provides in-home and on-site services across Miami, Miramar, Pembroke Pines, Hollywood, Fort Lauderdale, and surrounding South Florida communities.",
    },
    {
      q: "Do you install security cameras?",
      a: "Yes. We install security cameras and help with proper placement, wiring, network connectivity, and basic troubleshooting for residential and small business security systems.",
    },
    {
      q: "Do you mount TVs and help with setup?",
      a: "Yes. We provide professional TV mounting and can also help with smart TV setup, streaming devices, cable management, and basic audio configuration.",
    },
    {
      q: "Can you help with Wi-Fi and internet issues?",
      a: "Yes. We troubleshoot slow internet, improve Wi-Fi coverage, and help with router, mesh systems, and home network setup for reliable connectivity.",
    },
    {
      q: "Do you offer computer and printer support?",
      a: "Yes. We assist with computer troubleshooting, software setup, virus cleanup, and printer installation/configuration for homes and small offices.",
    },
    {
      q: "Do you offer phone and tablet support?",
      a: "Yes. We help with phone and tablet setup, email configuration, data transfer, and basic training so you can use your devices confidently.",
    },
    {
      q: "Do you offer sprinkler & irrigation services?",
      a: "Yes. We provide sprinkler and irrigation services including repairs, troubleshooting, controller setup, and system optimization.",
    },
    {
      q: "Do you help with landscaping or tree trimming?",
      a: "Yes. We provide assistance with tree trimming and basic landscaping services for common residential needs.",
    },
    {
      q: "Do you help seniors with basic tech setups?",
      a: "Absolutely. We specialize in patient, step-by-step assistance for seniors with phones, computers, smart TVs, Wi-Fi networks, and other everyday technology.",
    },
    {
      q: "How can I book a service?",
      a: "You can book directly on our website using the booking form or call us at (786) 366-2729 to schedule an appointment.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept major credit and debit cards through secure checkout, and payment can also be completed at the end of your appointment.",
    },
    {
      q: "Do you offer monthly or yearly plans?",
      a: "Yes. Our CallTechCare support plans provide ongoing tech support for a flat monthly or annual rate, ideal for homeowners and seniors who want reliable help anytime.",
    },
    {
      q: "Can I get remote help instead of an in-person visit?",
      a: "Yes. Many issues can be resolved through our secure remote support software, allowing us to fix problems without needing to visit your home.",
    },
    {
      q: "What if I’m not satisfied with the service?",
      a: "Your satisfaction is our priority. If something wasn’t fully resolved, we will work with you to correct the issue or arrange a follow-up visit.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <main className="faq-page-container">

      {/* FAQ Structured Data */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <div className="faq-page">

        <h1 className="faq-title">Frequently Asked Questions</h1>

        <p className="faq-intro">
          Here are answers to common questions about our services including{" "}
          <Link href="/services/tv-wall-mount-installation-services">TV mounting</Link>,{" "}
          <Link href="/services/home-security">security camera installation</Link>,{" "}
          <Link href="/services/wifi-and-internet">Wi-Fi troubleshooting</Link>,{" "}
          <Link href="/services/computer-and-printers">computer support</Link>,{" "}
          and <Link href="/services/landscaping">sprinkler & landscaping services</Link>{" "}
          across Miami and South Florida.
        </p>

        <div className="faq-container">
          {faqs.map((faq, i) => (
            <details key={i} className="faq-item">
              <summary className="faq-question">
                {faq.q}
                <span className="faq-arrow">▼</span>
              </summary>

              <p className="faq-answer">{faq.a}</p>
            </details>
          ))}
        </div>

        <section className="faq-contact">
          <p>
            Still have questions?{" "}
            <Link href="/contact" className="faq-link">
              Contact our team
            </Link>{" "}
            and we’ll be happy to help.
          </p>
        </section>

      </div>
    </main>
  );
}