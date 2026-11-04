import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalTemplate from "@/components/sections/LegalTemplate";
import { getLegalPage } from "@/lib/sanityLegal";

// Thin route: all copy comes from the Sanity `legalPage` document
// (page: privacy). Structure lives in LegalTemplate.
export async function generateMetadata(): Promise<Metadata> {
  const doc = await getLegalPage("privacy");
  return {
    title: doc?.metaTitle ?? "Privacy Policy | CallTechCare",
    description: doc?.metaDescription ?? "",
    alternates: {
      canonical: "https://www.calltechcare.com/privacy-policy",
    },
    openGraph: {
      title: doc?.metaTitle ?? "Privacy Policy | CallTechCare",
      description: doc?.ogDescription ?? "",
      url: "https://www.calltechcare.com/privacy-policy",
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

export default async function PrivacyPolicyPage() {
  const doc = await getLegalPage("privacy");
  if (!doc) notFound();
  return <LegalTemplate doc={doc} page="privacy" locale="en" />;
}
