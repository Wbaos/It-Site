import type { Metadata } from "next";
import AboutTemplate from "@/components/sections/AboutTemplate";
import { getAboutPage } from "@/lib/sanityAbout";

// Thin Spanish route: renders the SAME shared about template as the
// English route, with locale="es". No duplicated page copy lives here.
export async function generateMetadata(): Promise<Metadata> {
  const doc = await getAboutPage();
  const title = doc?.metaTitleEs ?? "Sobre CallTechCare | Reparación de Sprinklers en Miami y Broward";
  const description =
    doc?.metaDescriptionEs ??
    "Conoce a CallTechCare, la empresa de reparación de sprinklers e irrigación de Miami y Broward. Servicio el mismo día dentro del horario, inspección gratis y garantía de 1 año en nuestro trabajo.";
  return {
    title,
    description,
    alternates: {
      canonical: "https://www.calltechcare.com/es/sobre-nosotros",
      languages: {
        es: "https://www.calltechcare.com/es/sobre-nosotros",
        en: "https://www.calltechcare.com/about",
        "x-default": "https://www.calltechcare.com/about",
      },
    },
    // Spanish Open Graph / Twitter (audit fix 2026-11-10): without these
    // the page inherited the English layout defaults in WhatsApp/Facebook
    // previews.
    openGraph: {
      title,
      description,
      url: "https://www.calltechcare.com/es/sobre-nosotros",
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
      title,
      description,
    },
  };
}

export default function AboutPageEs() {
  return <AboutTemplate locale="es" />;
}
