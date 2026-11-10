import type { Metadata } from "next";

export const revalidate = 3600;

import HomeTemplate from "@/components/sections/HomeTemplate";
import { resolveSiteSettings } from "@/lib/sanitySettings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await resolveSiteSettings();
  return {
    title: "CallTechCare | Sprinkler Repair, Irrigation & Security Cameras in Miami & Broward",
    description: `Sprinkler repair and irrigation in Miami and Broward. Same-day service within business hours, free inspection, leaks, valves, timers and new systems. Call ${settings.phoneDisplay}.`,
    alternates: {
      canonical: "https://www.calltechcare.com/",
      languages: {
        en: "https://www.calltechcare.com/",
        es: "https://www.calltechcare.com/es/",
        "x-default": "https://www.calltechcare.com/",
      },
    },
  };
}

export default function Page() {
  return <HomeTemplate locale="en" />;
}
