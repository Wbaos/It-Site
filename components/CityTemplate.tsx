import Link from "next/link";
import type { ReactNode } from "react";
import Hero from "@/components/sections/Hero";
import { serviceHref } from "@/lib/serviceTwins";
import { cityHref } from "@/lib/cityTwins";
import { sanityImageUrl } from "@/lib/sanityCities";
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

// Breadcrumb name = hero title with " in " removed in English
// ("Sprinkler Repair in Surfside" -> "Sprinkler Repair Surfside");
// Spanish keeps "en" ("Reparación de Sprinklers en Miami").
export function cityBreadcrumbName(city: City, locale: Locale): string {
  const h1 = pick(city.heroTitle1, city.heroTitle1Es, locale);
  return locale === "es" ? h1 : h1.replace(" in ", " ");
}

// Service schema name = hero title, except Aventura which drops " in "
// ("Sprinkler Repair Aventura" / "Reparación de Sprinklers Aventura").
export function cityServiceName(city: City, locale: Locale): string {
  const h1 = pick(city.heroTitle1, city.heroTitle1Es, locale);
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
  requestQuote: string;
  quoteHref: string;
  ariaHighlights: string;
  ariaSteps: string;
  ariaFaq: string;
  ariaWork: string;
  cards: CardDef[];
  steps: { title: string; text: string }[];
  hubLangText: string;
  hubLangHref: string;
};

const TEXT: Record<Locale, LocaleText> = {
  en: {
    detailsText: "View full sprinkler repair & irrigation service details →",
    detailsAria: "View full sprinkler repair and irrigation service details",
    commonH3: "Common sprinkler problems we fix",
    areaH3: "Service area",
    cameraPrefix: "After sprinkler repair and irrigation service, we also provide ",
    cameraLinkText: "wireless camera installation",
    cameraSuffix: " for homes and small businesses.",
    finalCtaPrefix: "Ready to get started? Call now or ",
    finalCtaLinkText: "request a quote",
    finalCtaSuffix: " and we’ll confirm details and schedule the next available visit.",
    highlightsTitle: "Fix the sprinklers. Protect the yard. Stop wasting water.",
    stepsTitle: "How it works",
    ctaPrefix: "Prefer to go straight to scheduling? ",
    ctaLink1: "Request a quote",
    ctaMid: " or call now. Want full service details? View ",
    ctaLink2: "Sprinkler Repair & Irrigation",
    ctaSuffix: ".",
    ourWorkTitle: "Our Work",
    callNow: "Call Now",
    requestQuote: "Request a Quote",
    quoteHref: "/request-quote",
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
      { title: "On-site diagnosis", text: "We inspect the system, isolate the issue, and explain the recommended fix clearly." },
      { title: "Repair & test", text: "We complete the repair and test zones so your system runs reliably again." },
    ],
    hubLangText: "Ver esta página en español →",
    hubLangHref: "/es/reparacion-de-sprinklers-miami",
  },
  es: {
    detailsText: "Ver detalles completos del servicio de reparación de sprinklers e irrigación →",
    detailsAria: "Ver detalles completos del servicio de reparación de sprinklers e irrigación",
    commonH3: "Problemas comunes de sprinklers que reparamos",
    areaH3: "Área de servicio",
    cameraPrefix: "Después del servicio de reparación de sprinklers e irrigación, también ofrecemos ",
    cameraLinkText: "instalación de cámaras inalámbricas",
    cameraSuffix: " para hogares y pequeños negocios.",
    finalCtaPrefix: "¿Listo para empezar? Llama ahora o ",
    finalCtaLinkText: "solicita una cotización",
    finalCtaSuffix: " y te confirmamos los detalles y programamos la próxima visita disponible.",
    highlightsTitle: "Repara los sprinklers. Protege el jardín. Deja de desperdiciar agua.",
    stepsTitle: "Cómo funciona",
    ctaPrefix: "¿Prefieres agendar directo? ",
    ctaLink1: "Solicita una cotización",
    ctaMid: " o llama ahora. ¿Quieres los detalles completos del servicio? Ver ",
    ctaLink2: "Reparación de Sprinklers e Irrigación",
    ctaSuffix: ".",
    ourWorkTitle: "Nuestro Trabajo",
    callNow: "Llama ahora",
    requestQuote: "Solicita una cotización",
    quoteHref: "/es/solicita-una-cotizacion",
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
      { title: "Diagnóstico en sitio", text: "Inspeccionamos el sistema, aislamos el problema y te explicamos claramente la solución recomendada." },
      { title: "Reparación y prueba", text: "Completamos la reparación y probamos las zonas para que tu sistema funcione de forma confiable otra vez." },
    ],
    hubLangText: "View this page in English →",
    hubLangHref: "/sprinkler-repair-miami",
  },
};

// Shared FAQs (indices 0,1,2,3,4,5,8 of the standard 9). {CITY}, {COUNTY}
// and {SISTERS} are substituted per city; local FAQs fill indices 6 and 7.
const SHARED_FAQS: Record<Locale, { q: string; a: string }[]> = {
  en: [
    {
      q: "How much does sprinkler repair cost in {CITY}?",
      a: "It depends on the problem and the size of your system. A broken sprinkler head costs less than a valve or zone repair. CallTechCare gives you a clear, upfront estimate before starting any work, and the estimate is free.",
    },
    {
      q: "How fast can you come to {CITY} for a sprinkler repair?",
      a: "In {CITY} and most of {COUNTY}, same-day appointments are available. Call (786) 366-2729 and we will confirm the next available visit.",
    },
    {
      q: "Do you serve areas near {CITY}?",
      a: "Yes. We serve {CITY} and nearby {COUNTY} cities, including {SISTERS}, as well as all of Miami-Dade and Broward.",
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
      a: "Yes. CallTechCare offers sprinkler repair near you in {CITY} — same-day appointments within business hours and free inspection. Call (786) 366-2729 and we'll confirm the next available visit.",
    },
  ],
  es: [
    {
      q: "¿Cuánto cuesta la reparación de sprinklers en {CITY}?",
      a: "Depende del problema y del tamaño de tu sistema. Un cabezal roto cuesta menos que una reparación de válvula o de zona. CallTechCare te da un estimado claro y por adelantado antes de empezar cualquier trabajo, y el estimado es gratis.",
    },
    {
      q: "¿Qué tan rápido pueden venir a {CITY} para una reparación de sprinklers?",
      a: "En {CITY} y la mayor parte de {COUNTY}, hay citas disponibles el mismo día. Llama al (786) 366-2729 y te confirmamos la próxima visita disponible.",
    },
    {
      q: "¿Atienden áreas cerca de {CITY}?",
      a: "Sí. Atendemos {CITY} y las ciudades cercanas de {COUNTY}, incluyendo {SISTERS}, así como todo Miami-Dade y Broward.",
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
      a: "Sí. CallTechCare ofrece reparación de sprinklers cerca de ti en {CITY} — citas el mismo día y estimados gratis. Llama al (786) 366-2729 y te confirmaremos la próxima visita disponible.",
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
  { value: "5/5", label: "Satisfacción del Cliente" },
  { value: "Mismo Día", label: "Citas Disponibles" },
];

function composeFaqs(city: City, locale: Locale): { q: string; a: string }[] {
  if (city.isHub) {
    const list = locale === "es" && city.faqsOverrideEs?.length ? city.faqsOverrideEs : city.faqsOverride;
    return (list ?? []).map((f) => ({ q: f.q ?? "", a: f.a ?? "" })).filter((f) => f.q);
  }
  const name = city.name ?? "";
  const county = city.county ?? "";
  const sisters = (city.sisters ?? []).map((s) => s.name ?? "");
  const sistersJoined = locale === "en" ? oxfordJoin(sisters) : esJoin(sisters);
  const sub = (s: string) =>
    s.replaceAll("{CITY}", name).replaceAll("{COUNTY}", county).replaceAll("{SISTERS}", sistersJoined);
  const shared = SHARED_FAQS[locale].map((f) => ({ q: sub(f.q), a: sub(f.a) }));
  const local = (locale === "es" && city.localFaqsEs?.length ? city.localFaqsEs : city.localFaqs ?? [])
    .map((f) => ({ q: f.q ?? "", a: f.a ?? "" }))
    .filter((f) => f.q);
  const faqs = [...shared.slice(0, 6), ...local, shared[6]];
  const overrides = locale === "es" && city.faqOverridesEs?.length ? city.faqOverridesEs : city.faqOverrides;
  for (const o of overrides ?? []) {
    if (o.index == null || !faqs[o.index]) continue;
    if (o.q) faqs[o.index].q = o.q;
    if (o.a) faqs[o.index].a = o.a;
  }
  return faqs;
}

function routeAreaHref(href: string, locale: Locale): string {
  if (href.startsWith("/sprinkler-repair-")) {
    return cityHref(href.replace("/sprinkler-repair-", ""), locale);
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
    if (seg.linkHref) {
      if (nodes.length > 0) nodes.push(" ");
      nodes.push(
        <Link key={`l${i}`} href={routeAreaHref(seg.linkHref, locale)}>
          {seg.linkText}
        </Link>,
      );
    } else if (segText) {
      if (needsSpace) nodes.push(" ");
      nodes.push(segText);
    }
  });
  return nodes;
}

export default function CityTemplate({ city, locale }: { city: City; locale: Locale }) {
  const t = TEXT[locale];
  const isEs = locale === "es";
  const slug = city.slug?.current ?? "";
  const name = city.name ?? "";
  const county = city.county ?? "";
  const isHub = !!city.isHub;
  const canonical = isEs
    ? `https://www.calltechcare.com/es/${city.esSlug ?? ""}`
    : `https://www.calltechcare.com/sprinkler-repair-${slug}`;

  const heroTitle1 = pick(city.heroTitle1, city.heroTitle1Es, locale);
  const heroTitle2 = pick(city.heroTitle2, city.heroTitle2Es, locale);
  const heroSubtitle = pick(city.heroSubtitle, city.heroSubtitleEs, locale);
  const heroBadge = pick(city.heroBadge, city.heroBadgeEs, locale);
  const seoIntroTitle = pick(city.seoIntroTitle, city.seoIntroTitleEs, locale);
  const introP1 = pick(city.introP1, city.introP1Es, locale);
  const areaSegments = isEs && city.areaSegmentsEs?.length ? city.areaSegmentsEs : city.areaSegments ?? [];
  const faqs = composeFaqs(city, locale);
  const variant = city.highlightsVariant ?? "";

  // Derivations (see header comment + exported helpers above).
  const breadcrumbName = cityBreadcrumbName(city, locale);
  const serviceName = cityServiceName(city, locale);

  const highlightsSub = isHub
    ? isEs
      ? "Diagnóstico rápido, comunicación clara y servicio confiable en sitio en Miami-Dade y Broward."
      : "Quick diagnosis, clear communication, and reliable on-site service across Miami and Broward."
    : isEs
      ? `Diagnóstico rápido, comunicación clara y servicio confiable en sitio en ${name} y ${county}.`
      : `Quick diagnosis, clear communication, and reliable on-site service across ${name} and ${county}.`;
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
    <>
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
            provider: {
              "@type": "LocalBusiness",
              name: "CallTechCare",
              telephone: "+1-786-366-2729",
              url: "https://www.calltechcare.com",
            },
            areaServed: {
              "@type": "City",
              name,
              addressRegion: "FL",
              postalCode: city.zipCodes ?? [],
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

      <Hero
        titleLine1={heroTitle1}
        titleLine2={heroTitle2}
        subtitle={heroSubtitle}
        badgeText={heroBadge}
        primaryCtaText={t.callNow}
        primaryCtaHref="tel:+17863662729"
        secondaryCtaText={t.requestQuote}
        secondaryCtaHref={t.quoteHref}
        showCallButton={false}
        {...(isEs ? { stats: ES_STATS } : {})}
      />

      <section className="seo-intro-section">
        <div className="seo-intro">
          {isHub && (
            <p>
              <Link href={t.hubLangHref}>{t.hubLangText}</Link>
            </p>
          )}
          <h2 className="seo-intro-title">{seoIntroTitle}</h2>
          <p>{introP1}</p>
          <Link href={detailsHref} className="spr-detailsLink" aria-label={t.detailsAria}>
            {t.detailsText}
          </Link>
          <p>{GOAL_P[locale]}</p>
          <h3 className="spr-landing-h3">{t.commonH3}</h3>
          <p>{COMMON_P[locale]}</p>
          <p>{NOT_SURE_P[locale]}</p>
          <p>
            {t.cameraPrefix}
            <Link href={cameraHref}>{t.cameraLinkText}</Link>
            {t.cameraSuffix}
          </p>
          <h3 className="spr-landing-h3">{t.areaH3}</h3>
          <p>{renderAreaSegments(areaSegments, locale)}</p>
          <p>
            {t.finalCtaPrefix}
            <Link href={t.quoteHref}>{t.finalCtaLinkText}</Link>
            {t.finalCtaSuffix}
          </p>
        </div>
      </section>

      <section className="spr-landing-section" aria-label={t.ariaHighlights}>
        <div className="spr-landing">
          <h2 className="spr-landing-title">{t.highlightsTitle}</h2>
          <p className="spr-landing-sub">{highlightsSub}</p>
          <div className="spr-cardGrid">
            {t.cards.map((card, i) => {
              const Illustration = ILLUSTRATIONS[i];
              const delay = `${i * 80}ms`;
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
                <div key={card.linkSlug} className="spr-card spr-anim" style={{ animationDelay: delay }}>
                  <div className="spr-cardMedia">
                    <Illustration />
                  </div>
                  <h3 className="spr-cardTitle">{titleNode}</h3>
                  <p className="spr-cardText">
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
                  </p>
                </div>
              );
            })}
          </div>

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
            <Link href={t.quoteHref}>{t.ctaLink1}</Link>
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
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
            }}
          >
            {(city.gallery ?? []).map((img, i) => {
              const src = sanityImageUrl(img.asset?._ref);
              const alt = pick(img.alt, img.altEs, locale);
              const caption = pick(img.caption, img.captionEs, locale);
              return (
                <figure key={`${src}-${i}`} style={{ margin: 0 }}>
                  <img
                    src={`${src}?w=900&auto=format`}
                    alt={alt}
                    loading="lazy"
                    style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", borderRadius: "12px", display: "block" }}
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
    </>
  );
}
