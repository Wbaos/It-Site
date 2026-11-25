import type { ComponentType } from "react";
import { getHomePage, type HomePage } from "@/lib/sanityHome";
import {
  getGoogleRatingSummary,
  formatGoogleRating,
} from "@/lib/google-reviews";
import { FALLBACK_SETTINGS, resolveSiteSettings } from "@/lib/sanitySettings";
import { sanity } from "@/lib/sanity";
import HomeHero from "@/components/sections/HomeHero";
import SystemDiagnostic from "@/components/sections/SystemDiagnostic";
import BeforeAfterSection, {
  type BeforeAfterComparison,
} from "@/components/BeforeAfterSection";
import SEOIntro from "@/components/sections/SEOIntro";
import Services from "@/components/sections/Services";
import HowItWorks from "@/components/sections/HowItWorks";
import GoogleReviewsCTA from "@/components/sections/GoogleReviewsCTA";
import Contact from "@/components/sections/Contact";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import CoverageMap from "@/components/sections/CoverageMap";
import BrandMarquee from "@/components/sections/BrandMarquee";
import CommercialBand from "@/components/sections/CommercialBand";

// Single home template, both languages. The section list, order and
// components are identical for English and Spanish; only the text changes,
// via each section's `locale` prop (or, for Hero/Contact, via the props
// below). The Spanish copy is a faithful translation of the English copy:
// same sections, same paragraphs and cards, no additions or cuts.
export type HomeLocale = "en" | "es";

type Section = {
  key:
    | "hero"
    | "brands"
    | "before-after"
    | "seo-intro"
    | "services"
    | "commercial"
    | "diagnostic"
    | "how"
    | "why"
    | "testimonials"
    | "pricing"
    | "contact"
    | "coverage-map";
  Component: ComponentType<any>;
  props?: Record<string, unknown>;
};

// The Google Rating stat value below is an empty placeholder, filled from
// the live summary at render (Hero's googleRating prop); when there is no
// summary Hero filters the stat out, so no stale number ever shows.

const heroPropsEn = {
  // imageSrc: "/helping2.jpg",

  titleLine1: "Sprinkler Repair Miami & Broward",
  // Second title line removed at the owner's request (9 Nov 2026): the
  // green "Irrigation • Repairs • New Systems" line with the big dots
  // made the hero look loaded; line 1 + the subtitle already say it.
  // The matching Sanity fields (heroTitleLine2 / heroTitleLine2Es) were
  // also cleared, so nothing overrides this empty value.
  titleLine2: "",

  subtitle:
    "Professional sprinkler repair and irrigation services in Miami and Broward. We also install security cameras.",
  // Hero badge removed at the owner's request (9 Nov 2026): the pill
  // repeated the title, so it was extra. The matching Sanity fields
  // (heroBadgeText / heroBadgeTextEs) were also cleared, so nothing
  // overrides this empty value.
  badgeText: "",

  primaryCtaText: "Call Now",
  primaryCtaHref: `tel:${FALLBACK_SETTINGS.phoneTel}`,

  // No secondary CTA: the quote flow is hidden for now, so the hero
  // only offers the call button. (The Hero component still supports a
  // secondary CTA if a caller passes one; none does right now.)

  phoneNumber: FALLBACK_SETTINGS.phoneTel,
  showCallButton: true,
  // The imageSrc passed to next/image is the bare Sanity asset URL (no
  // ?w=… baked in): next/image picks the real width from `sizes`, so the
  // browser never downloads a 1600px source upscaled to 2048px.
  // The mobile portrait (750x1000) keeps its own params: it is served
  // directly through a <source> element, not through next/image.
  imageSrc: "https://cdn.sanity.io/images/celkrwoq/production/33438c04872f15d5d2aa76f5ede7dcae856fd67a-1600x1200.webp",
  mobileImageSrc: "https://cdn.sanity.io/images/celkrwoq/production/66fa6374e721953321827264b014a7ea5c47a930-750x1000.webp?w=750&auto=format&q=50",
  imageAlt: "Sprinklers watering a landscaped front yard in Miami, with the CallTechCare truck",

  stats: [
    { value: "", label: "Google Rating" },
    { value: "Same-Day", label: "Appointments Available Within Business Hours" },
  ],
};

const heroPropsEs = {
  titleLine1: "Reparación de Sprinklers en Miami y Broward",
  // Segunda línea del título quitada por pedido del dueño (9 nov 2026):
  // ver el comentario en la versión en inglés.
  titleLine2: "",
  subtitle:
    "Servicios profesionales de reparación de sprinklers e irrigación en Miami y Broward. También instalamos cámaras de seguridad.",
  // Pastilla del hero quitada por pedido del dueño (9 nov 2026):
  // ver el comentario en la versión en inglés.
  badgeText: "",
  primaryCtaText: "Llama Ahora",
  primaryCtaHref: `tel:${FALLBACK_SETTINGS.phoneTel}`,
  // Sin CTA secundario: la cotización está escondida por ahora; el hero
  // solo ofrece el botón de llamar.
  phoneNumber: FALLBACK_SETTINGS.phoneTel,
  showCallButton: true,
  // Misma URL sin parámetros que en la versión en inglés: ver el
  // comentario allí (la URL sin ?w=… es la fuente de next/image).
  imageSrc: "https://cdn.sanity.io/images/celkrwoq/production/33438c04872f15d5d2aa76f5ede7dcae856fd67a-1600x1200.webp",
  mobileImageSrc: "https://cdn.sanity.io/images/celkrwoq/production/66fa6374e721953321827264b014a7ea5c47a930-750x1000.webp?w=750&auto=format&q=50",
  imageAlt: "Sprinklers regando un jardín delantero en Miami, con el truck de CallTechCare",
  stats: [
    { value: "", label: "Calificación en Google" },
    { value: "Mismo Día", label: "Citas Disponibles Dentro del Horario" },
  ],
};

function pick(en: string | undefined, es: string | undefined, isSpanish: boolean): string | undefined {
  if (isSpanish && es) return es;
  return en;
}

export async function getHomeSections(
  locale: HomeLocale = "en"
): Promise<{ sections: Section[]; doc: HomePage | null }> {
  const isSpanish = locale === "es";
  // Live Google rating summary, from the single shared source in
  // lib/google-reviews (Sanity site-settings; one fetch). Passed to the
  // sections below so the rating and the review count change everywhere
  // at once. When there is no summary, each section hides its numbers
  // instead of showing a stale count (see the components).
  const ratingSummary = await getGoogleRatingSummary();
  const googleRating = ratingSummary
    ? formatGoogleRating(ratingSummary.rating)
    : undefined;
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
        locale,
        primaryCtaHref: `tel:${settings.phoneTel}`,
        phoneNumber: settings.phoneTel,
        phoneDisplay: settings.phoneDisplay,
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
        locale,
        primaryCtaHref: `tel:${settings.phoneTel}`,
        phoneNumber: settings.phoneTel,
        phoneDisplay: settings.phoneDisplay,
        googleRating,
      };
  // Before & after gallery for the home: the home doc has no beforeAfter
  // field, so the comparisons are reused from the service docs that
  // already carry real before/after photos (sprinkler repair first, then
  // the WiFi controller upgrade). Titles resolve to Spanish on /es.
  // No photos or jobs are invented — only the existing service data.
  let beforeAfterComparisons: BeforeAfterComparison[] = [];
  try {
    const baServices = await sanity.fetch<any[]>(
      `*[_type == "service" && slug.current in ["sprinkler-repair-and-installation", "wifi-sprinkler-controller-upgrade"]]{ "slug": slug.current, beforeAfter{ comparisons[]{ title, titleEs, beforeImage{asset->{url}, alt}, afterImage{asset->{url}, alt} } } }`
    );
    const order = [
      "sprinkler-repair-and-installation",
      "wifi-sprinkler-controller-upgrade",
    ];
    baServices
      .sort((a, b) => order.indexOf(a?.slug) - order.indexOf(b?.slug))
      .forEach((s) => {
        (s?.beforeAfter?.comparisons ?? []).forEach((c: any) => {
          if (!c?.beforeImage?.asset?.url || !c?.afterImage?.asset?.url)
            return;
          beforeAfterComparisons.push({
            title:
              isSpanish && c?.titleEs?.trim() ? c.titleEs : c?.title ?? "",
            titleEs: c?.titleEs,
            beforeImage: c.beforeImage,
            afterImage: c.afterImage,
          });
        });
      });
  } catch {
    beforeAfterComparisons = [];
  }

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
  const sections: Section[] = [
    // Editorial hero: copy + promise + the QuickLeadForm itself, a wide
    // video band in the arched frame (the home video, muted on loop,
    // with the hero photo as poster/fallback) and a single trust strip
    // — the form is no longer a separate section below the fold.
    {
      key: "hero",
      Component: HomeHero,
      props: heroProps,
    },

    // Brands marquee (18 Nov 2026): infinite scrolling strip with the
    // five brands installed, right below the hero. Pauses on hover and
    // touch, still with reduced motion.
    { key: "brands", Component: BrandMarquee, props: { locale } },

    // Real before/after work, reused from the service docs (see the
    // fetch above). Renders nothing when no comparisons exist.
    {
      key: "before-after",
      Component: BeforeAfterSection,
      props: {
        locale,
        data: { comparisons: beforeAfterComparisons },
      },
    },

    { key: "services", Component: Services, props: { locale } },

    // Commercial track (Nov 25, 2026): a band for HOAs, property
    // managers and businesses right after the residential services,
    // linking to the commercial service page. That page already existed
    // but the home never linked to it.
    {
      key: "commercial",
      Component: CommercialBand,
      props: { locale, phoneTel: settings.phoneTel, phoneDisplay: settings.phoneDisplay },
    },

    // Interactive diagnostic ("What's wrong with your system?") in
    // place of the old rotating Highlights strip, removed 17 Nov 2026
    // at the owner's request. Six symptoms, one result card each.
    { key: "diagnostic", Component: SystemDiagnostic, props: { locale } },

    { key: "seo-intro", Component: SEOIntro, props: { locale, doc } },
    { key: "why", Component: WhyChooseUs, props: { locale, doc, ratingSummary } },

    { key: "how", Component: HowItWorks, props: { locale } },

    // Interactive service-area map (18 Nov 2026): the 33 cities on a
    // Leaflet map with county filters and search, plus the text list
    // below as backup. The old home-video section was removed the same
    // day: the video moved into the hero, so the same video twice on
    // the home was a repeat.
    { key: "coverage-map", Component: CoverageMap, props: { locale } },

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
  return { sections, doc };
}
