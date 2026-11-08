import type { Metadata } from "next";

import ContactTemplate from "@/components/sections/ContactTemplate";
import { getContactPage } from "@/lib/sanityContact";
import { resolveSiteSettings, substitutePhonePlaceholders } from "@/lib/sanitySettings";

// Thin Spanish route: renders the SAME shared contact template as the
// English route, with locale="es". No duplicated page copy lives here:
// structure, sections and icons come from ContactTemplate, only the text
// changes.
export async function generateMetadata(): Promise<Metadata> {
  const doc = await getContactPage();
  const settings = await resolveSiteSettings();
  return {
    title: doc?.metaTitleEs ?? "Contacta a CallTechCare | Reparación de Sprinklers Miami y Broward",
    description: doc?.metaDescriptionEs
      ? substitutePhonePlaceholders(doc.metaDescriptionEs, settings)
      : `Contacta a CallTechCare para reparación de sprinklers e irrigación en Miami y Broward. Llama al ${settings.phoneDisplay} o envía un mensaje — respondemos en menos de dos horas.`,
    alternates: {
      canonical: "https://www.calltechcare.com/es/contacto",
      languages: {
        es: "https://www.calltechcare.com/es/contacto",
        en: "https://www.calltechcare.com/contact",
        "x-default": "https://www.calltechcare.com/contact",
      },
    },
  };
}

export default function ContactoPage() {
  return <ContactTemplate locale="es" />;
}
