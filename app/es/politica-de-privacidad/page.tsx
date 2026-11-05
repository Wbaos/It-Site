import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalTemplate from "@/components/sections/LegalTemplate";
import { getLegalPage } from "@/lib/sanityLegal";
import { resolveSiteSettings } from "@/lib/sanitySettings";

// Thin route: all copy comes from the Sanity `legalPage` document
// (page: privacy). Structure lives in LegalTemplate.
export async function generateMetadata(): Promise<Metadata> {
  const doc = await getLegalPage("privacy");
  return {
    title: doc?.metaTitleEs ?? "Política de Privacidad | CallTechCare",
    description: doc?.metaDescriptionEs ?? "",
    alternates: {
      canonical: "https://www.calltechcare.com/es/politica-de-privacidad",
      languages: {
        es: "https://www.calltechcare.com/es/politica-de-privacidad",
        en: "https://www.calltechcare.com/privacy-policy",
        "x-default": "https://www.calltechcare.com/privacy-policy",
      },
    },
    openGraph: {
      title: doc?.metaTitleEs ?? "Política de Privacidad | CallTechCare",
      description: doc?.ogDescriptionEs ?? "",
      url: "https://www.calltechcare.com/es/politica-de-privacidad",
      siteName: "CallTechCare",
      images: [
        {
          url: "https://www.calltechcare.com/logo-schema.png",
          width: 512,
          height: 512,
        },
      ],
    },
  };
}

export default async function PrivacyPolicyPageEs() {
  const doc = await getLegalPage("privacy");
  if (!doc) notFound();
  const settings = await resolveSiteSettings();
  return <LegalTemplate doc={doc} page="privacy" locale="es" settings={settings} />;
}
