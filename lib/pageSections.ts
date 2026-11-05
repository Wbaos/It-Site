import type { ComponentType } from "react";
import { getHomePage, type HomePage } from "@/lib/sanityHome";
import {
  getGoogleRatingSummary,
  FALLBACK_GOOGLE_RATING_SUMMARY,
  formatGoogleRating,
} from "@/lib/google-reviews";
import { FALLBACK_SETTINGS, resolveSiteSettings } from "@/lib/sanitySettings";
import Hero from "@/components/sections/Hero";
import SEOIntro from "@/components/sections/SEOIntro";
import Services from "@/components/sections/Services";
import HowItWorks from "@/components/sections/HowItWorks";
import GoogleReviewsCTA from "@/components/sections/GoogleReviewsCTA";
import Contact from "@/components/sections/Contact";
import HighlightsServer from "@/components/sections/HighLigthsServer";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import HomeVideo from "@/components/sections/HomeVideo";

// Single home template, both languages. The section list, order and
// components are identical for English and Spanish; only the text changes,
// via each section's `locale` prop (or, for Hero/Contact, via the props
// below). The Spanish copy is a faithful translation of the English copy:
// same sections, same paragraphs and cards, no additions or cuts.
export type HomeLocale = "en" | "es";

type Section = {
  key:
    | "hero"
    | "seo-intro"
    | "services"
    | "home-video"
    | "highlights"
    | "how"
    | "why"
    | "testimonials"
    | "pricing"
    | "contact";
  Component: ComponentType<any>;
  props?: Record<string, unknown>;
};

// Fallback Google rating, from the single shared source in lib/google-reviews.
const FALLBACK_RATING = formatGoogleRating(FALLBACK_GOOGLE_RATING_SUMMARY.rating);

const heroPropsEn = {
  // imageSrc: "/helping2.jpg",

  titleLine1: "Sprinkler Repair Miami & Broward",
  titleLine2: "Irrigation • Repairs • New Systems",

  subtitle:
    "Professional sprinkler repair and irrigation services in Miami and Broward. We also install security cameras.",
  badgeText: "Sprinkler Repair & Irrigation in Miami & Broward",

  primaryCtaText: "Call Now",
  primaryCtaHref: `tel:${FALLBACK_SETTINGS.phoneTel}`,

  // No secondary CTA: the quote flow is hidden for now, so the hero
  // only offers the call button. (The Hero component still supports a
  // secondary CTA if a caller passes one; none does right now.)

  phoneNumber: FALLBACK_SETTINGS.phoneTel,
  showCallButton: true,
  imageSrc: "https://cdn.sanity.io/images/celkrwoq/production/33438c04872f15d5d2aa76f5ede7dcae856fd67a-1600x1200.webp?w=1600&auto=format&q=80",
  mobileImageSrc: "https://cdn.sanity.io/images/celkrwoq/production/66fa6374e721953321827264b014a7ea5c47a930-750x1000.webp?w=750&auto=format&q=50",
  imageAlt: "Sprinklers watering a landscaped front yard in Miami, with the CallTechCare truck",

  stats: [
    { value: "1500+", label: "Local Clients Helped" },
    { value: FALLBACK_RATING, label: "Google Rating" },
    { value: "Same-Day", label: "Appointments Available Within Business Hours" },
  ],
};

const heroPropsEs = {
  titleLine1: "Reparación de Sprinklers en Miami y Broward",
  titleLine2: "Irrigación • Reparaciones • Sistemas Nuevos",
  subtitle:
    "Servicios profesionales de reparación de sprinklers e irrigación en Miami y Broward. También instalamos cámaras de seguridad.",
  badgeText: "Reparación de Sprinklers e Irrigación en Miami y Broward",
  primaryCtaText: "Llama Ahora",
  primaryCtaHref: `tel:${FALLBACK_SETTINGS.phoneTel}`,
  // Sin CTA secundario: la cotización está escondida por ahora; el hero
  // solo ofrece el botón de llamar.
  phoneNumber: FALLBACK_SETTINGS.phoneTel,
  showCallButton: true,
  imageSrc: "https://cdn.sanity.io/images/celkrwoq/production/33438c04872f15d5d2aa76f5ede7dcae856fd67a-1600x1200.webp?w=1600&auto=format&q=80",
  mobileImageSrc: "https://cdn.sanity.io/images/celkrwoq/production/66fa6374e721953321827264b014a7ea5c47a930-750x1000.webp?w=750&auto=format&q=50",
  imageAlt: "Sprinklers regando un jardín delantero en Miami, con el truck de CallTechCare",
  stats: [
    { value: "1500+", label: "Clientes Locales Atendidos" },
    { value: FALLBACK_RATING, label: "Calificación en Google" },
    { value: "Mismo Día", label: "Citas Disponibles Dentro del Horario" },
  ],
};

function pick(en: string | undefined, es: string | undefined, isSpanish: boolean): string | undefined {
  if (isSpanish && es) return es;
  return en;
}

export async function getHomeSections(locale: HomeLocale = "en"): Promise<Section[]> {
  const isSpanish = locale === "es";
  // Live Google rating summary, from the single shared source in
  // lib/google-reviews (one fetch, one fallback). Passed to the sections
  // below so the rating and the review count change everywhere at once.
  const ratingSummary =
    (await getGoogleRatingSummary()) ?? FALLBACK_GOOGLE_RATING_SUMMARY;
  const googleRating = formatGoogleRating(ratingSummary.rating);
  // Live phone from site-settings; the hero constants above only carry the
  // single fallback, so a number change in Sanity reaches the home hero.
  const settings = await resolveSiteSettings();
  let doc: HomePage | null = null;
  try {
    doc = await getHomePage();
  } catch {
    doc = null;
  }
  const heroBase = isSpanish ? heroPropsEs : heroPropsEn;
  const heroProps = doc
    ? {
        ...heroBase,
        primaryCtaHref: `tel:${settings.phoneTel}`,
        phoneNumber: settings.phoneTel,
        titleLine1: pick(doc.heroTitleLine1, doc.heroTitleLine1Es, isSpanish) ?? heroBase.titleLine1,
        titleLine2: pick(doc.heroTitleLine2, doc.heroTitleLine2Es, isSpanish) ?? heroBase.titleLine2,
        subtitle: pick(doc.heroSubtitle, doc.heroSubtitleEs, isSpanish) ?? heroBase.subtitle,
        badgeText: pick(doc.heroBadgeText, doc.heroBadgeTextEs, isSpanish) ?? heroBase.badgeText,
        imageAlt: pick(doc.heroImageAlt, doc.heroImageAltEs, isSpanish) ?? heroBase.imageAlt,
        stats:
          doc.heroStats && doc.heroStats.length > 0
            ? doc.heroStats.map((stat) => ({
                value: pick(stat.value, stat.valueEs, isSpanish) ?? "",
                label: pick(stat.label, stat.labelEs, isSpanish) ?? "",
              }))
            : heroBase.stats,
        googleRating,
      }
    : {
        ...heroBase,
        primaryCtaHref: `tel:${settings.phoneTel}`,
        phoneNumber: settings.phoneTel,
        googleRating,
      };
  const contactProps = isSpanish
    ? {
        headline: pick(doc?.contactHeadline, doc?.contactHeadlineEs, true) ?? "¿Preguntas? Hablemos.",
        subtitle: pick(doc?.contactSubtitle, doc?.contactSubtitleEs, true) ?? "¿Tienes una pregunta? Estamos aquí para ayudarte.",
        locale,
      }
    : {
        headline: doc?.contactHeadline ?? "Questions? Let’s talk.",
        subtitle: doc?.contactSubtitle ?? "Have a question? We're here to help.",
        locale,
      };
  return [
    {
      key: "hero",
      Component: Hero,
      props: heroProps,
    },

    { key: "highlights", Component: HighlightsServer, props: { locale } },

    { key: "home-video", Component: HomeVideo, props: { locale, doc } },

    { key: "services", Component: Services, props: { locale } },
    { key: "seo-intro", Component: SEOIntro, props: { locale, doc } },
    { key: "why", Component: WhyChooseUs, props: { locale, doc, ratingSummary } },

    { key: "how", Component: HowItWorks, props: { locale } },

    {
      key: "testimonials",
      Component: GoogleReviewsCTA,
      props: { locale, ratingSummary },
    },

    {
      key: "contact",
      Component: Contact,
      props: contactProps,
    },
  ];
}
