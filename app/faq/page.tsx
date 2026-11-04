import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ | Sprinkler Repair Miami & Broward | CallTechCare",

  description: "Find answers to common questions about CallTechCare sprinkler repair and irrigation in Miami and Broward: costs, same-day service, leaks, valves, and timers.",

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
      q: "Do you repair sprinkler systems in HOA communities?",
      a: "Yes. We repair and install sprinkler systems in HOA communities across Miami and Broward. Call (786) 366-2729 and we'll confirm coverage for your community.",
    },
    
    {
      q: "How can I book a service?",
      a: "You can request service directly on our website using the request form or call us at (786) 366-2729 to schedule an appointment.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept cash, checks, major credit and debit cards, and Zelle, paid in person at the end of your appointment. There is no online checkout.",
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
          <Link href="/sprinkler-repair-miami">Sprinkler Repair Miami</Link> and{" "}
          <Link href="/services/home-security">security camera installation</Link>.
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