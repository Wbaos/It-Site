
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "./Providers";
import { LoadingProvider } from "@/lib/LoadingContext";
import type { Metadata } from "next";
import { headers } from "next/headers";
import QuickCallButton from "@/components/QuickCallButton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import CookieConsent from "@/components/CookieConsent";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { getAllCities, FALLBACK_CITIES } from "@/lib/sanityCities";
import { resolveSiteSettings } from "@/lib/sanitySettings";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.calltechcare.com"),

  /* Google Search Console */
  verification: {
    google: "PLd4xezyspNUbzAlLg-ZvFvrLK0W6aZjccA-m8EMbIY",
  },

  /* Fallback title only (pages override this) */
  title: {
    default: "CallTechCare | Sprinkler Repair Miami, Irrigation & Security Cameras",
    template: "%s",
  },

  /* Fallback description */
  description:
  "Professional sprinkler repair and irrigation services in Miami and Broward. Same-day service within business hours, free inspection.",
  keywords: [
      "Sprinkler repair Miami",
      "Irrigation repair Miami",
      "Sprinkler repair Broward County",
      "Security camera installation Miami",
      "Security camera installation Pembroke Pines",
    ],

  /* Open Graph fallback */
  openGraph: {
    title: "CallTechCare | Sprinkler Repair Miami, Irrigation & Security Cameras",  
    description:
      "Professional sprinkler repair and irrigation services in Miami and Broward. Same-day service within business hours, free inspection.", 
    siteName: "CallTechCare",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo-og.png",
        width: 1200,
        height: 630,
        alt: "CallTechCare – Sprinkler Repair Miami",
      },
    ],
  },

  /* Twitter fallback */
  twitter: {
    card: "summary_large_image",
    title: "CallTechCare | Sprinkler Repair Miami, Irrigation & Security Cameras",  
    description:
        "Professional sprinkler repair and irrigation services in Miami and Broward. Same-day service within business hours, free inspection.",
    images: ["/logo-og.png"],
  },

  /* Icons */
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  manifest: "/site.webmanifest",

  /* Robots */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

/* =========================
   ROOT LAYOUT
   ========================= */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Locale from middleware (x-locale): Spanish pages get Spanish schema text.
  // Page type from middleware (x-pathname): camera pages describe security
  // cameras, every other page describes sprinkler/irrigation work — the
  // business description must match the page, not stay global sprinklers.
  const locale = (await headers()).get("x-locale") === "es" ? "es" : "en";
  const pathname = (await headers()).get("x-pathname") ?? "";
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

  // City list and business data load in parallel (they are independent),
  // so the layout waits for one Sanity round trip instead of two. The
  // fallback semantics are unchanged: a cities failure keeps the fixed
  // list, and the settings resolver already falls back to the exact values
  // shown today, so the schema never changes on a Sanity blip.
  const [cityItems, settings] = await Promise.all([
    getAllCities().catch(() => []),
    resolveSiteSettings(),
  ]);
  let footerCities = FALLBACK_CITIES;
  if (cityItems.length) {
    footerCities = cityItems
      .filter((c) => c.slug?.current)
      .map((c) => ({
        name: c.name ?? "",
        slug: c.slug?.current ?? "",
        esSlug: c.esSlug ?? "",
      }))
      .filter((c) => c.name && c.slug);
  }

  // R13: the home address and its coordinates are NOT published in the
  // schema any more — the business is service-area only (no location
  // stored on the Google profile). Only the service area (Miami, FL)
  // is described; the street address, postal code and geo fields stay
  // in site-settings as data but are never rendered here.
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": "https://www.calltechcare.com/#business",
    name: "CallTechCare",
    url: "https://www.calltechcare.com",
    image: "https://www.calltechcare.com/logo-og.png",
    logo: {
      "@type": "ImageObject",
      url: "https://www.calltechcare.com/logo-schema.png",
      width: 512,
      height: 512,
    },
    description: schemaDescription,
    telephone: settings.phoneIntl,
    areaServed: footerCities.map((c) => ({ "@type": "City", name: c.name })),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings.phoneIntl,
      contactType: "customer service",
      areaServed: "US",
      availableLanguage: ["English", "Spanish"]
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
    ],
    serviceType: [
      "Sprinkler System Repair",
      "Irrigation System Installation",
      "Security Camera Installation",
    ],
    paymentAccepted: ["Cash", "Check", "Credit Card", "Zelle"],
  };
  

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.calltechcare.com/#website",
    url: "https://www.calltechcare.com",
    name: "CallTechCare",
    publisher: { "@id": "https://www.calltechcare.com/#organization" },
    inLanguage: locale === "es" ? "es" : "en-US",
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: [
      "Sprinkler System Repair",
      "Irrigation System Installation",
      "Security Camera Installation",
    ],
    provider: {
      "@id": "https://www.calltechcare.com/#business",
    },
    areaServed: [
      { "@type": "City", name: "Sunrise" },
      { "@type": "City", name: "Fort Lauderdale" },
      { "@type": "City", name: "Dania Beach" },
      { "@type": "City", name: "Weston" },
      { "@type": "City", name: "Davie" },
      { "@type": "City", name: "Southwest Ranches" },
      { "@type": "City", name: "Hollywood" },
      { "@type": "City", name: "West Park" },
      { "@type": "City", name: "Pembroke Pines" },
      { "@type": "City", name: "Miramar" },
      { "@type": "City", name: "Miami Gardens" },
      { "@type": "City", name: "Miami Lakes" },
      { "@type": "City", name: "Country Club" },
      { "@type": "City", name: "Aventura" },
      { "@type": "City", name: "Sunny Isles Beach" },
      { "@type": "City", name: "North Miami" },
      { "@type": "City", name: "Surfside" },
      { "@type": "City", name: "North Bay Village" },
      { "@type": "City", name: "Miami Beach" },
      { "@type": "City", name: "Hialeah" },
      { "@type": "City", name: "Doral" },
      { "@type": "City", name: "Fontainebleau" },
      { "@type": "City", name: "Tamiami" },
      { "@type": "City", name: "Miami" },
      { "@type": "City", name: "Coral Gables" },
      { "@type": "City", name: "Key Biscayne" },
      { "@type": "City", name: "Kendall" },
      { "@type": "City", name: "Kendale Lakes" },
      { "@type": "City", name: "Country Walk" },
      { "@type": "City", name: "Cutler Bay" }
    ],
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://www.calltechcare.com/#organization",
    name: "CallTechCare",
    url: "https://www.calltechcare.com",
    logo: "https://www.calltechcare.com/logo-schema.png",
    sameAs: [
      "https://www.facebook.com/CallTechCare",
      "https://www.instagram.com/CallTechCare",
      "https://www.yelp.com/biz/call-tech-care-miami?osq=calltechcare",
      "https://nextdoor.com/page/calltechcare-1/"

    ],
  };

  // R7: the locale comes from the middleware (x-locale header, read
  // above), so Spanish pages serve <html lang="es"> from the server —
  // no client-side fix-up, no hydration change.
  return (
    <html lang={locale === "es" ? "es" : "en"} data-scroll-behavior="smooth">
      <head>
        {/* Preconnect before the GTM loader below, so the tag manager
            connection is already warm when its script is injected. */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){
                w[l]=w[l]||[];
                w[l].push({
                  'gtm.start': new Date().getTime(),
                  event: 'gtm.js'
                });
                var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),
                    dl=l!='dataLayer'?'&l='+l:'';
                j.async=true;
                j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-NTDHKLLQ');
            `,
          }}
        />

        <link
          rel="preconnect"
          href="https://cdn.sanity.io"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />

        <meta name="apple-mobile-web-app-title" content="CallTechCare" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#0891b2" />

        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

        <link rel="manifest" href="/site.webmanifest" />

        <meta
          name="copyright"
          content="© 2025 CallTechCare. All rights reserved."
        />

        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />

        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />

        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>

      <body>

        <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-NTDHKLLQ"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
        </noscript>

        <ErrorBoundary>
          <Providers>
            <LoadingProvider>
              <GoogleAnalytics />
              <div id="top" />
              <Navbar phoneDisplay={settings.phoneDisplay} phoneTel={settings.phoneTel} />
              <main className="main-content">{children}</main>
              <Footer
                areas={footerCities}
                phoneDisplay={settings.phoneDisplay}
                phoneTel={settings.phoneTel}
                email={settings.email}
                hoursWeekdayLabel={settings.hoursWeekdayLabel}
                hoursWeekdayLabelEs={settings.hoursWeekdayLabelEs}
                hoursWeekdayTime={settings.hoursWeekdayTime}
                hoursWeekendLabel={settings.hoursWeekendLabel}
                hoursWeekendLabelEs={settings.hoursWeekendLabelEs}
                hoursWeekendTime={settings.hoursWeekendTime}
                serviceAreaLine={settings.serviceAreaLine}
                serviceAreaLineEs={settings.serviceAreaLineEs}
              />
              <QuickCallButton phoneDisplay={settings.phoneDisplay} phoneTel={settings.phoneTel} />
              <CookieConsent />
            </LoadingProvider>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
