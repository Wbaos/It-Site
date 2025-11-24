"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type NavContextType = {
  dropdownOpen: boolean;
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;

  open: boolean;   
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;

  notifOpen: boolean; 
  setNotifOpen: React.Dispatch<React.SetStateAction<boolean>>;

  searchOpen: boolean;
  setSearchOpen: React.Dispatch<React.SetStateAction<boolean>>;

  closeAll: () => void;
};

const NavContext = createContext<NavContextType | undefined>(undefined);

export function NavProvider({ children }: { children: ReactNode }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const closeAll = () => {
    setDropdownOpen(false);
    setOpen(false);
    setNotifOpen(false);
    setSearchOpen(false);
  };

  return (
    <NavContext.Provider
      value={{
        dropdownOpen,
        setDropdownOpen,
        open,
        setOpen,
        notifOpen,
        setNotifOpen,
        searchOpen,
        setSearchOpen,
        closeAll,
      }}
    >
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("useNav must be used inside NavProvider");
  return ctx;
}
