"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Bell, Search, Menu, X, LogIn } from "lucide-react";
import { NAV_SERVICES } from "@/lib/serviceCatalog";

const NAV = [
  { href: "/#how", label: "How It Works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false); // mobile
  const [dropdownOpen, setDropdownOpen] = useState(false); // desktop
  const [activeService, setActiveService] = useState<string | null>(null); // subcategories
  const dropdownRef = useRef<HTMLDivElement>(null); // ✅ ref

  // ✅ Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
        setActiveService(null);
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  //  Close mobile menu on resize >900px
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
        {/* Left: nav links / menu button */}
        <div className="left-slot">
          {/* Mobile hamburger */}
          <button
            className="menu-toggle"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Desktop navigation */}
          <nav className="primary-nav" aria-label="Primary">
            <div className="nav-item dropdown" ref={dropdownRef}>
              <a
                href="#"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  setDropdownOpen((v) => !v);
                  setActiveService(null); // reset
                }}
              >
                Services ▾
              </a>

              {dropdownOpen && (
                <div className="dropdown-panel">
                  {!activeService ? (
                    // Show main categories
                    NAV_SERVICES.map((cat, i) => (
                      <div key={i} className="dropdown-category">
                        <h4>{cat.category}</h4>
                        <ul>
                          {cat.items.map((s) => (
                            <li key={s.slug}>
                              {s.subItems ? (
                                <a
                                  href="#"
                                  className="dropdown-link"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setActiveService(s.slug);
                                  }}
                                >
                                  {s.title} ▸
                                </a>
                              ) : (
                                <Link
                                  href={`/services/${s.slug}`}
                                  className="dropdown-link"
                                  onClick={() => setDropdownOpen(false)}
                                >
                                  {s.title}
                                </Link>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  ) : (
                    // 🔹 Show subcategories
                    <div className="dropdown-subpanel">
                      <button
                        className="dropdown-back"
                        onClick={() => setActiveService(null)}
                      >
                        ← Back
                      </button>
                      <ul>
                        {NAV_SERVICES.flatMap((cat) =>
                          cat.items
                            .filter(
                              (s) => s.slug === activeService && s.subItems
                            )
                            .flatMap((s) =>
                              s.subItems!.map((sub) => (
                                <li key={sub.slug}>
                                  <Link
                                    href={`/services/${sub.slug}`}
                                    className="dropdown-sublink"
                                    onClick={() => setDropdownOpen(false)}
                                  >
                                    {sub.title}
                                  </Link>
                                </li>
                              ))
                            )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Other static links */}
            {NAV.map((i) => (
              <a key={i.href} href={i.href} className="nav-link">
                {i.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Center: Brand */}
        <Link href="/" className="brand" aria-label="Home">
          CareTech
        </Link>

        {/* Right: Actions */}
        <div className="actions">
          <button className="icon-btn" aria-label="Search">
            <Search size={18} />
          </button>
          <button className="icon-btn" aria-label="Notifications">
            <Bell size={18} />
          </button>
          <Link href="/login" className="icon-btn" aria-label="Login">
            <LogIn size={18} />
          </Link>
        </div>
      </div>

      {/* Mobile nav stays the same */}
      {open && (
        <nav className="mobile-nav" aria-label="Mobile">
          <div className="site-container-var">
            <details>
              <summary className="mobile-link">Services ▾</summary>
              <div className="mobile-submenu">
                {NAV_SERVICES.map((cat, i) => (
                  <div key={i} className="mobile-category">
                    <h4>{cat.category}</h4>
                    <ul>
                      {cat.items.map((s) => (
                        <li key={s.slug}>
                          <Link
                            href={`/services/${s.slug}`}
                            className="mobile-sublink"
                            onClick={() => setOpen(false)}
                          >
                            {s.title}
                          </Link>
                          {s.subItems && (
                            <ul className="mobile-subsubmenu">
                              {s.subItems.map((sub) => (
                                <li key={sub.slug}>
                                  <Link
                                    href={`/services/${sub.slug}`}
                                    className="mobile-subsublink"
                                    onClick={() => setOpen(false)}
                                  >
                                    {sub.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </details>

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
