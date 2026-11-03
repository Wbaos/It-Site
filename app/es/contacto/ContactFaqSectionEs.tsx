"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

type FaqItem = {
  q: string;
  a: string;
};

const DEFAULT_FAQS_ES: FaqItem[] = [
  {
    q: "¿Cómo agendo una cita de servicio?",
    a: "Puedes reservar en línea con nuestro flujo de reserva o contactarnos directamente para agendar una visita de servicio que te convenga.",
  },
  {
    q: "¿Cuál es su horario de servicio?",
    a: "CallTechCare normalmente presta servicios de lunes a sábado. Si necesitas ayuda fuera del horario normal, contáctanos y haremos lo posible por atenderte.",
  },
  {
    q: "¿Cómo sigo mi solicitud de servicio?",
    a: "Después de enviar tu solicitud, recibirás un correo de confirmación con los detalles de tu servicio. Si no lo ves, revisa tu carpeta de spam o contáctanos para una actualización.",
  },
  {
    q: "¿Qué métodos de pago aceptan?",
    a: "Aceptamos las principales tarjetas de crédito y débito por pago seguro, y también aceptamos pagos en efectivo para servicios a domicilio. Pueden haber opciones adicionales según el servicio.",
  },
  {
    q: "¿Ofrecen garantía en sus servicios?",
    a: "Sí. CallTechCare ofrece 1 año de garantía en servicios de sprinklers e instalación de cámaras de seguridad.",
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
    q: "¿Sus técnicos tienen experiencia y seguro?",
    a: "Nuestros técnicos tienen experiencia y siguen las mejores prácticas de la industria para asegurar un servicio seguro y confiable. Si tienes requisitos específicos, avísanos antes de agendar.",
  },
  {
    q: "¿Qué áreas atienden?",
    a: "CallTechCare presta servicio a domicilio en Miami-Dade y Broward, incluyendo Miami, Miramar, Pembroke Pines, Hollywood, Fort Lauderdale y otras comunidades del sur de Florida.",
  },
];

export default function ContactFaqSectionEs({
  faqs = DEFAULT_FAQS_ES,
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
          Preguntas frecuentes
        </h2>

        <p className="contact-faq-subtitle">
          Encuentra respuestas rápidas a preguntas comunes
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
          placeholder="Buscar preguntas..."
          aria-label="Buscar preguntas"
        />
      </div>

      {/* FAQ List */}
      <div className="contact-faq-list" role="list">
        {filtered.length === 0 ? (
          <div className="contact-faq-empty">
            No se encontraron resultados. Intenta otra búsqueda.
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
