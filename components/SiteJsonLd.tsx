"use client";

// Site-wide schema (@graph: LocalBusiness + WebSite + generic Service),
// rendered from the client so the root layout can stay static.
//
// WHY this is a Client Component: the schema text depends on the page —
// Spanish pages get the Spanish description, camera pages describe
// cameras, and pages that already emit their own Service schema skip the
// generic Service node. The root layout used to read those two facts
// (locale + pathname) from the middleware via headers(), and headers()
// opts every route into dynamic rendering (Cache-Control: no-store on
// every page, X-Vercel-Cache: MISS always). This component reads the
// same two facts from usePathname() instead: the pathname is known at
// prerender time for static routes, so the routes stay static and the
// script still renders server-side with the right values on every page.
// The business data (cities, phone, hours) still comes from the layout
// as props — those fetches are cached 1h in the Sanity client, so they
// do not force dynamic rendering either.
import { usePathname } from "next/navigation";
import type { SiteSettings } from "@/lib/sanitySettings";

export type SiteJsonLdCity = { name: string; slug: string; esSlug: string };

export default function SiteJsonLd({
  cities,
  settings,
}: {
  cities: SiteJsonLdCity[];
  settings: Required<SiteSettings>;
}) {
  // Same locale rule the middleware used: /es and /es/* are Spanish.
  const pathname = usePathname() ?? "";
  const locale = pathname === "/es" || pathname.startsWith("/es/") ? "es" : "en";
  const isCameraPage =
    pathname.includes("camera") ||
    pathname.includes("camaras") ||
    pathname.includes("home-security") ||
    pathname.includes("seguridad-del-hogar");
  const schemaDescription =
    locale === "es"
      ? isCameraPage
        ? "Instalación profesional de cámaras de seguridad en Miami y Broward. Servicio el mismo día dentro del horario de servicio, inspección gratis."
        : "Reparación de sprinklers e irrigación en Miami y Broward. Servicio el mismo día dentro del horario de servicio, inspección gratis."
      : isCameraPage
        ? "Professional security camera installation in Miami and Broward. Same-day service within business hours, free inspection."
        : "Professional sprinkler repair and irrigation services in Miami and Broward. Same-day service within business hours, free inspection.";

  // R13: the home address and its coordinates are NOT published in the
  // schema any more — the business is service-area only (no location
  // stored on the Google profile). Only the service area (Miami, FL)
  // is described; the street address, postal code and geo fields stay
  // in site-settings as data but are never rendered here.
  const orgJsonLd = {
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": "https://www.calltechcare.com/#business",
    name: "CallTechCare",
    url: "https://www.calltechcare.com",
    // City-level address only (no street, ZIP or geo): the business is
    // service-area only (R13). Google requires an address on
    // LocalBusiness, and Miami, FL is already public everywhere.
    address: {
      "@type": "PostalAddress",
      addressLocality: "Miami",
      addressRegion: "FL",
      addressCountry: "US",
    },
    image: "https://www.calltechcare.com/logo-og.png",
    logo: {
      "@type": "ImageObject",
      url: "https://www.calltechcare.com/logo-schema.png",
      width: 512,
      height: 512,
    },
    description: schemaDescription,
    telephone: settings.phoneIntl,
    areaServed: cities.map((c) => ({ "@type": "City", name: c.name })),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings.phoneIntl,
      contactType: "customer service",
      areaServed: "US",
      availableLanguage: ["English", "Spanish"],
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: settings.hoursWeekdayOpens,
        closes: settings.hoursWeekdayCloses,
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: settings.hoursWeekendOpens,
        closes: settings.hoursWeekendCloses,
      },
    ],
    sameAs: [
      "https://www.facebook.com/CallTechCare",
      "https://www.instagram.com/CallTechCare",
      "https://www.yelp.com/biz/call-tech-care-miami?osq=calltechcare",
      "https://nextdoor.com/page/calltechcare-1/",
    ],
    paymentAccepted: ["Cash", "Check", "Credit Card", "Zelle"],
  };

  const webSiteJsonLd = {
    "@type": "WebSite",
    "@id": "https://www.calltechcare.com/#website",
    url: "https://www.calltechcare.com",
    name: "CallTechCare",
    publisher: { "@id": "https://www.calltechcare.com/#business" },
    inLanguage: locale === "es" ? "es" : "en-US",
  };

  // Generic Service node: serviceType + provider only. The 33-city
  // areaServed list used to be duplicated here AND on the LocalBusiness
  // node above (~950 B); the provider reference covers it. And the whole
  // node is omitted on pages that already emit their own, richer Service
  // schema (locations, services and city pages EN+ES) — the generic one
  // added nothing there.
  const serviceJsonLd = {
    "@type": "Service",
    serviceType: [
      "Sprinkler System Repair",
      "Irrigation System Installation",
      "Security Camera Installation",
    ],
    provider: {
      "@id": "https://www.calltechcare.com/#business",
    },
  };

  // Pages whose template already emits its own Service schema, so the
  // generic Service node above is redundant there. Hubs (/locations,
  // /es/areas-de-servicio) emit only a WebPage node, so they keep it.
  // Spanish service + city pages render the same ServicePage /
  // CityTemplate components as the English ones, hence the /es/ prefix
  // match (blog posts live under /es/blog/ and do not match).
  const hasOwnServiceSchema =
    pathname.startsWith("/locations/") ||
    pathname.startsWith("/es/areas-de-servicio/") ||
    pathname === "/services" ||
    pathname.startsWith("/services/") ||
    pathname === "/es/servicios" ||
    pathname.startsWith("/sprinkler-repair-") ||
    /^\/es\/(instalacion|reparacion|reemplazo|actualizacion|plan-de|prueba-de)-/.test(
      pathname
    );

  // One @graph script instead of four separate scripts: the standalone
  // Organization node is gone (its name/url/logo/sameAs duplicated the
  // LocalBusiness node; its extra sameAs links moved there, and the
  // WebSite publisher now points at #business, which is an Organization
  // subtype). Saves ~1.6 KB per page, HTML and RSC payload alike.
  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [
      orgJsonLd,
      webSiteJsonLd,
      ...(hasOwnServiceSchema ? [] : [serviceJsonLd]),
    ],
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
    />
  );
}
