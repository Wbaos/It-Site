import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalTemplate from "@/components/sections/LegalTemplate";
import { getLegalPage } from "@/lib/sanityLegal";

// Thin route: all copy comes from the Sanity `legalPage` document
// (page: terms). Structure lives in LegalTemplate.
export async function generateMetadata(): Promise<Metadata> {
  const doc = await getLegalPage("terms");
  return {
    title: doc?.metaTitleEs ?? "Términos del Servicio | CallTechCare",
    description: doc?.metaDescriptionEs ?? "",
    alternates: {
      canonical: "https://www.calltechcare.com/es/terminos-y-condiciones",
      languages: {
        es: "https://www.calltechcare.com/es/terminos-y-condiciones",
        en: "https://www.calltechcare.com/terms-and-conditions",
      },
    },
    openGraph: {
      title: doc?.metaTitleEs ?? "Términos del Servicio | CallTechCare",
      description: doc?.ogDescriptionEs ?? "",
      url: "https://www.calltechcare.com/es/terminos-y-condiciones",
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

export default async function TermsAndConditionsPageEs() {
  const doc = await getLegalPage("terms");
  if (!doc) notFound();
  return <LegalTemplate doc={doc} page="terms" locale="es" />;
}
