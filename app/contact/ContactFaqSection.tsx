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
    a: "CallTechCare provides services Monday–Saturday 8am–7pm and Sunday 9am–6pm. Emergencies are handled same-day within those business hours.",
  },
  {
    q: "How can I track my service request?",
    a: "After you submit a request, you’ll receive a confirmation email with the details of your service. If you don’t see it, check your spam folder or contact us for an update.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept cash, checks, major credit and debit cards, and Zelle, paid in person at the end of your appointment. There is no online checkout: you call us, we inspect in person, and you pay after the work is done.",
  },
  {
    q: "Do you offer warranties on your services?",
    a: "Yes. CallTechCare offers a 1-year warranty on sprinkler services and security camera installation when CallTechCare performs the work and provides the materials.",
  },
  {
    q: "Do you handle sprinkler emergencies?",
    a: "Yes. If you have a sprinkler emergency, such as a major leak or a zone that won't turn off, call us and we'll prioritize same-day service during our business hours (Monday–Saturday 8am–7pm, Sunday 9am–6pm).",
  },
  {
    q: "Can I cancel or reschedule my appointment?",
    a: "Yes. Please contact us as soon as possible to cancel or reschedule your appointment. There are no cancellation fees if you cancel at least 24 hours in advance.",
  },
  {
    q: "Are your technicians experienced?",
    a: "Yes. Our technicians work in person at your home, inspect first, then give you a clear estimate before starting. Work is backed by our 1-year warranty when CallTechCare performs the work and provides the materials, and we hold a 5.0 rating from 26 Google reviews.",
  },
  {
    q: "What areas do you serve?",
    a: "CallTechCare provides in-home service across Miami-Dade and Broward County, including Miami, Miramar, Pembroke Pines, Hollywood, Fort Lauderdale, and surrounding South Florida communities.",
  },
];

const DEFAULT_FAQS_ES: FaqItem[] = [
  {
    q: "¿Cómo agendo una cita de servicio?",
    a: "Puedes reservar en línea con nuestro flujo de reserva o contactarnos directamente para agendar una visita de servicio que te convenga.",
  },
  {
    q: "¿Cuál es su horario de servicio?",
    a: "CallTechCare presta servicios de lunes a sábado de 8am a 7pm y domingo de 9am a 6pm. Las emergencias se atienden el mismo día dentro de ese horario.",
  },
  {
    q: "¿Cómo sigo mi solicitud de servicio?",
    a: "Después de enviar tu solicitud, recibirás un correo de confirmación con los detalles de tu servicio. Si no lo ves, revisa tu carpeta de spam o contáctanos para una actualización.",
  },
  {
    q: "¿Qué métodos de pago aceptan?",
    a: "Aceptamos efectivo, cheques, tarjetas de crédito y débito, y Zelle, pagados en persona al final de tu cita. No hay pago en línea: nos llamas, inspeccionamos en persona y pagas después de que el trabajo esté hecho.",
  },
  {
    q: "¿Ofrecen garantía en sus servicios?",
    a: "Sí. CallTechCare ofrece 1 año de garantía en servicios de sprinklers e instalación de cámaras de seguridad cuando CallTechCare hace el trabajo y provee los materiales.",
  },
  {
    q: "¿Atienden emergencias de sprinklers?",
    a: "Sí. Si tienes una emergencia de sprinklers, como una fuga grande o una zona que no se apaga, llámanos y priorizaremos el servicio el mismo día dentro de nuestro horario de servicio (lunes a sábado 8am–7pm, domingo 9am–6pm).",
  },
  {
    q: "¿Puedo cancelar o reprogramar mi cita?",
    a: "Sí. Contáctanos lo antes posible para cancelar o reprogramar tu cita. No hay cargos por cancelación si cancelas con al menos 24 horas de anticipación.",
  },
  {
    q: "¿Sus técnicos tienen experiencia?",
    a: "Sí. Nuestros técnicos trabajan en persona en tu casa, primero inspeccionan y luego te dan un estimado claro antes de empezar. El trabajo tiene nuestra garantía de 1 año cuando CallTechCare hace el trabajo y provee los materiales, y tenemos una calificación 5.0 con 26 reseñas en Google.",
  },
  {
    q: "¿Qué áreas atienden?",
    a: "CallTechCare presta servicio a domicilio en Miami-Dade y Broward, incluyendo Miami, Miramar, Pembroke Pines, Hollywood, Fort Lauderdale y otras comunidades del sur de Florida.",
  },
];

export default function ContactFaqSection({
  faqs,
  locale = "en",
}: {
  faqs?: FaqItem[];
  locale?: "en" | "es";
}) {
  const effectiveFaqs =
    faqs ?? (locale === "es" ? DEFAULT_FAQS_ES : DEFAULT_FAQS);
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  /* =========================
     FAQ STRUCTURED DATA
  ========================= */
  const faqSchema = useMemo(() => {
    const mainEntity = (effectiveFaqs || [])
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
  }, [effectiveFaqs]);

  /* =========================
     SEARCH FILTER
  ========================= */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return effectiveFaqs;

    return effectiveFaqs.filter((item) => {
      return (
        item.q.toLowerCase().includes(q) ||
        item.a.toLowerCase().includes(q)
      );
    });
  }, [effectiveFaqs, query]);

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
          {locale === "es" ? "Preguntas frecuentes" : "Frequently Asked Questions"}
        </h2>

        <p className="contact-faq-subtitle">
          {locale === "es" ? "Encuentra respuestas rápidas a preguntas comunes" : "Find quick answers to common questions"}
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
          placeholder={locale === "es" ? "Buscar preguntas..." : "Search FAQs..."}
          aria-label={locale === "es" ? "Buscar preguntas" : "Search FAQs"}
        />
      </div>

      {/* FAQ List */}
      <div className="contact-faq-list" role="list">
        {filtered.length === 0 ? (
          <div className="contact-faq-empty">
            {locale === "es" ? "No se encontraron resultados. Intenta otra búsqueda." : "No results found. Try a different search."}
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
                    aria-hidden={locale === "en" ? true : undefined}
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