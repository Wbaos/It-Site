import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "./Providers";
import { LoadingProvider } from "@/lib/LoadingContext";
import type { Metadata } from "next";
import ChatWidget from "@/components/ChatWidget";
import { ErrorBoundary } from "@/components/ErrorBoundary";

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
    default: "CallTechCare | In-Home IT & Tech Support",
    template: "%s | CallTechCare",
  },

  /* Fallback description */
  description:
    "Professional TV mounting, security camera installation, and software-based IT support for homes and small businesses across South Florida.",

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
    title: "CallTechCare | In-Home IT & Tech Support",
    description:
      "TV mounting, camera installation, and software-based IT support across South Florida.",
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
    title: "CallTechCare | In-Home IT & Tech Support",
    description:
      "TV mounting, camera installation, and IT support for homes and small businesses in South Florida.",
    images: ["/logo-og.png"],
  },

  /* Icons */
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: ["/apple-touch-icon.png"],
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
    "@type": "ITService",
    name: "CallTechCare",
    url: "https://www.calltechcare.com",
    image: "https://www.calltechcare.com/logo-og.png",
    description:
      "TV mounting, security camera installation, and software-based IT support for homes and small businesses across South Florida.",
    telephone: "+1-786-366-2729",
    priceRange: "$$",
    areaServed: [
      "Miami FL",
      "Pembroke Pines FL",
      "Broward County FL",
      "Homestead FL",
      "Miramar FL",
      "Hollywood FL",
      "Fort Lauderdale FL",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "South Florida",
      addressRegion: "FL",
      postalCode: "33025",
      addressCountry: "US",
    },
    openingHours: "Mo-Sa 08:00-21:00",
    sameAs: [
      "https://www.facebook.com/CallTechCare",
      "https://www.instagram.com/CallTechCare",
    ],
    serviceType: [
      "TV Mounting",
      "Security Camera Installation",
      "Software-Based IT Support",
      "WiFi Troubleshooting",
      "New Device Setup",
      "Smart Home Device Setup",
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
        <meta name="author" content="CallTechCare" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
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
              <div id="top" />
              <Navbar />
              <main className="main-content">{children}</main>
              <Footer />
              <ChatWidget />
            </LoadingProvider>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
