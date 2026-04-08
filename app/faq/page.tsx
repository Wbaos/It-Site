import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ | Sprinkler Repair Miami & Broward | CallTechCare",

  description:
    "Find answers to common questions about CallTechCare services in Miami and Broward: sprinkler repair & irrigation, security camera installation, and expert tech support.",

  alternates: {
    canonical: "https://www.calltechcare.com/faq",
  },
};

export default function FAQPage() {
  const faqs = [
    {
      q: "What areas do you serve?",
      a: "CallTechCare provides on-site services across Miami-Dade and Broward, including Miami, Miramar, Pembroke Pines, Hollywood, and Fort Lauderdale.",
    },
    {
      q: "Do you offer sprinkler repair & irrigation services?",
      a: "Yes. Sprinkler repair and irrigation troubleshooting are our primary services. We help with leaks, broken heads, poor coverage, controller/timer issues, and system optimization.",
    },
    {
      q: "Do you install security cameras?",
      a: "Yes. We install security cameras and help with placement, wiring, network connectivity, and troubleshooting for residential and small business systems.",
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
      q: "Do you mount TVs and help with setup?",
      a: "Yes. We provide professional TV mounting and can also help with smart TV setup, streaming devices, cable management, and basic audio configuration.",
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
          Here are answers to common questions about our services in Miami and Broward, including{" "}
          <Link href="/sprinkler-repair-miami">Sprinkler Repair Miami</Link>,{" "}
          <Link href="/services/home-security">security camera installation</Link>, and{" "}
          <Link href="/services/wifi-and-internet">tech support</Link>.
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