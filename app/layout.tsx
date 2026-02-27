import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "./Providers";
import { LoadingProvider } from "@/lib/LoadingContext";
import type { Metadata } from "next";
import ChatWidget from "@/components/ChatWidget";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import CookieConsent from "@/components/CookieConsent";
import GoogleAnalytics from "@/components/GoogleAnalytics";

/* =========================
   GLOBAL METADATA (FALLBACK)
   ========================= */
export const metadata: Metadata = {
  metadataBase: new URL("https://www.calltechcare.com"),

  /* Google Search Console */
  verification: {
    google: "PLd4xezyspNUbzAlLg-ZvFvrLK0W6aZjccA-m8EMbIY",
  },

  /* Fallback title only (pages override this) */
  title: {
    default: "CallTechCare | Local IT & Tech Support in South Florida",
    template: "%s | CallTechCare",
  },

  /* Fallback description */
  description:
    "Local IT and in-home tech support for homes, seniors, and small businesses across South Florida. We provide TV mounting, WiFi troubleshooting, home security, smart home setup, and device support.",

  /* Keywords (harmless fallback) */
  keywords: [
    "TV mounting service",
    "Security camera installation",
    "IT support for homes",
    "Small business IT support",
    "WiFi troubleshooting",
    "Smart home setup",
    "Miami tech support",
    "South Florida IT services",
  ],

  /* Open Graph fallback */
  openGraph: {
    title: "CallTechCare | Local IT & Tech Support in South Florida",
    description:
      "Local IT and in-home tech support for homes, seniors, and small businesses across South Florida. We provide TV mounting, WiFi troubleshooting, home security, smart home setup, and device support.",
    url: "https://www.calltechcare.com",
    siteName: "CallTechCare",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo-og.png",
        width: 1200,
        height: 630,
        alt: "CallTechCare – In-Home IT & Tech Support",
      },
    ],
  },

  /* Twitter fallback */
  twitter: {
    card: "summary_large_image",
    title: "CallTechCare | Local IT & Tech Support in South Florida",
    description:
      "Local IT and in-home tech support for homes, seniors, and small businesses across South Florida. We provide TV mounting, WiFi troubleshooting, home security, smart home setup, and device support.",
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
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* ITService schema (service-area business) */
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.calltechcare.com/#business",
    name: "CallTechCare",
    url: "https://www.calltechcare.com",
    image: "https://www.calltechcare.com/logo-og.png",
    description:
    "Local IT and in-home tech support for homes, seniors, and small businesses across South Florida, including TV mounting, WiFi troubleshooting, home security, smart home setup, and device support.",
    telephone: "+1-786-366-2729",
    priceRange: "$$",
    areaServed: {
      "@type": "AdministrativeArea",
      name: "South Florida",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "18730 SW 122nd Ave",
      addressLocality: "Miami",
      addressRegion: "FL",
      postalCode: "33177",
      addressCountry: "US",
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
        opens: "08:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "09:00",
        closes: "18:00",
      },
    ],
    sameAs: [
      "https://www.facebook.com/CallTechCare",
      "https://www.instagram.com/CallTechCare",
    ],
    serviceType: [
      "Local IT Support",
      "TV Mounting & Setup",
      "WiFi & Internet Support",
      "Home Security Systems",
      "Smart Home Installation",
      "Device Setup & Configuration",
      "Senior-Friendly Tech Help",
    ],
    paymentAccepted: ["Cash", "Credit Card", "Zelle"],
  };

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {/* Performance */}
        <link
          rel="preconnect"
          href="https://cdn.sanity.io"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />

        {/* App meta */}
        <meta name="apple-mobile-web-app-title" content="CallTechCare" />
        <meta name="theme-color" content="#0891b2" />
        <meta
          name="copyright"
          content="© 2025 CallTechCare. All rights reserved."
        />

        {/* Structured data */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>

      <body>
        <ErrorBoundary>
          <Providers>
            <LoadingProvider>
              <GoogleAnalytics />
              <div id="top" />
              <Navbar />
              <main className="main-content">{children}</main>
              <Footer />
              <ChatWidget />
              <CookieConsent />
            </LoadingProvider>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
