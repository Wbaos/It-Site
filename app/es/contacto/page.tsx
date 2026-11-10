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
  const title = doc?.metaTitleEs ?? "Contacta a CallTechCare | Reparación de Sprinklers Miami y Broward";
  const description = doc?.metaDescriptionEs
    ? substitutePhonePlaceholders(doc.metaDescriptionEs, settings)
    : `Contacta a CallTechCare para reparación de sprinklers e irrigación en Miami y Broward. Llama al ${settings.phoneDisplay} o envía un mensaje — respondemos en menos de dos horas.`;
  return {
    title,
    description,
    alternates: {
      canonical: "https://www.calltechcare.com/es/contacto",
      languages: {
        es: "https://www.calltechcare.com/es/contacto",
        en: "https://www.calltechcare.com/contact",
        "x-default": "https://www.calltechcare.com/contact",
      },
    },
    // Spanish Open Graph / Twitter (audit fix 2026-11-10): without these
    // the page inherited the English layout defaults in WhatsApp/Facebook
    // previews.
    openGraph: {
      title,
      description,
      url: "https://www.calltechcare.com/es/contacto",
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

export default function ContactoPage() {
  return <ContactTemplate locale="es" />;
}
