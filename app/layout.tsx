import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "./Providers";
import { LoadingProvider } from "@/lib/LoadingContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "CareTech | Friendly Tech Help for Seniors",
    template: "%s | CareTech",
  },
  description:
    "Learn how to set up your devices, secure your smart home, and keep your tech running smoothly with expert CareTech guides.",
  metadataBase: new URL("https://caretech-blog.vercel.app"),
  openGraph: {
    title: "CareTech Blog",
    description:
      "Simple, helpful tech tutorials and setup guides for phones, tablets, Wi-Fi, and more.",
    url: "https://caretech-blog.vercel.app/blog",
    siteName: "CareTech",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CareTech Blog",
    description:
      "Friendly tech help for seniors — guides for phones, tablets, Wi-Fi, and more.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <link rel="preload" href="/favicon.ico" as="image" />

        <meta name="theme-color" content="#b3c7e6" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
