import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "./Providers";
import { LoadingProvider } from "@/lib/LoadingContext";
import type { Metadata } from "next";

// ============================================================================
//  SITE METADATA — SEO + SOCIAL + PWA
// ============================================================================
export const metadata: Metadata = {
  metadataBase: new URL("https://www.calltechcare.com"),

  title: {
    default: "TechCare | Friendly Tech Support Made Simple",
    template: "%s | TechCare",
  },
  description:
    "TechCare offers friendly, professional tech support for all ages — from phone and tablet setup to Wi-Fi troubleshooting and smart home installation. Book expert help online or in person.",
  keywords: [
    "Tech Support",
    "Wi-Fi Help",
    "Smart Home Setup",
    "Tablet Assistance",
    "Phone Troubleshooting",
    "Computer Help",
    "Device Installation",
    "TechCare",
    "Tech Support Miami",
    "Remote Tech Help",
    "In-Home Tech Support",
  ],

  openGraph: {
    title: "TechCare – Friendly Tech Support Made Simple",
    description:
      "Get reliable tech assistance for your devices, Wi-Fi, and smart home. TechCare makes technology stress-free for everyone — at home or remotely.",
    url: "https://www.calltechcare.com",
    siteName: "TechCare",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo-og.png",
        width: 1200,
        height: 630,
        alt: "TechCare – Friendly Tech Support Made Simple",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@TechCare",
    title: "TechCare | Friendly Tech Support for Everyone",
    description:
      "Your trusted tech experts — setup, troubleshoot, and optimize your devices with ease. Available in person or online.",
    images: ["/logo-og.png"],
  },

  // --- Browser & device icons ---
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

// ============================================================================
//  ROOT LAYOUT
// ============================================================================
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {/* PERFORMANCE */}
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="preload" href="/logo.svg" as="image" />

        {/* OTHER META */}
        <meta name="apple-mobile-web-app-title" content="TechCare" />
        <link rel="canonical" href="https://www.calltechcare.com" />
        <meta name="theme-color" content="#0891b2" />
        <meta name="author" content="TechCare" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="copyright" content="© 2025 TechCare. All rights reserved." />

        {/* STRUCTURED DATA */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "TechCare",
            url: "https://www.calltechcare.com",
            logo: "https://www.calltechcare.com/logo-og.png",
            sameAs: [
              "https://www.facebook.com/TechCare",
              "https://www.instagram.com/TechCare",
              "https://www.linkedin.com/company/techcare",
            ],
            description:
              "Friendly, professional tech support for all ages — setup, troubleshoot, and optimize your devices at home or remotely.",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+1-7863662729",
              contactType: "Customer Service",
              areaServed: "US",
              availableLanguage: ["English", "Spanish"],
            },
          })}
        </script>
      </head>
      <body>
        <Providers>
          <LoadingProvider>
            <Navbar />
            <main className="main-content">{children}</main>
            <Footer />
          </LoadingProvider>
        </Providers>
      </body>
    </html>
  );
}
