import type { Metadata } from "next";
import AboutTemplate from "@/components/sections/AboutTemplate";
import { getAboutPage } from "@/lib/sanityAbout";

// Thin Spanish route: renders the SAME shared about template as the
// English route, with locale="es". No duplicated page copy lives here.
export async function generateMetadata(): Promise<Metadata> {
  const doc = await getAboutPage();
  return {
    title: doc?.metaTitleEs ?? "Sobre CallTechCare | Reparación de Sprinklers en Miami y Broward",
    description:
      doc?.metaDescriptionEs ??
      "Conoce a CallTechCare, la empresa de reparación de sprinklers e irrigación de Miami y Broward. Servicio el mismo día dentro del horario, inspección gratis y garantía de 1 año en nuestro trabajo.",
    alternates: {
      canonical: "https://www.calltechcare.com/es/sobre-nosotros",
      languages: {
        es: "https://www.calltechcare.com/es/sobre-nosotros",
        en: "https://www.calltechcare.com/about",
      },
    },
  };
}

export default function AboutPageEs() {
  return <AboutTemplate locale="es" />;
}
