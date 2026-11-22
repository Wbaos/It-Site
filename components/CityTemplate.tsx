import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import Hero from "@/components/sections/Hero";
import QuickLeadForm from "@/components/QuickLeadForm";
import { serviceHref } from "@/lib/serviceTwins";
import { cityHref } from "@/lib/cityTwins";
import { sanityImageUrl } from "@/lib/sanityCities";
import { resolveSiteSettings, substitutePhonePlaceholders } from "@/lib/sanitySettings";
import {
  getGoogleRatingSummary,
  formatGoogleRating,
} from "@/lib/google-reviews";
import GoogleReviewsCTA from "@/components/sections/GoogleReviewsCTA";
import type { City, CityAreaSegment } from "@/lib/sanityCities";

// Single template for every city landing page (Lote 2 migration).
// Renders one Sanity `city` document in English or Spanish. Content that
// is identical across cities (goal, common problems, cards, steps, shared
// FAQs, CTAs) lives here as locale maps; only per-city content comes from
// the document. The old 30 files rendered byte-equivalent output; the
// known per-city quirks (Hollywood's ", FL", Aventura's card links and
// custom area paragraph, Davie/Cutler Bay linked card titles, Cutler Bay's
// "nearby 33177", Aventura's Service name without "in") are preserved via
// document fields (faqOverrides, highlightsVariant, areaSegments) and the
// two derivations noted below.
//
// Derivations (verified against all 30 old files):
// - Breadcrumb name = heroTitle1 with " in " removed
//   ("Sprinkler Repair in Surfside" -> "Sprinkler Repair Surfside").
// - Service schema name = heroTitle1, except Aventura which drops " in "
//   ("Sprinkler Repair Aventura").
// - OG alt = "CallTechCare - " + breadcrumb name (EN) / heroTitle1Es (ES).

type Locale = "en" | "es";

function pick(en: string | undefined, es: string | undefined, locale: Locale): string {
  if (locale === "es" && es) return es;
  return en ?? "";
}

// The Sanity hero title for a city should read "Sprinkler Repair in
// <City>" / "Reparación de Sprinklers en <City>". Southwest Ranches'
// document is missing the preposition ("Sprinkler Repair Southwest
// Ranches"). Derive it here, like the breadcrumb and Service-name
// derivations below, instead of special-casing one city: any title
// that starts with the service prefix followed directly by its own
// city name gets the preposition inserted. Titles that already have
// it, or that do not follow the pattern, are untouched.
function normalizeHeroTitle1(title: string, cityName: string, locale: Locale): string {
  if (!cityName) return title;
  if (locale === "en") {
    const prefix = "Sprinkler Repair ";
    if (title.startsWith(prefix) && !title.startsWith(`${prefix}in `)) {
      const rest = title.slice(prefix.length);
      if (rest === cityName || rest.startsWith(`${cityName} `)) return `${prefix}in ${rest}`;
    }
    return title;
  }
  const prefix = "Reparación de Sprinklers ";
  if (title.startsWith(prefix) && !title.startsWith(`${prefix}en `)) {
    const rest = title.slice(prefix.length);
    if (rest === cityName || rest.startsWith(`${cityName} `)) return `${prefix}en ${rest}`;
  }
  return title;
}

// Breadcrumb name = hero title with " in " removed in English
// ("Sprinkler Repair in Surfside" -> "Sprinkler Repair Surfside");
// Spanish keeps "en" ("Reparación de Sprinklers en Miami").
export function cityBreadcrumbName(city: City, locale: Locale): string {
  const h1 = normalizeHeroTitle1(pick(city.heroTitle1, city.heroTitle1Es, locale), city.name ?? "", locale);
  return locale === "es" ? h1 : h1.replace(" in ", " ");
}

// Service schema name = hero title, except Aventura which drops " in "
// ("Sprinkler Repair Aventura" / "Reparación de Sprinklers Aventura").
export function cityServiceName(city: City, locale: Locale): string {
  const h1 = normalizeHeroTitle1(pick(city.heroTitle1, city.heroTitle1Es, locale), city.name ?? "", locale);
  if ((city.slug?.current ?? "") === "aventura") {
    return locale === "es" ? "Reparación de Sprinklers Aventura" : "Sprinkler Repair Aventura";
  }
  return h1;
}

export function cityOgAlt(city: City, locale: Locale): string {
  return `CallTechCare - ${cityBreadcrumbName(city, locale)}`;
}

function oxfordJoin(names: string[]): string {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

function esJoin(names: string[]): string {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")} y ${names[names.length - 1]}`;
}

function SprinklerIllustration() {
  return (
    <svg viewBox="0 0 96 96" role="img" aria-label="Sprinkler head illustration" className="spr-illus" fill="none">
      <path d="M18 66c10-8 50-8 60 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M26 62V40c0-8 7-14 22-14s22 6 22 14v22" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M34 66v8c0 4 3 8 14 8s14-4 14-8v-8" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M30 34l-8-6M40 30l-6-10M56 30l6-10M66 34l8-6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M20 48c8 2 16 2 24 0M52 48c8 2 16 2 24 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

function ControllerIllustration() {
  return (
    <svg viewBox="0 0 96 96" role="img" aria-label="Irrigation controller illustration" className="spr-illus" fill="none">
      <path d="M26 18h44a6 6 0 0 1 6 6v48a6 6 0 0 1-6 6H26a6 6 0 0 1-6-6V24a6 6 0 0 1 6-6Z" stroke="currentColor" strokeWidth="3" />
      <path d="M30 30h36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <path d="M30 40h22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <path d="M30 52h36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <path d="M30 62h18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <path d="M64 38a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

function LeakIllustration() {
  return (
    <svg viewBox="0 0 96 96" role="img" aria-label="Sprinkler leak illustration" className="spr-illus" fill="none">
      <path d="M18 56h44c10 0 16-6 16-16V28" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M34 56v10c0 8 6 14 14 14h10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M70 30c-3 5-6 8-10 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
      <path d="M74 44c0 6-8 10-8 16 0 4 3 8 8 8s8-4 8-8c0-6-8-10-8-16Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

const ILLUSTRATIONS = [SprinklerIllustration, ControllerIllustration, LeakIllustration];

type CardDef = {
  title: string;
  body: string;
  see: string;
  linkText: string;
  shortSee: string;
  shortLinkText: string;
  suffix: string;
  linkSlug: string;
};

type LocaleText = {
  detailsText: string;
  detailsAria: string;
  commonH3: string;
  areaH3: string;
  cameraPrefix: string;
  cameraLinkText: string;
  cameraSuffix: string;
  finalCtaPrefix: string;
  finalCtaLinkText: string;
  finalCtaSuffix: string;
  highlightsTitle: string;
  stepsTitle: string;
  ctaPrefix: string;
  ctaLink1: string;
  ctaMid: string;
  ctaLink2: string;
  ctaSuffix: string;
  ourWorkTitle: string;
  callNow: string;
  // The two inline "send us a quick message" links below point at the
  // short lead form on this same page (#quick-lead) while the full quote
  // flow is hidden. Not the quote page.
  ariaHighlights: string;
  ariaSteps: string;
  ariaFaq: string;
  ariaWork: string;
  cards: CardDef[];
  steps: { title: string; text: string }[];
};

const TEXT: Record<Locale, LocaleText> = {
  en: {
    detailsText: "View full sprinkler repair & irrigation service details →",
    detailsAria: "View full sprinkler repair and irrigation service details",
    commonH3: "Common sprinkler problems we fix",
    areaH3: "Service area",
    cameraPrefix: "We also provide ",
    cameraLinkText: "wireless camera installation",
    cameraSuffix: " for homes and small businesses.",
    finalCtaPrefix: "Ready to get started? Call now or ",
    finalCtaLinkText: "send us a quick message",
    finalCtaSuffix: " and we’ll confirm details and schedule the next available visit.",
    highlightsTitle: "Fix the sprinklers. Protect the yard. Stop wasting water.",
    stepsTitle: "How it works",
    ctaPrefix: "Prefer to go straight to scheduling? ",
    ctaLink1: "Send us a quick message",
    ctaMid: " or call now. Want full service details? View ",
    ctaLink2: "Sprinkler Repair & Irrigation",
    ctaSuffix: ".",
    ourWorkTitle: "Our Work",
    callNow: "Call Now",
    ariaHighlights: "Sprinkler repair highlights",
    ariaSteps: "How it works",
    ariaFaq: "Frequently asked questions",
    ariaWork: "Our work",
    cards: [
      {
        title: "Heads, coverage & zone issues",
        body: "Broken heads, uneven spray, low coverage, or a zone that won’t turn on—we’ll pinpoint the cause and get it working correctly.",
        see: "See our ",
        linkText: "valve repair service",
        shortSee: "See our ",
        shortLinkText: "valve repair",
        suffix: " for zone problems.",
        linkSlug: "sprinkler-valve-repair",
      },
      {
        title: "Timer/controller troubleshooting",
        body: "If scheduling is off, zones run at the wrong time, or the controller isn’t responding, we’ll troubleshoot settings and hardware.",
        see: "See our ",
        linkText: "timer installation service",
        shortSee: "See our ",
        shortLinkText: "timer installation & programming",
        suffix: " for upgrades.",
        linkSlug: "sprinkler-timer-installation",
      },
      {
        title: "Leaks & constant running water",
        body: "Wet spots, pooling water, or a system that won’t shut off can point to valve or line problems—we’ll identify and address the leak.",
        see: "See our ",
        linkText: "leak repair service",
        shortSee: "See our ",
        shortLinkText: "leak repair",
        suffix: " for details.",
        linkSlug: "sprinkler-leak-repair",
      },
    ],
    steps: [
      { title: "Tell us what you’re seeing", text: "Low pressure, one zone not working, leaks, or coverage issues—we’ll ask 1–2 quick questions." },
      { title: "Inspection", text: "We inspect the system, isolate the issue, and explain the recommended fix clearly." },
      { title: "Repair & test", text: "We complete the repair and test zones so your system runs reliably again." },
    ],
  },
  es: {
    detailsText: "Ver detalles completos del servicio de reparación de sprinklers e irrigación →",
    detailsAria: "Ver detalles completos del servicio de reparación de sprinklers e irrigación",
    commonH3: "Problemas comunes de sprinklers que reparamos",
    areaH3: "Área de servicio",
    cameraPrefix: "También ofrecemos ",
    cameraLinkText: "instalación de cámaras inalámbricas",
    cameraSuffix: " para hogares y pequeños negocios.",
    finalCtaPrefix: "¿Listo para empezar? Llama ahora o ",
    finalCtaLinkText: "envíanos un mensaje rápido",
    finalCtaSuffix: " y te confirmamos los detalles y programamos la próxima visita disponible.",
    highlightsTitle: "Repara los sprinklers. Protege el jardín. Deja de desperdiciar agua.",
    stepsTitle: "Cómo funciona",
    ctaPrefix: "¿Prefieres agendar directo? ",
    ctaLink1: "Envíanos un mensaje rápido",
    ctaMid: " o llama ahora. ¿Quieres los detalles completos del servicio? Ver ",
    ctaLink2: "Reparación de Sprinklers e Irrigación",
    ctaSuffix: ".",
    ourWorkTitle: "Nuestro Trabajo",
    callNow: "Llama ahora",
    ariaHighlights: "Sprinkler repair highlights",
    ariaSteps: "How it works",
    ariaFaq: "Frequently asked questions",
    ariaWork: "Nuestro trabajo",
    cards: [
      {
        title: "Cabezales, cobertura y problemas de zonas",
        body: "Cabezales rotos, riego disparejo, baja cobertura o una zona que no enciende: encontramos la causa y la dejamos funcionando correctamente.",
        see: "Mira nuestro ",
        linkText: "servicio de reparación de válvulas",
        shortSee: "Mira nuestra ",
        shortLinkText: "reparación de válvulas",
        suffix: " para problemas de zonas.",
        linkSlug: "sprinkler-valve-repair",
      },
      {
        title: "Problemas con el temporizador y controlador",
        body: "Si la programación está mal, las zonas riegan a la hora incorrecta o el controlador no responde, revisamos la configuración y el equipo.",
        see: "Mira nuestro ",
        linkText: "servicio de instalación de temporizadores",
        shortSee: "Mira nuestra ",
        shortLinkText: "instalación y programación de temporizadores",
        suffix: " para mejoras.",
        linkSlug: "sprinkler-timer-installation",
      },
      {
        title: "Fugas y agua corriendo sin parar",
        body: "Áreas mojadas, agua acumulada o un sistema que no apaga pueden indicar problemas de válvulas o tuberías: identificamos y reparamos la fuga.",
        see: "Mira nuestro ",
        linkText: "servicio de reparación de fugas",
        shortSee: "Mira nuestra ",
        shortLinkText: "reparación de fugas",
        suffix: " para detalles.",
        linkSlug: "sprinkler-leak-repair",
      },
    ],
    steps: [
      { title: "Cuéntanos qué estás viendo", text: "Baja presión, una zona que no funciona, fugas o problemas de cobertura: te hacemos 1 o 2 preguntas rápidas." },
      { title: "Inspección", text: "Inspeccionamos el sistema, aislamos el problema y te explicamos claramente la solución recomendada." },
      { title: "Reparación y prueba", text: "Completamos la reparación y probamos las zonas para que tu sistema funcione de forma confiable otra vez." },
    ],
  },
};

// Shared FAQs (indices 0,1,2,3,4,5,8 of the standard 9). {CITY}, {COUNTY}
// and {SISTERS} are substituted per city; local FAQs fill indices 6 and 7.
const SHARED_FAQS: Record<Locale, { q: string; a: string }[]> = {
  en: [
    {
      q: "How much does sprinkler repair cost in {CITY}?",
      a: "It depends on the problem and the size of your system. A broken sprinkler head costs less than a valve or zone repair. CallTechCare gives you a clear, upfront estimate before starting any work, and the inspection is free.",
    },
    {
      q: "How fast can you come to {CITY} for a sprinkler repair?",
      a: "In {CITY} and most of {COUNTY}, same-day appointments within business hours are available. Call {{phone}} and we will confirm the next available visit.",
    },
    {
      q: "Do you serve areas near {CITY}?",
      a: "Yes. We serve {CITY} and nearby {COUNTY} cities, including {SISTERS}. We also serve all of Miami-Dade and Broward.",
    },
    {
      q: "Why is one sprinkler zone not working?",
      a: "The most common causes are a faulty valve, a wiring issue, a timer problem, or an underground leak. We diagnose the root cause before recommending a repair.",
    },
    {
      q: "Do you install new sprinkler systems in {CITY}?",
      a: "Yes. We install new irrigation zones, valves, sprinkler lines, and controllers in {CITY}, and we can upgrade old systems with smart WiFi controllers.",
    },
    {
      q: "Do you repair sprinkler leaks in {CITY}?",
      a: "Yes. We repair sprinkler leaks in {CITY}, including PVC pipe leaks, leaking valves, and broken heads, and we test the system after the repair.",
    },
    {
      q: "Do you offer sprinkler repair near me in {CITY}?",
      a: "Yes. CallTechCare offers sprinkler repair near you in {CITY} — same-day appointments within business hours and free inspection. Call {{phone}} and we'll confirm the next available visit.",
    },
  ],
  es: [
    {
      q: "¿Cuánto cuesta la reparación de sprinklers en {CITY}?",
      a: "Depende del problema y del tamaño de tu sistema. Un cabezal roto cuesta menos que una reparación de válvula o de zona. CallTechCare te da un estimado claro y por adelantado antes de empezar cualquier trabajo, y la inspección es gratis.",
    },
    {
      q: "¿Qué tan rápido pueden venir a {CITY} para una reparación de sprinklers?",
      a: "En {CITY} y la mayor parte de {COUNTY}, hay citas disponibles el mismo día dentro del horario. Llama al {{phone}} y te confirmamos la próxima visita disponible.",
    },
    {
      q: "¿Atienden áreas cerca de {CITY}?",
      a: "Sí. Atendemos {CITY} y las ciudades cercanas de {COUNTY}, incluyendo {SISTERS}. También atendemos todo Miami-Dade y Broward.",
    },
    {
      q: "¿Por qué una zona de sprinklers no funciona?",
      a: "Las causas más comunes son una válvula defectuosa, un problema de cableado, un problema del temporizador o una fuga subterránea. Diagnosticamos la causa raíz antes de recomendar una reparación.",
    },
    {
      q: "¿Instalan sistemas nuevos de sprinklers en {CITY}?",
      a: "Sí. Instalamos zonas nuevas de irrigación, válvulas, líneas de sprinklers y controladores en {CITY}, y podemos actualizar sistemas viejos con controladores WiFi inteligentes.",
    },
    {
      q: "¿Reparan fugas de sprinklers en {CITY}?",
      a: "Sí. Reparamos fugas de sprinklers en {CITY}, incluyendo fugas en tuberías de PVC, válvulas con fuga y cabezales rotos, y probamos el sistema después de la reparación.",
    },
    {
      q: "¿Ofrecen reparación de sprinklers cerca de mí en {CITY}?",
      a: "Sí. CallTechCare ofrece reparación de sprinklers cerca de ti en {CITY} — citas el mismo día dentro del horario e inspección gratis. Llama al {{phone}} y te confirmaremos la próxima visita disponible.",
    },
  ],
};

const GOAL_P: Record<Locale, string> = {
  en: "Our goal is simple: get your system running correctly, protect your landscaping, and help you avoid wasted water. If your sprinkler zones are uneven, your timer isn’t responding, or you’re seeing soggy spots, we’ll diagnose the issue and explain the fix before we start.",
  es: "Nuestro objetivo es simple: dejar tu sistema funcionando correctamente, proteger tu jardín y ayudarte a evitar el desperdicio de agua. Si tus zonas de sprinklers riegan de forma dispareja, tu temporizador no responde o estás viendo partes mojadas en el jardín, diagnosticamos el problema y te explicamos la solución antes de empezar.",
};

const COMMON_P: Record<Locale, string> = {
  en: "We handle the most common sprinkler and irrigation issues in South Florida, including broken sprinkler heads, misaligned spray patterns, cracked pipes, valve and zone problems, timer/controller troubleshooting, and drip irrigation leaks.",
  es: "Atendemos los problemas más comunes de sprinklers e irrigación en el sur de Florida, incluyendo cabezales rotos, patrones de riego desajustados, tuberías rotas, problemas de válvulas y zonas, diagnóstico de temporizadores y controladores, y fugas en riego por goteo.",
};

const NOT_SURE_P: Record<Locale, string> = {
  en: "Not sure what’s wrong? Tell us what you’re noticing (low pressure, one zone not turning on, constant running water, or a wet patch in the yard) and we’ll guide the next step.",
  es: "¿No sabes qué está mal? Cuéntanos qué estás notando (baja presión, una zona que no enciende, agua corriendo sin parar o un área mojada en el jardín) y te guiamos con el siguiente paso.",
};

const ES_STATS = [
  { value: "1500+", label: "Clientes Locales Atendidos" },
  // Google Rating value comes from the live summary (googleRating prop on
  // Hero); the empty default is filtered out at render when there is no
  // summary, so no stale number ever shows.
  { value: "", label: "Calificación en Google" },
  { value: "Mismo Día", label: "Citas Disponibles" },
];

function composeFaqs(
  city: City,
  locale: Locale,
  settings: { phoneDisplay: string; phoneTel: string; phoneIntl: string; phoneCard: string },
): { q: string; a: string }[] {
  const sub = (s: string) => substitutePhonePlaceholders(s, settings);
  if (city.isHub) {
    const list = locale === "es" && city.faqsOverrideEs?.length ? city.faqsOverrideEs : city.faqsOverride;
    return (list ?? [])
      .map((f) => ({ q: sub(f.q ?? ""), a: sub(f.a ?? "") }))
      .filter((f) => f.q);
  }
  const name = city.name ?? "";
  const county = city.county ?? "";
  const sisters = (city.sisters ?? []).map((s) => s.name ?? "");
  const sistersJoined = locale === "en" ? oxfordJoin(sisters) : esJoin(sisters);
  const subPlaceholders = (s: string) =>
    s.replaceAll("{CITY}", name).replaceAll("{COUNTY}", county).replaceAll("{SISTERS}", sistersJoined);
  const shared = SHARED_FAQS[locale].map((f) => ({ q: sub(subPlaceholders(f.q)), a: sub(subPlaceholders(f.a)) }));
  const local = (locale === "es" && city.localFaqsEs?.length ? city.localFaqsEs : city.localFaqs ?? [])
    .map((f) => ({ q: sub(f.q ?? ""), a: sub(f.a ?? "") }))
    .filter((f) => f.q);
  const faqs = [...shared.slice(0, 6), ...local, shared[6]];
  const overrides = locale === "es" && city.faqOverridesEs?.length ? city.faqOverridesEs : city.faqOverrides;
  for (const o of overrides ?? []) {
    if (o.index == null || !faqs[o.index]) continue;
    if (o.q) faqs[o.index].q = sub(o.q);
    if (o.a) faqs[o.index].a = sub(o.a);
  }
  return faqs;
}

function routeAreaHref(href: string, locale: Locale): string {
  if (href.startsWith("/sprinkler-repair-")) {
    return cityHref(href.replace("/sprinkler-repair-", ""), locale);
  }
  // Location detail pages: in Spanish mode they must land on the Spanish
  // twin (/es/areas-de-servicio/<slug>), never on the English /locations/
  // page. English keeps the /locations/ URL as-is.
  if (href.startsWith("/locations/")) {
    const slug = href.replace("/locations/", "");
    return locale === "es" ? `/es/areas-de-servicio/${slug}` : href;
  }
  return href;
}

// Area segments are stored without boundary spaces, so spacing is rebuilt
// deterministically: a space between segments, except before a segment that
// starts with "," or "." (", Aventura" / "page. If…").
function renderAreaSegments(segments: CityAreaSegment[], locale: Locale) {
  const nodes: ReactNode[] = [];
  segments.forEach((seg, i) => {
    const segText = seg.text ?? "";
    const needsSpace =
      nodes.length > 0 && !segText.startsWith(",") && !segText.startsWith(".");
    // The Sanity area copy links "see the full list" at the Fort
    // Lauderdale page (/locations/fort-lauderdale) instead of the
    // locations hub (/locations). Rewrite that one known-bad pair
    // here so all city pages point at the full list; the source data
    // in Sanity still carries the old link. Any other link (real
    // city links included) passes through untouched.
    let linkHref = seg.linkHref;
    let linkText = seg.linkText;
    if (
      (linkHref === "/locations/fort-lauderdale" ||
        linkHref === "/es/areas-de-servicio/fort-lauderdale") &&
      (linkText === "Fort Lauderdale page" ||
        linkText === "página de Fort Lauderdale")
    ) {
      if (locale === "es") {
        linkHref = "/es/areas-de-servicio";
        linkText = "página de áreas de servicio";
      } else {
        linkHref = "/locations";
        linkText = "locations page";
      }
    }
    if (linkHref) {
      if (nodes.length > 0) nodes.push(" ");
      nodes.push(
        <Link key={`l${i}`} href={routeAreaHref(linkHref, locale)}>
          {linkText}
        </Link>,
      );
    } else if (segText) {
      if (needsSpace) nodes.push(" ");
      nodes.push(segText);
    }
  });
  return nodes;
}

export default async function CityTemplate({ city, locale }: { city: City; locale: Locale }) {
  // Live Google rating summary, from the single shared source in
  // lib/google-reviews (Sanity site-settings). Used for the hero stat (via
  // the googleRating prop), so the number changes everywhere at once. When
  // there is no summary the Google stat hides instead of showing a stale
  // number.
  const ratingSummary = await getGoogleRatingSummary();
  const googleRating = ratingSummary
    ? formatGoogleRating(ratingSummary.rating)
    : undefined;
  // Live phone from site-settings (single source); Sanity city texts may
  // carry {{phone}} / {{phoneTel}} markers, resolved below.
  const settings = await resolveSiteSettings();
  const t = TEXT[locale];
  const isEs = locale === "es";
  const slug = city.slug?.current ?? "";
  const name = city.name ?? "";
  const county = city.county ?? "";
  const isHub = !!city.isHub;
  // Spanish canonical must never collapse to the bare "/es/" home URL
  // (it 308-redirects to "/es"): when a city has no esSlug, fall back
  // to the conventional twin path, same as the sitemap fallback.
  const canonical = isEs
    ? `https://www.calltechcare.com/es/${city.esSlug ?? `reparacion-de-sprinklers-${slug}`}`
    : `https://www.calltechcare.com/sprinkler-repair-${slug}`;

  const heroTitle1 = normalizeHeroTitle1(pick(city.heroTitle1, city.heroTitle1Es, locale), name, locale);
  // Hero image alt: the city's own Sanity alt when set, otherwise the
  // default describing the shared hero photo (sprinklers working),
  // in the page language. Hero.tsx used to hardcode alt="", so the
  // alt text never reached the page.
  const heroImageAlt =
    pick(city.heroImageAlt, city.heroImageAltEs, locale) ||
    (isEs ? "Sistema de sprinklers funcionando" : "Sprinkler system working");
  const heroTitle2 = pick(city.heroTitle2, city.heroTitle2Es, locale);
  const heroSubtitle = pick(city.heroSubtitle, city.heroSubtitleEs, locale);
  const heroBadge = pick(city.heroBadge, city.heroBadgeEs, locale);
  const seoIntroTitle = pick(city.seoIntroTitle, city.seoIntroTitleEs, locale);
  const introP1 = substitutePhonePlaceholders(pick(city.introP1, city.introP1Es, locale), settings);
  // The fixed "Common sprinkler problems we fix" intro block duplicates the
  // extraSections content on pages that have it (Miami), so hide it there.
  // Other city pages keep the block unchanged.
  const hasExtraSections = (city.extraSections ?? []).some(
    (sec) => sec.heading || sec.intro || sec.items?.length || sec.itemsEs?.length,
  );
  const areaSegments = isEs && city.areaSegmentsEs?.length ? city.areaSegmentsEs : city.areaSegments ?? [];
  const faqs = composeFaqs(city, locale, settings);
  const variant = city.highlightsVariant ?? "";

  // Derivations (see header comment + exported helpers above).
  const breadcrumbName = cityBreadcrumbName(city, locale);
  const serviceName = cityServiceName(city, locale);

  const highlightsSub = isHub
    ? isEs
      ? "Diagnóstico rápido, comunicación clara y servicio confiable en Miami-Dade y Broward."
      : "Quick diagnosis, clear communication, and reliable service across Miami and Broward."
    : isEs
      ? `Diagnóstico rápido, comunicación clara y servicio confiable en ${name} y ${county}.`
      : `Quick diagnosis, clear communication, and reliable service across ${name} and ${county}.`;
  const gallerySub = isHub
    ? isEs
      ? "Trabajos reales de sprinkler de CallTechCare en Miami-Dade y Broward."
      : "Real sprinkler work by CallTechCare across Miami and Broward."
    : isEs
      ? `Trabajos reales de sprinkler de CallTechCare en ${name} y ${county}.`
      : `Real sprinkler work by CallTechCare across ${name} and ${county}.`;
  const faqHeading = isEs
    ? `Preguntas Frecuentes Sobre Reparación de Sprinklers en ${name}`
    : `Frequently Asked Questions About Sprinkler Repair in ${name}`;

  const detailsHref = serviceHref("sprinkler-repair-and-installation", locale);
  const cameraHref = serviceHref("wireless-camera-installation", locale);

  return (
    <div className="heritage-city-page">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: serviceName,
            areaServed: {
              "@type": "City",
              name,
              // ZIPs stay machine-readable only: postalCode is not a
              // property of schema.org City, so the ZIPs live in a nested
              // PostalAddress (Place.address) instead. Visible ZIP text
              // was removed from city pages 15 Nov 2026.
              address: {
                "@type": "PostalAddress",
                addressLocality: name,
                addressRegion: "FL",
                postalCode: city.zipCodes ?? [],
              },
            },
            url: canonical,
          }),
        }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.calltechcare.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: breadcrumbName,
                item: canonical,
              },
            ],
          }),
        }}
      />

      {/* City hero: the H1 already names the city. The form no longer
          sits right under it — a button scrolls to it instead, so the
          city's own content (seo-intro below) is what the visitor sees
          first after the hero. */}
      <Hero
        titleLine1={heroTitle1}
        titleLine2={heroTitle2}
        subtitle={heroSubtitle}
        badgeText={heroBadge}
        primaryCtaText={t.callNow}
        primaryCtaHref={`tel:${settings.phoneTel}`}
        secondaryCtaText={isEs ? "Pide tu inspección gratis" : "Get your free inspection"}
        secondaryCtaHref="#quick-lead"
        secondaryCtaAriaLabel={
          isEs
            ? `Envíanos un mensaje rápido para reparación de sprinklers en ${name}`
            : `Send us a quick message for sprinkler repair in ${name}`
        }
        imageAlt={heroImageAlt}
        showCallButton={false}
        googleRating={googleRating}
        {...(isEs ? { stats: ES_STATS } : {})}
      />

      <section className="seo-intro-section">
        <div className="seo-intro">
          <div className="seo-trust-chips">
            <span>{isEs ? "Inspección gratis" : "Free inspection"}</span>
            <span>{isEs ? "Mismo día dentro del horario" : "Same-day within business hours"}</span>
          </div>
          <h2 className="seo-intro-title">{seoIntroTitle}</h2>
          {introP1.split("\n\n").map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
          <Link href={detailsHref} className="spr-detailsLink" aria-label={t.detailsAria}>
            {t.detailsText}
          </Link>
          <p>{GOAL_P[locale]}</p>
          {!hasExtraSections ? (
            <>
              <h3 className="spr-landing-h3">{t.commonH3}</h3>
              <p>{COMMON_P[locale]}</p>
              <p>{NOT_SURE_P[locale]}</p>
            </>
          ) : null}
          <p>
            {t.cameraPrefix}
            <Link href={cameraHref}>{t.cameraLinkText}</Link>
            {t.cameraSuffix}
          </p>
          <h3 className="spr-landing-h3">{t.areaH3}</h3>
          <p className="seo-area-list">{renderAreaSegments(areaSegments, locale)}</p>
          <p>
            {t.finalCtaPrefix}
            <Link href="#quick-lead">{t.finalCtaLinkText}</Link>
            {t.finalCtaSuffix}
          </p>
          <p>
            {isEs
              ? "Garantía: 1 año de garantía de mano de obra cuando CallTechCare hace el trabajo y provee los materiales."
              : "Warranty: 1-year workmanship warranty when CallTechCare performs the work and provides the materials."}
          </p>
        </div>
      </section>

      {/* Extra content sections from Sanity (heading + intro + bullets),
          shown after the intro and before the lead form. Generic: any city
          with extraSections renders them. */}
      {(city.extraSections ?? []).map((sec, i) => {
        const heading = pick(sec.heading, sec.headingEs, locale);
        const intro = pick(sec.intro, sec.introEs, locale);
        const items = isEs && sec.itemsEs?.length ? sec.itemsEs : sec.items ?? [];
        if (!heading && !intro && !items.length) return null;
        return (
          <section key={sec._key ?? i} className="spr-landing-section">
            <div className="spr-landing">
              {heading ? <h2 className="spr-landing-title">{heading}</h2> : null}
              {intro ? <p className="spr-landing-sub">{intro}</p> : null}
              <ul>
                {items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}

      {/* Google reviews, same section as the home page (same Sanity copy,
          same text-only filter): city pages had only the 5.0 hero stat and
          no words from a real customer, while the ads land here. */}
      <GoogleReviewsCTA locale={locale} />

      {/* Quick lead form, AFTER the city's own content: prominent call
          button + short form posting to the same /api/quote-request
          endpoint as the full quote flow (same Google Ads conversion). */}
      <QuickLeadForm
        locale={locale}
        service={{ service: "sprinkler-repair-and-installation" }}
        cityName={name}
        phoneTel={settings.phoneTel}
        phoneDisplay={settings.phoneDisplay}
      />

      <section className="spr-landing-section" aria-label={t.ariaHighlights}>
        <div className="spr-landing">
          <h2 className="spr-landing-title">{t.highlightsTitle}</h2>
          <p className="spr-landing-sub">{highlightsSub}</p>
          {/* Editorial rows, not cards: number + small illustration +
              title + body, hairline-separated. Same text, same links,
              same variant logic. */}
          <ol className="heritage-city-highlights">
            {t.cards.map((card, i) => {
              const Illustration = ILLUSTRATIONS[i];
              const titleNode =
                variant === "linked-titles" ? (
                  <Link
                    href={serviceHref(card.linkSlug, locale)}
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    {card.title}
                  </Link>
                ) : (
                  card.title
                );
              return (
                <li key={card.linkSlug} className="heritage-city-highlight-row">
                  <span className="heritage-city-highlight-num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="heritage-city-highlight-media">
                    <Illustration />
                  </span>
                  <span className="heritage-city-highlight-text">
                    <h3 className="heritage-city-highlight-title">{titleNode}</h3>
                    <span className="heritage-city-highlight-body">
                      {card.body}
                      {variant !== "linked-titles" && (
                        <>
                          {" "}
                          {variant === "short-links" ? card.shortSee : card.see}
                          <Link href={serviceHref(card.linkSlug, locale)}>
                            {variant === "short-links" ? card.shortLinkText : card.linkText}
                          </Link>
                          {card.suffix}
                        </>
                      )}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>

          <div className="spr-steps" aria-label={t.ariaSteps}>
            <h2 className="spr-landing-title">{t.stepsTitle}</h2>
            <div className="spr-stepGrid">
              {t.steps.map((step, i) => (
                <div key={step.title} className="spr-step spr-anim" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="spr-stepNum">{i + 1}</div>
                  <div>
                    <h3 className="spr-stepTitle">{step.title}</h3>
                    <p className="spr-stepText">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="spr-landing-cta">
            {t.ctaPrefix}
            <Link href="#quick-lead">{t.ctaLink1}</Link>
            {t.ctaMid}
            <Link href={detailsHref}>{t.ctaLink2}</Link>
            {t.ctaSuffix}
          </p>
        </div>
      </section>

      <section className="spr-landing-section" aria-label={t.ariaWork}>
        <div className="spr-landing">
          <h2 className="spr-landing-title">{t.ourWorkTitle}</h2>
          <p className="spr-landing-sub">{gallerySub}</p>
          <div
            className="spr-gallery-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
            }}
          >
            {(city.gallery ?? []).map((img, i) => {
              // next/image (was a plain <img> at a fixed ?w=900): the
              // gallery grid is 240px+ columns, so with `sizes` a phone
              // picks 640/828w (~113 KB for the 5712px file) instead of
              // the fixed 949 KB. One shared template covers all 32
              // city pages, EN + ES. The src is the bare Sanity asset
              // URL — no ?w= baked in, so next/image chooses the width.
              const src = sanityImageUrl(img.asset?._ref);
              // next/image throws on an empty src (a plain <img> only
              // showed a broken image), so skip gallery entries whose
              // asset reference is missing instead of rendering them.
              if (!src) return null;
              const alt = pick(img.alt, img.altEs, locale);
              const caption = pick(img.caption, img.captionEs, locale);
              return (
                <figure key={`${src}-${i}`} style={{ margin: 0 }}>
                  <Image
                    src={src}
                    alt={alt}
                    width={900}
                    height={675}
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{ width: "100%", height: "auto", aspectRatio: "4 / 3", objectFit: "cover", borderRadius: "12px", display: "block" }}
                  />
                  <figcaption>{caption}</figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      <section className="spr-landing-section" aria-label={t.ariaFaq}>
        <div className="spr-landing">
          <div className="service-faq">
            <h2 className="faq-heading">{faqHeading}</h2>
            <div className="faq-list">
              {faqs.map((f) => (
                <details key={f.q} className="faq-item">
                  <summary className="faq-question">
                    <span>{f.q}</span>
                    <span className="faq-toggle" aria-hidden="true">+</span>
                  </summary>
                  <p className="faq-answer">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
