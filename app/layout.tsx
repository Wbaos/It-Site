
import "./globals.css";

import { Fraunces } from "next/font/google";

// Heritage (Patrimonio) redesign: editorial serif for display type
// (headings, hero title, section titles). Body text stays the system
// sans. The variable is consumed by the heritage layer in globals.css.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
  display: "swap",
});

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "./Providers";
import { LoadingProvider } from "@/lib/LoadingContext";
import type { Metadata } from "next";
import QuickCallButton from "@/components/QuickCallButton";
import SiteJsonLd from "@/components/SiteJsonLd";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import CookieConsent from "@/components/CookieConsent";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import IconSprite from "@/components/common/IconSprite";
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
    default: "CallTechCare | Sprinkler Repair Miami & Broward",
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
    title: "CallTechCare | Sprinkler Repair Miami & Broward",  
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
    title: "CallTechCare | Sprinkler Repair Miami & Broward",  
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
  // The site-wide schema (@graph) used to live here and read the locale
  // + pathname from the middleware via headers() — that made every route
  // dynamic. It now lives in components/SiteJsonLd, which reads the same
  // two facts from usePathname(), so this layout stays static.

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

  // Language: the static shell serves lang="en". The inline script in
  // <head> below runs while the document is still parsing (before first
  // paint and before hydration) and corrects it to "es" on Spanish
  // routes, so the DOM — what screen readers and Google's renderer see
  // — always has the right language. Same pattern as a theme script;
  // suppressHydrationWarning keeps React from fighting the correction.
  // (The old R7 mechanism — locale from the middleware via headers() —
  // is what forced every route dynamic; see SiteJsonLd for the schema.)
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={fraunces.variable}>
      <head>
        {/* Language fix-up (see the R7 note above): runs during parsing,
            before paint and hydration. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{document.documentElement.lang=(location.pathname==="/es"||location.pathname.indexOf("/es/")===0)?"es":"en";}catch(e){}`,
          }}
        />
        {/* Pre-paint background: the site base color (#0a1a12) inlined here
            so the first paint is dark green, not the browser-default white,
            while globals.css is still loading on a cold cache / slow
            network. Mirrors the html rule in globals.css. */}
        <style>{`html,body{background-color:#0a1a12}`}</style>

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
        <meta name="theme-color" content="#1e4d3a" />

        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

        <link rel="manifest" href="/site.webmanifest" />

        <meta
          name="copyright"
          content="© 2025 CallTechCare. All rights reserved."
        />

        <SiteJsonLd cities={footerCities} settings={settings} />
      </head>

      <body>
        <IconSprite />

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
