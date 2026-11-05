import type { Metadata } from "next";
import AboutTemplate from "@/components/sections/AboutTemplate";
import { getAboutPage } from "@/lib/sanityAbout";

// Thin route: all copy comes from the Sanity `aboutPage` document.
// Structure lives in AboutTemplate.
export async function generateMetadata(): Promise<Metadata> {
  const doc = await getAboutPage();
  return {
    title: doc?.metaTitle ?? "About CallTechCare | Sprinkler Repair in Miami & Broward",
    description:
      doc?.metaDescription ??
      "Learn about CallTechCare, Miami and Broward's sprinkler repair and irrigation company. Same-day service within business hours, free inspection, and a 1-year warranty when CallTechCare performs the work and provides the materials.",
    alternates: {
      canonical: "https://www.calltechcare.com/about",
    },
  };
}

export default function AboutPage() {
  return <AboutTemplate locale="en" />;
}
