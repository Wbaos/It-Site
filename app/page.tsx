import type { Metadata } from "next";

export const dynamic = "force-dynamic";

import { homeSections } from "@/lib/pageSections";

export const metadata: Metadata = {
  title: "Sprinkler Repair Miami & Broward | Same-Day | CallTechCare",
  description:
    "Sprinkler repair and irrigation in Miami and Broward. Same-day service, free estimates, leaks, valves, timers and new systems. Call (786) 366-2729.",
  alternates: {
    canonical: "https://www.calltechcare.com/",
  },
};

export default function Page() {
  return (
    <>
      <main>
        {homeSections.map(({ key, Component, props }) => (
          <Component key={key} {...(props ?? {})} />
        ))}
      </main>
    </>
  );
}
