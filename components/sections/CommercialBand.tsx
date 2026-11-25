import Link from "next/link";
import { serviceHref } from "@/lib/serviceTwins";

// Commercial band on the home (added Nov 25, 2026): HOAs, property
// managers and businesses get their own entry point from the home, the
// way the big irrigation companies run a separate commercial track —
// before this, the commercial page was only reachable from the services
// hub and the related-services box. Copy mirrors the commercial service
// page's own approved text (free irrigation audit, recurring plan,
// monthly wet checks, written report after every visit). It never
// claims insurance or licensing: the audit is free and the paperwork
// conversation happens when a community says yes.
export default function CommercialBand({
  locale = "en",
  phoneTel,
  phoneDisplay,
}: {
  locale?: "en" | "es";
  phoneTel?: string;
  phoneDisplay?: string;
}) {
  const isSpanish = locale === "es";
  const trustItems = isSpanish
    ? [
        "Auditoría gratis de riego",
        "Chequeos mensuales",
        "Reporte escrito en cada visita",
        "Servicio en inglés y español",
      ]
    : [
        "Free irrigation audit",
        "Monthly wet checks",
        "Written report after every visit",
        "Service in English and Spanish",
      ];
  return (
    <section
      className="section commercial-band"
      role="region"
      aria-labelledby="commercial-band-title"
    >
      <div className="site-container-services">
        <div className="category-cta-section">
          <h2 id="commercial-band-title" className="category-cta-title">
            {isSpanish
              ? "Irrigación para HOAs, administradores y negocios"
              : "Irrigation for HOAs, Property Managers & Businesses"}
          </h2>
          <p className="category-cta-desc">
            {isSpanish
              ? "Áreas comunes, entradas y jardines en un plan recurrente: auditoría gratis de riego primero, chequeos mensuales y un reporte escrito después de cada visita, para que el sistema sea una cosa menos de qué preocuparse."
              : "Common areas, entrances and landscapes on a recurring plan: a free irrigation audit first, monthly wet checks and a written report after every visit, so the system is one less thing on your plate."}
          </p>
          <div className="category-cta-btn-row">
            <Link
              className="category-cta-btn"
              href={serviceHref("commercial-irrigation-hoa-services", locale)}
            >
              {isSpanish ? "Ver servicios comerciales" : "See commercial services"}
            </Link>
            {phoneTel ? (
              <a className="category-cta-btn category-cta-btn-dark" href={`tel:${phoneTel}`}>
                {isSpanish ? `Llamar al ${phoneDisplay ?? ""}` : `Call ${phoneDisplay ?? ""}`}
              </a>
            ) : null}
          </div>
          <div className="category-cta-trust-row">
            {trustItems.map((item) => (
              <span key={item} className="category-cta-trust-item">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
