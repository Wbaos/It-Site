import type { Metadata } from "next";
import BlogPage from "@/app/blog/page";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Guías de Reparación de Sprinklers y Cámaras | Blog CallTechCare",
  description: "Guías útiles sobre reparación de sprinklers, riego, cámaras de seguridad y mantenimiento para propietarios en Miami y el sur de Florida.",
  alternates: {
    types: {
      "application/rss+xml": "https://www.calltechcare.com/es/blog/rss.xml",
    },
    canonical: "https://www.calltechcare.com/es/blog",
    languages: {
      es: "https://www.calltechcare.com/es/blog",
      en: "https://www.calltechcare.com/blog",
      "x-default": "https://www.calltechcare.com/blog",
    },
  },
  // Spanish Open Graph / Twitter (audit fix 2026-11-10): without these
  // the page inherited the English layout defaults in WhatsApp/Facebook
  // previews.
  openGraph: {
    title: "Guías de Reparación de Sprinklers y Cámaras | Blog CallTechCare",
    description: "Guías útiles sobre reparación de sprinklers, riego, cámaras de seguridad y mantenimiento para propietarios en Miami y el sur de Florida.",
    url: "https://www.calltechcare.com/es/blog",
    siteName: "CallTechCare",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "https://www.calltechcare.com/logo-schema.png",
        width: 512,
        height: 512,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Guías de Reparación de Sprinklers y Cámaras | Blog CallTechCare",
    description: "Guías útiles sobre reparación de sprinklers, riego, cámaras de seguridad y mantenimiento para propietarios en Miami y el sur de Florida.",
  },
};

// Thin Spanish route: renders the SAME blog index template as the English
// page, with locale="es". No duplicated page copy lives here: structure,
// sections and icons come from the shared template, only the text changes
// (Spanish fields from Sanity, English fallback when empty).
export default function BlogEsPage() {
  return <BlogPage locale="es" />;
}
