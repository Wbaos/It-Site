import type { Metadata } from "next";
import AccessibilityTemplate from "@/components/sections/AccessibilityTemplate";
import { getAccessibilityPage } from "@/lib/sanityAccessibility";

// Thin Spanish route: renders the SAME shared accessibility template as
// the English route, with locale="es". No duplicated page copy lives here.
export async function generateMetadata(): Promise<Metadata> {
  const doc = await getAccessibilityPage();
  return {
    title: doc?.metaTitleEs ?? "Declaración de Accesibilidad – CallTechCare",
    description:
      doc?.metaDescriptionEs ??
      "Declaración de Accesibilidad de CallTechCare: Conoce nuestros esfuerzos continuos para garantizar la accesibilidad digital de todos los usuarios que visitan nuestro sitio para servicios de reparación de sprinklers e irrigación y cámaras de seguridad en Miami y Broward.",
    alternates: {
      canonical: "https://www.calltechcare.com/es/accesibilidad",
      languages: {
        es: "https://www.calltechcare.com/es/accesibilidad",
        en: "https://www.calltechcare.com/accessibility",
        "x-default": "https://www.calltechcare.com/accessibility",
      },
    },
  };
}

export default function AccessibilityPageEs() {
  return <AccessibilityTemplate locale="es" />;
}
