import type { Metadata } from "next";

import ContactTemplate from "@/components/sections/ContactTemplate";
import { getContactPage } from "@/lib/sanityContact";

// Thin English route: renders the SAME shared contact template as the
// Spanish route, with locale="en". No duplicated page copy lives here:
// structure, sections and icons come from ContactTemplate, only the text
// changes.
export async function generateMetadata(): Promise<Metadata> {
  const doc = await getContactPage();
  return {
    title: doc?.metaTitle ?? "Contact CallTechCare | Sprinkler Repair Miami & Broward",
    description:
      doc?.metaDescription ??
      "Contact CallTechCare for sprinkler repair and irrigation in Miami and Broward. Call (786) 366-2729 or send a message — we respond within 24 hours.",
    alternates: {
      canonical: "https://www.calltechcare.com/contact",
      languages: {
        es: "https://www.calltechcare.com/es/contacto",
        en: "https://www.calltechcare.com/contact",
        "x-default": "https://www.calltechcare.com/contact",
      },
    },
  };
}

export default function ContactPage() {
  return <ContactTemplate locale="en" />;
}
