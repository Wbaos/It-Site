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
};

// Thin Spanish route: renders the SAME blog index template as the English
// page, with locale="es". No duplicated page copy lives here: structure,
// sections and icons come from the shared template, only the text changes
// (Spanish fields from Sanity, English fallback when empty).
export default function BlogEsPage() {
  return <BlogPage locale="es" />;
}
