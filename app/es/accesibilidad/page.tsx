import type { Metadata } from "next";
import AccessibilityTemplate from "@/components/sections/AccessibilityTemplate";
import { getAccessibilityPage } from "@/lib/sanityAccessibility";

// Thin Spanish route: renders the SAME shared accessibility template as
// the English route, with locale="es". No duplicated page copy lives here.
export async function generateMetadata(): Promise<Metadata> {
  const doc = await getAccessibilityPage();
  const title = doc?.metaTitleEs ?? "Declaración de Accesibilidad – CallTechCare";
  const description =
    doc?.metaDescriptionEs ??
    "Declaración de Accesibilidad de CallTechCare: Conoce nuestros esfuerzos continuos para garantizar la accesibilidad digital de todos los usuarios que visitan nuestro sitio para servicios de reparación de sprinklers e irrigación y cámaras de seguridad en Miami y Broward.";
  return {
    title,
    description,
    alternates: {
      canonical: "https://www.calltechcare.com/es/accesibilidad",
      languages: {
        es: "https://www.calltechcare.com/es/accesibilidad",
        en: "https://www.calltechcare.com/accessibility",
        "x-default": "https://www.calltechcare.com/accessibility",
      },
    },
    // Spanish Open Graph / Twitter (audit fix 2026-11-10): without these
    // the page inherited the English layout defaults in WhatsApp/Facebook
    // previews.
    openGraph: {
      title,
      description,
      url: "https://www.calltechcare.com/es/accesibilidad",
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

export default function AccessibilityPageEs() {
  return <AccessibilityTemplate locale="es" />;
}
