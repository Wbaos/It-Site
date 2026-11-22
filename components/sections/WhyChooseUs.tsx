import { ShieldCheck, Users, Clock, Smile } from "lucide-react";
import SpriteIcon from "@/components/common/SpriteIcon";
import type { HomePage } from "@/lib/sanityHome";
import {
  getGoogleRatingSummary,
  formatGoogleRating,
  type GoogleRatingSummary,
} from "@/lib/google-reviews";

function pick(en: string | undefined, es: string | undefined, isSpanish: boolean): string | undefined {
  if (isSpanish && es) return es;
  return en;
}

// The star is the sprite-backed SpriteIcon (same size/strokeWidth props
// as the Lucide icons it sits next to); the rest stay Lucide.
function StarIcon({
  size = 24,
  strokeWidth = 2,
}: {
  size?: number;
  strokeWidth?: number;
}) {
  return (
    <SpriteIcon name="star-lucide" size={size} strokeWidth={strokeWidth} />
  );
}

const WHY_ICONS = [ShieldCheck, StarIcon, Users, Smile, Clock];

export default async function WhyChooseUs({
  locale = "en",
  doc,
  ratingSummary,
}: {
  locale?: "en" | "es";
  doc?: HomePage | null;
  ratingSummary?: GoogleRatingSummary | null;
}) {
  const isSpanish = locale === "es";
  // The Google card below carries NO numbers until the live summary is
  // applied: without a summary the card is dropped from the grid (see
  // below) instead of showing a stale rating/count.
  // Same five cards, same icons, same order in both languages; only the
  // text changes. The Spanish wording is a faithful translation of the
  // English wording. (There used to be a sixth card, "In-Person Service,
  // At Your Home" — removed: every job is done at the customer's property
  // by definition, so calling it out was redundant.)
  const fallbackFeatures = isSpanish
    ? [
        {
          icon: <ShieldCheck size={32} strokeWidth={1.5} />,
          title: "Garantía de Mano de Obra de 1 Año",
          text: "Garantía de mano de obra de 1 año cuando CallTechCare hace el trabajo y provee los materiales.",
        },
        {
          icon: <SpriteIcon name="star-lucide" size={32} strokeWidth={1.5} />,
          title: "Mejor Calificados en Google",
          text: "Calificados por clientes reales en Google.",
        },
        {
          icon: <Users size={32} strokeWidth={1.5} />,
          title: "Más de 1500 Clientes Ayudados",
          text: "Más de 1500 clientes felices en Miami y Broward.",
        },
        {
          icon: <Smile size={32} strokeWidth={1.5} />,
          title: "Inspección Gratis, Estimado Claro",
          text: "Inspección gratis. Estimado claro después de inspeccionar. Sin cargos ocultos. Sin ventas adicionales. Sin presión.",
        },
        {
          icon: <Clock size={32} strokeWidth={1.5} />,
          title: "Servicio el Mismo Día",
          text: "Venimos el mismo día en horario, sin esperar días para el arreglo.",
        },
      ]
    : [
        {
          icon: <ShieldCheck size={32} strokeWidth={1.5} />,
          title: "1-Year Workmanship Warranty",
          text: "1-year workmanship warranty when CallTechCare performs the work and provides the materials.",
        },
        {
          icon: <SpriteIcon name="star-lucide" size={32} strokeWidth={1.5} />,
          title: "Top Rated on Google",
          text: "Rated by real customers on Google.",
        },
        {
          icon: <Users size={32} strokeWidth={1.5} />,
          title: "1500+ Customers Helped",
          text: "More than 1500 happy customers across Miami and Broward.",
        },
        {
          icon: <Smile size={32} strokeWidth={1.5} />,
          title: "Free Inspection, Clear Estimate",
          text: "Free inspection. Clear estimates after inspection. No hidden fees. No upselling. No pressure.",
        },
        {
          icon: <Clock size={32} strokeWidth={1.5} />,
          title: "Same-Day Service",
          text: "We come the same day during business hours — no waiting days for a fix.",
        },
      ];

  const features =
    doc?.whyCards && doc.whyCards.length === WHY_ICONS.length
      ? doc.whyCards.map((card, i) => {
          const Icon = WHY_ICONS[i];
          return {
            icon: <Icon size={32} strokeWidth={1.5} />,
            title: pick(card.title, card.titleEs, isSpanish) ?? "",
            text: pick(card.text, card.textEs, isSpanish) ?? "",
          };
        })
      : fallbackFeatures;
  // The Google card (Sanity whyCards or the code fallback) quotes the
  // rating and the review count. Both come from the single shared source in
  // lib/google-reviews (Sanity site-settings), so the card updates
  // everywhere at the same time. Detected by its text mentioning Google,
  // not by the numbers, so it keeps working when the rating or the total
  // changes. Without a summary the card is dropped from the grid rather
  // than showing a stale number.
  const summary = ratingSummary ?? (await getGoogleRatingSummary());
  const liveFeatures = features
    .map((f) => {
      if (!summary) return f;
      // The Google card is the one quoting the review count (Sanity whyCards
      // or the code fallback). Detected by its text, not by the numbers, so it
      // keeps working when the rating or the total changes.
      if (!f.text.includes("Google")) return f;
      const rating = formatGoogleRating(summary.rating);
      return {
        ...f,
        title: isSpanish ? `${rating} en Google` : `${rating} on Google`,
        text: isSpanish
          ? `Calificación ${rating} con ${summary.total} reseñas en Google, de clientes reales.`
          : `${rating} rating from ${summary.total} Google reviews, from real customers.`,
      };
    })
    .filter((f) => summary || !f.text.includes("Google"));
  const whyTitle =
    pick(doc?.whyTitle, doc?.whyTitleEs, isSpanish) ??
    (isSpanish
      ? "¿Por qué Elegir CallTechCare para Reparación de Sprinklers en Miami y Broward?"
      : "Why Choose CallTechCare for Sprinkler Repair in Miami & Broward?");
  const whyTitleParts = whyTitle.split("CallTechCare");
  const whySubtitle =
    pick(doc?.whySubtitle, doc?.whySubtitleEs, isSpanish) ??
    (isSpanish
      ? "Reparación de sprinklers e irrigación primero, con instalación de cámaras de seguridad disponible en Miami y Broward."
      : "Sprinkler repair & irrigation first—with security camera installation available across Miami and Broward.");
  const whyPhotoAlt =
    pick(doc?.whyPhotoAlt, doc?.whyPhotoAltEs, isSpanish) ??
    (isSpanish
      ? "Sprinklers regando un patio amplio con adoquines"
      : "Sprinklers watering a large yard with brick pavers");

  return (
    <section
      className="why-choose"
      role="region"
      aria-labelledby="why-title"
    >
      <div className="site-container">

        <div className="why-header">
          <h2 id="why-title">
            {whyTitleParts.length > 1 ? (
              <>
                {whyTitleParts[0]}
                <span className="brand">CallTechCare</span>
                {whyTitleParts[1]}
              </>
            ) : (
              whyTitle
            )}
          </h2>
          <p>{whySubtitle}</p>
        </div>

        {/* Editorial layout, not a card grid: the photo in an arched
            frame on one side, the five reasons as a numbered list on
            the other — same photo, same icons, same text, same order. */}
        <div className="heritage-why-body">
          <div className="heritage-why-photo">
            <img
              src="https://cdn.sanity.io/images/celkrwoq/production/3d495269e52ed93bb03e5191f5fd5c2082be1bcd-1024x768.jpg?w=1024&auto=format&q=75"
              alt={whyPhotoAlt}
              width={1024}
              height={420}
              loading="lazy"
            />
          </div>

          <ol className="heritage-why-list">
            {liveFeatures.map((f, i) => (
              <li key={i} className="heritage-why-item">
                <span className="heritage-why-num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="heritage-why-icon">{f.icon}</span>
                <span className="heritage-why-text">
                  <span className="heritage-why-title">{f.title}</span>
                  <span className="heritage-why-desc">{f.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

      </div>
    </section>
  );
}
