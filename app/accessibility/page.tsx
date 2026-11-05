import type { Metadata } from "next";
import AccessibilityTemplate from "@/components/sections/AccessibilityTemplate";
import { getAccessibilityPage } from "@/lib/sanityAccessibility";

// Thin route: all copy comes from the Sanity `accessibilityPage`
// document. Structure lives in AccessibilityTemplate.
export async function generateMetadata(): Promise<Metadata> {
  const doc = await getAccessibilityPage();
  return {
    title: doc?.metaTitle ?? "Accessibility Statement – CallTechCare",
    description:
      doc?.metaDescription ??
      "Accessibility Statement for CallTechCare: Learn about our ongoing efforts to ensure digital accessibility for all users visiting our site for sprinkler repair & irrigation services and security cameras in Miami and Broward.",
    alternates: {
      canonical: "https://www.calltechcare.com/accessibility",
    },
  };
}

export default function AccessibilityPage() {
  return <AccessibilityTemplate locale="en" />;
}
