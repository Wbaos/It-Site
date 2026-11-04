"use client";

import { NavProvider } from "@/lib/NavContext";
import DiscountSignupPopup from "@/components/DiscountSignupPopup";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NavProvider>
      {children}
      <DiscountSignupPopup />
    </NavProvider>
  );
}
