"use client";
import { useState } from "react";

interface FaqItem {
  q: string;
  a: string;
}

export default function FaqAccordion({
  faqs,
  locale = "en",
}: {
  faqs: FaqItem[];
  locale?: "en" | "es";
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="service-faq">
      <h2 className="faq-heading">
        {locale === "es" ? "Preguntas Frecuentes" : "Frequently Asked Questions"}
      </h2>
      <ul className="faq-list">
        {faqs.map((faq, i) => (
          <li key={i} className="faq-item">
            <details open={openIndex === i}>
              <summary
                className="faq-question"
                onClick={(e) => {
                  e.preventDefault(); 
                  handleToggle(i);
                }}
              >
                {faq.q}
                <span className="faq-toggle">
                  {openIndex === i ? "×" : "+"}
                </span>
              </summary>
              <p className="faq-answer">{faq.a}</p>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
