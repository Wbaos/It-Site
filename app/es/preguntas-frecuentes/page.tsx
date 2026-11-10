import type { Metadata } from "next";
import FaqTemplate from "@/components/sections/FaqTemplate";
import { getFaqPage } from "@/lib/sanityFaq";

// Thin Spanish route: renders the SAME shared FAQ template as the
// English route, with locale="es". No duplicated page copy lives here.
export async function generateMetadata(): Promise<Metadata> {
  const doc = await getFaqPage();
  const title =
    doc?.metaTitleEs ??
    "Preguntas Frecuentes | Reparación de Sprinklers en Miami y Broward | CallTechCare";
  const description =
    doc?.metaDescriptionEs ??
    "Encuentra respuestas a preguntas comunes sobre la reparación de sprinklers e irrigación de CallTechCare en Miami y Broward: costos, servicio el mismo día, fugas, válvulas y temporizadores.";
  return {
    title,
    description,
    alternates: {
      canonical: "https://www.calltechcare.com/es/preguntas-frecuentes",
      languages: {
        es: "https://www.calltechcare.com/es/preguntas-frecuentes",
        en: "https://www.calltechcare.com/faq",
        "x-default": "https://www.calltechcare.com/faq",
      },
    },
    // Spanish Open Graph / Twitter (audit fix 2026-11-10): without these
    // the page inherited the English layout defaults in WhatsApp/Facebook
    // previews.
    openGraph: {
      title,
      description,
      url: "https://www.calltechcare.com/es/preguntas-frecuentes",
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

export default function FAQPageEs() {
  return <FaqTemplate locale="es" />;
}
