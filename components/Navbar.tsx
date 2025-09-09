"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Bell, Search, Menu, X, LogIn } from "lucide-react";

const NAV = [
  { href: "#services", label: "Services" },
  { href: "#how", label: "How It Works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900 && open) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open]);

  return (
    <header className="site-header">
      <div className="site-container-var nav-grid">
        {/* Left: links (desktop) / menu button (mobile) */}
        <div className="left-slot">
          <button
            className="menu-toggle"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <nav className="primary-nav" aria-label="Primary">
            {NAV.map((i) => (
              <a key={i.href} href={i.href} className="nav-link">
                {i.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Center: brand */}
        <Link href="#hero" className="brand" aria-label="Home">
          CareTech
        </Link>

        {/* Right: actions */}
        <div className="actions">
          <button className="icon-btn" aria-label="Search">
            <Search size={18} />
          </button>
          <button className="icon-btn" aria-label="Notifications">
            <Bell size={18} />
          </button>
          {/* Login link */}
          <Link href="/login" className="icon-btn" aria-label="Login">
            <LogIn size={18} />
          </Link>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      {open && (
        <nav className="mobile-nav" aria-label="Mobile">
          <div className="site-container-var">
            {NAV.map((i) => (
              <a
                key={i.href}
                href={i.href}
                className="mobile-link"
                onClick={() => setOpen(false)}
              >
                {i.label}
              </a>
            ))}
            {/* Login also available in mobile nav */}
            <Link
              href="/login"
              className="mobile-link"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
