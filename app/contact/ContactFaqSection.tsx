"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

type FaqItem = {
  q: string;
  a: string;
};

const DEFAULT_FAQS: FaqItem[] = [
  {
    q: "How do I schedule a service appointment?",
    a: "You can book online using our booking flow or contact us directly to schedule a service visit that works best for you.",
  },
  {
    q: "What are your service hours?",
    a: "CallTechCare typically provides services Monday through Saturday. If you need assistance outside normal hours, contact us and we’ll do our best to accommodate your request.",
  },
  {
    q: "How can I track my service request?",
    a: "After you submit a request, you’ll receive a confirmation email with the details of your service. If you don’t see it, check your spam folder or contact us for an update.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept major credit and debit cards through secure checkout, and we also accept cash payments for in-home services. Additional payment options may be available depending on the service.",
  },
  {
    q: "Do you offer warranties on your services?",
    a: "Yes. CallTechCare offers a 90-day warranty on services such as TV mounting, security camera installation, Wi-Fi troubleshooting, computer support, and other home tech services.",
  },
  {
    q: "Can I cancel or reschedule my appointment?",
    a: "Yes. Please contact us as soon as possible to cancel or reschedule your appointment. There are no cancellation fees if you cancel at least 24 hours in advance.",
  },
  {
    q: "Are your technicians experienced and insured?",
    a: "Our technicians are experienced and follow industry best practices to ensure safe and reliable service. If you have specific requirements, please let us know before scheduling.",
  },
  {
    q: "What areas do you serve?",
    a: "CallTechCare provides in-home and remote support across Miami, Miramar, Pembroke Pines, Hollywood, Fort Lauderdale, and surrounding South Florida communities.",
  },
  {
    q: "Do you install TV wall mounts in Miami?",
    a: "Yes. CallTechCare provides professional TV wall mount installation services across Miami and surrounding South Florida areas, helping ensure the best viewing height and a clean installation.",
  },
];

export default function ContactFaqSection({
  faqs = DEFAULT_FAQS,
}: {
  faqs?: FaqItem[];
}) {
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  /* =========================
     FAQ STRUCTURED DATA
  ========================= */
  const faqSchema = useMemo(() => {
    const mainEntity = (faqs || [])
      .map((item) => {
        const q = String(item?.q || "").trim();
        const a = String(item?.a || "").trim();

        if (!q || !a) return null;

        return {
          "@type": "Question",
          name: q,
          acceptedAnswer: {
            "@type": "Answer",
            text: a,
          },
        };
      })
      .filter(Boolean);

    if (mainEntity.length === 0) return null;

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity,
    };
  }, [faqs]);

  /* =========================
     SEARCH FILTER
  ========================= */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return faqs;

    return faqs.filter((item) => {
      return (
        item.q.toLowerCase().includes(q) ||
        item.a.toLowerCase().includes(q)
      );
    });
  }, [faqs, query]);

  return (
    <div className="contact-faq">

      {/* FAQ Schema */}
      {faqSchema ? (
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      ) : null}

      <header className="contact-faq-header">
        <h2 className="contact-faq-title">
          Frequently Asked Questions
        </h2>

        <p className="contact-faq-subtitle">
          Find quick answers to common questions
        </p>
      </header>

      {/* Search */}
      <div className="contact-faq-search">
        <div className="contact-faq-searchIcon" aria-hidden="true">
          <Search size={18} />
        </div>

        <input
          className="contact-faq-searchInput"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpenIndex(null);
          }}
          placeholder="Search FAQs..."
          aria-label="Search FAQs"
        />
      </div>

      {/* FAQ List */}
      <div className="contact-faq-list" role="list">
        {filtered.length === 0 ? (
          <div className="contact-faq-empty">
            No results found. Try a different search.
          </div>
        ) : (
          filtered.map((item, idx) => {
            const isOpen = openIndex === idx;
            const answerId = `faq-answer-${idx}`;

            return (
              <div
                className="contact-faq-item"
                role="listitem"
                key={`${item.q}-${idx}`}
              >
                <button
                  type="button"
                  className="contact-faq-question"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() =>
                    setOpenIndex(isOpen ? null : idx)
                  }
                >
                  <span className="contact-faq-questionText">
                    {item.q}
                  </span>

                  <ChevronDown
                    size={18}
                    className={`contact-faq-chevron ${
                      isOpen ? "is-open" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isOpen && (
                  <div
                    id={answerId}
                    className="contact-faq-answer"
                  >
                    {item.a}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}