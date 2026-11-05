import type { Metadata } from "next";
import FaqTemplate from "@/components/sections/FaqTemplate";
import { getFaqPage } from "@/lib/sanityFaq";

// Thin route: all copy comes from the Sanity `faqPage` document.
// Structure lives in FaqTemplate.
export async function generateMetadata(): Promise<Metadata> {
  const doc = await getFaqPage();
  return {
    title: doc?.metaTitle ?? "FAQ | Sprinkler Repair Miami & Broward | CallTechCare",
    description:
      doc?.metaDescription ??
      "Find answers to common questions about CallTechCare sprinkler repair and irrigation in Miami and Broward: costs, same-day service, leaks, valves, and timers.",
    alternates: {
      canonical: "https://www.calltechcare.com/faq",
      languages: {
        es: "https://www.calltechcare.com/es/preguntas-frecuentes",
        en: "https://www.calltechcare.com/faq",
        "x-default": "https://www.calltechcare.com/faq",
      },
    },
  };
}

export default function FAQPage() {
  return <FaqTemplate locale="en" />;
}
