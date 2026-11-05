"use client";

import dynamic from "next/dynamic";

import { NavProvider } from "@/lib/NavContext";

// The discount popup only renders after a 6s timer (or from a saved
// minimized/teaser state), so it is split out of the initial bundle and
// loaded after hydration instead of shipping on every first paint. Its
// content, timing and behavior are unchanged.
const DiscountSignupPopup = dynamic(
  () => import("@/components/DiscountSignupPopup"),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NavProvider>
      {children}
      <DiscountSignupPopup />
    </NavProvider>
  );
}
