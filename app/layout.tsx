import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "./Providers";
import { LoadingProvider } from "@/lib/LoadingContext";
import type { Metadata } from "next";
import ChatWidget from "@/components/ChatWidget";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.calltechcare.com"),
  title: {
    default: "Tech Support for Homes & Small Businesses | CallTechCare",
    template: "%s | CallTechCare",
  },
  description:
    "Fast, friendly tech support for homes, seniors, home offices, and small businesses across Miami, Pembroke Pines, Broward & Homestead. WiFi fixes, computer help, smart-home installation, printer setup & more.",
  keywords: [
    "Tech Support South Florida",
    "Home Tech Support",
    "Small Business IT Support",
    "WiFi Troubleshooting Miami",
    "Computer Help Broward",
    "Smart Home Installation",
    "Home Office Tech Support",
    "Pembroke Pines Tech Support",
    "Miami Tech Support",
    "Broward IT Services",
  ],
  openGraph: {
    title: "Home & Small Business Tech Support | CallTechCare",
    description:
      "Same-day tech support for homes, seniors, home offices and small businesses across Miami, Broward, Pembroke Pines & Homestead. WiFi fixes, computer help, smart-home setup & more.",
    url: "https://www.calltechcare.com",
    siteName: "CallTechCare",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo-og.png",
        width: 1200,
        height: 630,
        alt: "CallTechCare – Tech Support for Homes & Small Businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@CallTechCare",
    title: "Tech Support for Homes & Small Businesses",
    description:
      "Serving Miami, Broward, Pembroke Pines & Homestead. WiFi issues, computers, smart-home devices, printers & more.",
    images: ["/logo-og.png"],
  },
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: ["/apple-touch-icon.png"],
  },
  manifest: "/site.webmanifest",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "CallTechCare",
    url: "https://www.calltechcare.com",
    image: "https://www.calltechcare.com/logo-og.png",
    description:
      "Tech support for homes, seniors, home offices, and small businesses across Miami, Pembroke Pines, Broward & Homestead. WiFi fixes, computer repair, smart-home setups & more.",
    telephone: "+1-786-366-2729",
    priceRange: "$$",
    areaServed: [
      "Miami FL",
      "Pembroke Pines FL",
      "Broward County FL",
      "Homestead FL",
      "Miramar FL",
      "Hollywood FL",
      "Fort Lauderdale FL"
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Service Area Business",
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
      "Home Tech Support",
      "Small Business IT Support",
      "WiFi Troubleshooting",
      "Computer Help",
      "Smart Home Device Setup",
      "Printer & Router Setup",
      "Remote Tech Support"
    ],
    paymentAccepted: ["Cash", "Credit Card", "Zelle"],
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

        {/* <link
          rel="preload"
          as="image"
          href="/helping2.jpg"
          fetchPriority="high"
        /> */}

        <meta name="apple-mobile-web-app-title" content="CallTechCare" />
        <link rel="canonical" href="https://www.calltechcare.com" />
        <meta name="theme-color" content="#0891b2" />
        <meta name="author" content="CallTechCare" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta
          name="copyright"
          content="© 2025 CallTechCare. All rights reserved."
        />

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
