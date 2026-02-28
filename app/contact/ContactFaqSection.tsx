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
    a: "You can book online using our booking flow, or call us to schedule a time that works best for you.",
  },
  {
    q: "What are your service hours?",
    a: "We offer service Monday through Saturday. If you need help outside normal hours, contact us and we’ll do our best to accommodate.",
  },
  {
    q: "How can I track my service request?",
    a: "After you submit a request, you’ll receive confirmation by email. If you don’t see it, check spam/junk, or contact support for an update.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept major credit and debit cards through secure checkout, and other options may be available depending on the service.We also accept cash payments for in-home services.",
  },
  {
    q: "Do you offer warranties on your services?",
    a: "Yes — we offer a 90-day warranty on our services. If you experience any issues within that period, please contact us for assistance.",
  },
  {
    q: "Can I cancel or reschedule my appointment?",
    a: "Yes. Please reach out as soon as possible so we can reschedule or cancel. There are no cancellation fees if you cancel at least 24 hours in advance.",
  },
  {
    q: "Are your technicians certified and insured?",
    a: "Our technicians are experienced and follow best practices. If you have specific compliance requirements, let us know before scheduling.",
  },
  {
    q: "What areas do you serve?",
    a: "We provide in-home and remote support across South Florida. If you’re unsure whether you’re in our service area, contact us.",
  },
];

export default function ContactFaqSection({ faqs = DEFAULT_FAQS }: { faqs?: FaqItem[] }) {
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter((item) => {
      return item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q);
    });
  }, [faqs, query]);

  return (
    <div className="contact-faq">
      {faqSchema ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      ) : null}
      <header className="contact-faq-header">
        <h2 className="contact-faq-title">Frequently Asked Questions</h2>
        <p className="contact-faq-subtitle">Find quick answers to common questions</p>
      </header>

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

      <div className="contact-faq-list" role="list">
        {filtered.length === 0 ? (
          <div className="contact-faq-empty">No results found. Try a different search.</div>
        ) : (
          filtered.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div className="contact-faq-item" role="listitem" key={`${item.q}-${idx}`}>
                <button
                  type="button"
                  className="contact-faq-question"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                >
                  <span className="contact-faq-questionText">{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={`contact-faq-chevron ${isOpen ? "is-open" : ""}`}
                    aria-hidden="true"
                  />
                </button>

                {isOpen && <div className="contact-faq-answer">{item.a}</div>}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
