"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/lib/CartContext";
import { NavProvider } from "@/lib/NavContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        <NavProvider>{children}</NavProvider>
      </CartProvider>
    </SessionProvider>
  );
}
