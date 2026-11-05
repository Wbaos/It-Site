import type { Metadata } from "next";
import FaqTemplate from "@/components/sections/FaqTemplate";
import { getFaqPage } from "@/lib/sanityFaq";

// Thin Spanish route: renders the SAME shared FAQ template as the
// English route, with locale="es". No duplicated page copy lives here.
export async function generateMetadata(): Promise<Metadata> {
  const doc = await getFaqPage();
  return {
    title:
      doc?.metaTitleEs ??
      "Preguntas Frecuentes | Reparación de Sprinklers en Miami y Broward | CallTechCare",
    description:
      doc?.metaDescriptionEs ??
      "Encuentra respuestas a preguntas comunes sobre la reparación de sprinklers e irrigación de CallTechCare en Miami y Broward: costos, servicio el mismo día, fugas, válvulas y temporizadores.",
    alternates: {
      canonical: "https://www.calltechcare.com/es/preguntas-frecuentes",
      languages: {
        es: "https://www.calltechcare.com/es/preguntas-frecuentes",
        en: "https://www.calltechcare.com/faq",
      },
    },
  };
}

export default function FAQPageEs() {
  return <FaqTemplate locale="es" />;
}
