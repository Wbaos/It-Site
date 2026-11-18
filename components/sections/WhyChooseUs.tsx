import type { HomePage } from "@/lib/sanityHome";
import {
  getGoogleRatingSummary,
  formatGoogleRating,
  type GoogleRatingSummary,
} from "@/lib/google-reviews";
import WhyShowcase, { type WhyFeature } from "./WhyShowcase";

function pick(en: string | undefined, es: string | undefined, isSpanish: boolean): string | undefined {
  if (isSpanish && es) return es;
  return en;
}

// The five reasons, in order, with the icon each one uses (index into
// the showcase's icon set). Same five reasons, same icons, same order
// in both languages; only the text changes. The Spanish wording is a
// faithful translation of the English wording. (There used to be a
// sixth reason, "In-Person Service, At Your Home" — removed: every job
// is done at the customer's property by definition, so calling it out
// was redundant.)
const WHY_ICON_COUNT = 5;

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
  // The Google reason below carries NO numbers until the live summary is
  // applied: without a summary it is dropped from the showcase (see
  // below) instead of showing a stale rating/count.
  const fallbackFeatures: WhyFeature[] = isSpanish
    ? [
        {
          iconIndex: 0,
          title: "Garantía de Mano de Obra de 1 Año",
          text: "Garantía de mano de obra de 1 año cuando CallTechCare hace el trabajo y provee los materiales.",
        },
        {
          iconIndex: 1,
          title: "Mejor Calificados en Google",
          text: "Calificados por clientes reales en Google.",
        },
        {
          iconIndex: 2,
          title: "Más de 1500 Clientes Ayudados",
          text: "Más de 1500 clientes felices en Miami y Broward.",
        },
        {
          iconIndex: 3,
          title: "Inspección Gratis, Estimado Claro",
          text: "Inspección gratis. Estimado claro después de inspeccionar. Sin cargos ocultos. Sin ventas adicionales. Sin presión.",
        },
        {
          iconIndex: 4,
          title: "Respuesta en Menos de Dos Horas",
          text: "Respondemos en menos de dos horas, con servicio el mismo día dentro del horario.",
        },
      ]
    : [
        {
          iconIndex: 0,
          title: "1-Year Workmanship Warranty",
          text: "1-year workmanship warranty when CallTechCare performs the work and provides the materials.",
        },
        {
          iconIndex: 1,
          title: "Top Rated on Google",
          text: "Rated by real customers on Google.",
        },
        {
          iconIndex: 2,
          title: "1500+ Customers Helped",
          text: "More than 1500 happy customers across Miami and Broward.",
        },
        {
          iconIndex: 3,
          title: "Free Inspection, Clear Estimate",
          text: "Free inspection. Clear estimates after inspection. No hidden fees. No upselling. No pressure.",
        },
        {
          iconIndex: 4,
          title: "Response in Less Than Two Hours",
          text: "We respond in less than two hours, with same-day service within business hours.",
        },
      ];

  const features: WhyFeature[] =
    doc?.whyCards && doc.whyCards.length === WHY_ICON_COUNT
      ? doc.whyCards.map((card, i) => ({
          iconIndex: i,
          title: pick(card.title, card.titleEs, isSpanish) ?? "",
          text: pick(card.text, card.textEs, isSpanish) ?? "",
        }))
      : fallbackFeatures;
  // The Google reason (Sanity whyCards or the code fallback) quotes the
  // rating and the review count. Both come from the single shared source in
  // lib/google-reviews (Sanity site-settings), so the reason updates
  // everywhere at the same time. Detected by its text mentioning Google,
  // not by the numbers, so it keeps working when the rating or the total
  // changes. Without a summary the reason is dropped from the showcase
  // rather than showing a stale number.
  const summary = ratingSummary ?? (await getGoogleRatingSummary());
  const liveFeatures = features
    .map((f) => {
      if (!summary) return f;
      // The Google reason is the one quoting the review count (Sanity
      // whyCards or the code fallback). Detected by its text, not by the
      // numbers, so it keeps working when the rating or the total changes.
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

        {/* Editorial layout: the photo in an arched frame on one side,
            the five reasons as a dynamic showcase on the other — same
            photo, same icons, same text, same order. */}
        <div className="heritage-why-body">
          <div className="heritage-why-photo">
            <img
              src="https://cdn.sanity.io/images/celkrwoq/production/3d495269e52ed93bb03e5191f5fd5c2082be1bcd-1024x768.jpg?w=1024&auto=format&q=80"
              alt={whyPhotoAlt}
              width={1024}
              height={420}
              loading="lazy"
            />
          </div>

          <WhyShowcase features={liveFeatures} isSpanish={isSpanish} />
        </div>

      </div>
    </section>
  );
}
