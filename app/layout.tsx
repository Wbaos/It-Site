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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.calltechcare.com"),

  /* Google Search Console */
  verification: {
    google: "PLd4xezyspNUbzAlLg-ZvFvrLK0W6aZjccA-m8EMbIY",
  },

  /* Fallback title only (pages override this) */
  title: {
    default: "CallTechCare | TV Mounting, Security Cameras, Sprinkler Repair & Tech Support in Miami",
    template: "%s | CallTechCare",
  },

  /* Fallback description */
  description:
    "Local home, outdoor, and tech services across South Florida. We provide security camera installation, TV mounting, WiFi & internet troubleshooting, computer and printer support, phone & tablet help, senior-friendly in-home tech support, plus sprinkler & irrigation service, and tree trimming.",

  /* Keywords (harmless fallback) */
  keywords: [
      "TV mounting Miami",
      "TV wall mount installation Miami",
      "Security camera installation Miami",
      "WiFi troubleshooting Miami",
      "Computer support Miami",
      "Printer setup Miami",
      "Smart home installation Miami",
      "Sprinkler repair Miami",
      "Irrigation repair Miami",
      "Tree trimming Miami",
      "Tech support Miami",
      "IT support Miami",
      "TV mounting Miramar",
      "Security camera installation Pembroke Pines",
      "Sprinkler repair Broward County",
    ],

  /* Open Graph fallback */
  openGraph: {
    title: "CallTechCare | TV Mounting, Security Cameras, Sprinkler Repair & Tech Support in Miami",
    description:
      "CallTechCare provides TV wall mounting, security camera installation, WiFi troubleshooting, computer and printer support, sprinkler repair, irrigation services, and tree trimming across Miami, Miramar, Pembroke Pines, Hollywood, and Fort Lauderdale.",    url: "https://www.calltechcare.com",
    siteName: "CallTechCare",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo-og.png",
        width: 1200,
        height: 630,
        alt: "CallTechCare – Local Home, Outdoor & Tech Services",
      },
    ],
  },

  /* Twitter fallback */
  twitter: {
    card: "summary_large_image",
    title: "CallTechCare | TV Mounting, Security Cameras, Sprinkler Repair & Tech Support in Miami",    description:
      "CallTechCare provides TV wall mounting, security camera installation, WiFi troubleshooting, computer and printer support, sprinkler repair, irrigation services, and tree trimming across Miami, Miramar, Pembroke Pines, Hollywood, and Fort Lauderdale.",
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
    description:
      "Local home, outdoor, and tech services for homes and small businesses across South Florida, including security camera installation, TV mounting, WiFi & internet troubleshooting, computer and printer support, phone & tablet help, senior-friendly tech support, plus sprinkler & irrigation service, and tree trimming.",
    telephone: "+1-786-366-2729",
    priceRange: "$$",
    areaServed: [
      { "@type": "City", name: "Miami" },
      { "@type": "City", name: "Miramar" },
      { "@type": "City", name: "Pembroke Pines" },
      { "@type": "City", name: "Hollywood" },
      { "@type": "City", name: "Fort Lauderdale" },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "18730 SW 122nd Ave",
      addressLocality: "Miami",
      addressRegion: "FL",
      postalCode: "33177",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 25.5516,
      longitude: -80.3467
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-786-366-2729",
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
      "TV Wall Mount Installation",
      "Security Camera Installation",
      "WiFi Troubleshooting",
      "Computer Repair & Support",
      "Printer Setup & Support",
      "Smart Home Installation",
      "Sprinkler System Repair",
      "Irrigation System Installation",
      "Tree Trimming Service",
      "Senior Tech Support",
    ],
    paymentAccepted: ["Cash", "Credit Card", "Zelle"],
  };
  

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://www.calltechcare.com/#website",
    url: "https://www.calltechcare.com",
    name: "CallTechCare",
    publisher: { "@id": "https://www.calltechcare.com/#organization" },
    inLanguage: "en-US",
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Home Technology & Property Services",
    provider: {
      "@id": "https://www.calltechcare.com/#business",
    },
    areaServed: [
      { "@type": "City", name: "Miami" },
      { "@type": "City", name: "Miramar" },
      { "@type": "City", name: "Pembroke Pines" },
      { "@type": "City", name: "Hollywood" },
      { "@type": "City", name: "Fort Lauderdale" }
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

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link
          rel="preconnect"
          href="https://cdn.sanity.io"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

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
