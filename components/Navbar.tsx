"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Search, Menu, X, User, ShoppingCart } from "lucide-react";
import { NAV_SERVICES } from "@/lib/serviceCatalog";
import { useCart } from "@/lib/CartContext";
import { useNav } from "@/lib/NavContext";
import NotificationDropdown from "@/components/NotificationDropdown";

const NAV = [
  { href: "/#how", label: "How It Works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const userId = session?.user?.id || "guest";

  // const [open, setOpen] = useState(false);
  const [activeService, setActiveService] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { items } = useCart();
  const { open, setOpen, dropdownOpen, setDropdownOpen, notifOpen } = useNav();

  // Close dropdown if clicked outside
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
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen, setDropdownOpen]);

  // Close mobile menu on resize >900px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900 && open) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open]);

  useEffect(() => {
    if (open || dropdownOpen || notifOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [open, dropdownOpen, notifOpen]);

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
            {open ? (
              <X size={30} strokeWidth={1} />
            ) : (
              <Menu size={30} strokeWidth={1} />
            )}
          </button>

          {/* Desktop navigation */}
          <nav className="primary-nav" aria-label="Primary">
            <div className="nav-item dropdown" ref={dropdownRef}>
              <a
                href="#"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  setDropdownOpen(!dropdownOpen);
                  setActiveService(null);
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
                    // Show subcategories
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

          {/* Notifications (dynamic by session) */}
          <NotificationDropdown userId={userId} />

          <Link href="/cart" className="icon-btn cart-btn" aria-label="Cart">
            <ShoppingCart size={18} />
            {Array.isArray(items) && items.length > 0 && (
              <span className="cart-count">{items.length}</span>
            )}
          </Link>
          <Link
            href="/login"
            className="icon-btn icon-btn-login"
            aria-label="Login"
          >
            <User size={18} />
          </Link>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="mobile-nav" aria-label="Mobile">
          <div className="site-container-var-dropdown mobile-submenu">
            {NAV_SERVICES.map((cat, i) => (
              <div
                key={i}
                className={`mobile-category ${
                  activeService === cat.category ? "open" : ""
                }`}
              >
                <button
                  className="mobile-category-btn"
                  onClick={() =>
                    setActiveService(
                      activeService === cat.category ? null : cat.category
                    )
                  }
                >
                  {cat.category}
                  <span>{activeService === cat.category ? "−" : "+"}</span>
                </button>

                <ul className="mobile-category-list">
                  {activeService === cat.category &&
                    cat.items.map((s) => (
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

            {NAV.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                className="mobile-link"
                onClick={() => setOpen(false)}
              >
                {i.label}
              </Link>
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
