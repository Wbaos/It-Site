import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalTemplate from "@/components/sections/LegalTemplate";
import { getLegalPage } from "@/lib/sanityLegal";
import { resolveSiteSettings } from "@/lib/sanitySettings";

// Thin route: all copy comes from the Sanity `legalPage` document
// (page: terms). Structure lives in LegalTemplate.
export async function generateMetadata(): Promise<Metadata> {
  const doc = await getLegalPage("terms");
  return {
    title: doc?.metaTitle ?? "Terms of Service | CallTechCare",
    description: doc?.metaDescription ?? "",
    alternates: {
      canonical: "https://www.calltechcare.com/terms-and-conditions",
    },
    openGraph: {
      title: doc?.metaTitle ?? "Terms of Service | CallTechCare",
      description: doc?.ogDescription ?? "",
      url: "https://www.calltechcare.com/terms-and-conditions",
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

export default async function TermsAndConditionsPage() {
  const doc = await getLegalPage("terms");
  if (!doc) notFound();
  const settings = await resolveSiteSettings();
  return <LegalTemplate doc={doc} page="terms" locale="en" settings={settings} />;
}
