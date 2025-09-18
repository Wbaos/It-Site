"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type NavContextType = {
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
};

const NavContext = createContext<NavContextType | undefined>(undefined);

export function NavProvider({ children }: { children: ReactNode }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <NavContext.Provider value={{ dropdownOpen, setDropdownOpen }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("useNav must be used inside NavProvider");
  return ctx;
}
