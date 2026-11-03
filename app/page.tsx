import type { Metadata } from "next";

export const dynamic = "force-dynamic";

import HomeTemplate from "@/components/sections/HomeTemplate";

export const metadata: Metadata = {
  title: "Sprinkler Repair Miami & Broward | Same-Day | CallTechCare",
  description:
    "Sprinkler repair and irrigation in Miami and Broward. Same-day service within business hours, free inspection, leaks, valves, timers and new systems. Call (786) 366-2729.",
  alternates: {
    canonical: "https://www.calltechcare.com/",
    languages: {
      en: "https://www.calltechcare.com/",
      es: "https://www.calltechcare.com/es/",
      "x-default": "https://www.calltechcare.com/",
    },
  },
};

export default function Page() {
  return <HomeTemplate locale="en" />;
}
