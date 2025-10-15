"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Search, Menu, X, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useNav } from "@/lib/NavContext";
import NotificationDropdown from "@/components/NotificationDropdown";
import UserMenu from "@/components/UserMenu";

const NAV = [
  { href: "/#how", label: "How It Works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const userId = session?.user?.id || "guest";

  const [categories, setCategories] = useState<any[]>([]);
  const [activeService, setActiveService] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { items } = useCart();
  const { open, setOpen, dropdownOpen, setDropdownOpen, notifOpen } = useNav();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/services");
        const data = await res.json();
        const groupedData = Array.isArray(data)
          ? data
          : Object.entries(data).map(([category, items]) => ({
            category,
            items,
          }));
        setCategories(groupedData);
      } catch (err) {
        console.error("Failed to fetch services:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

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
        <div className="left-slot">
          <button
            className="menu-toggle"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <X size={30} strokeWidth={1} />
            ) : (
              <Menu size={30} strokeWidth={1} />
            )}
          </button>

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
                    loading ? (
                      <p className="dropdown-loading">Loading...</p>
                    ) : (
                      <>
                        {categories.map((cat) => (
                          <div
                            key={cat.category}
                            className="dropdown-category"
                          >
                            <h4>{cat.category}</h4>
                            <ul>
                              {cat.items.map((srv: any) => {
                                const slug = srv.slug?.current || srv.slug;
                                const hasSub =
                                  srv.subservices?.length > 0;

                                return (
                                  <li key={srv._id}>
                                    {hasSub ? (
                                      <a
                                        href="#"
                                        className="dropdown-link"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setActiveService(slug);
                                        }}
                                      >
                                        {srv.title} ▸
                                      </a>
                                    ) : (
                                      <Link
                                        href={`/services/${slug}`}
                                        className="dropdown-link"
                                        onClick={() =>
                                          setDropdownOpen(false)
                                        }
                                      >
                                        {srv.title}
                                      </Link>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                      </>
                    )
                  ) : (
                    <div className="dropdown-subpanel">
                      <button
                        className="dropdown-back"
                        onClick={() => setActiveService(null)}
                      >
                        ← Back
                      </button>
                      <ul>
                        {categories
                          .flatMap((c) => c.items)
                          .filter(
                            (s) =>
                              (s.slug?.current || s.slug) === activeService
                          )
                          .flatMap((parent) =>
                            (parent.subservices || []).map((sub: any) => (
                              <li key={sub._id}>
                                <Link
                                  href={`/services/${sub.slug?.current || sub.slug}`}
                                  className="dropdown-sublink"
                                  onClick={() => setDropdownOpen(false)}
                                >
                                  {sub.title}
                                </Link>
                              </li>
                            ))
                          )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {NAV.map((i) => (
              <a key={i.href} href={i.href} className="nav-link">
                {i.label}
              </a>
            ))}
          </nav>
        </div>

        <Link href="/" className="brand" aria-label="Home">
          CareTech
        </Link>

        <div className="actions">
          <button className="icon-btn" aria-label="Search">
            <Search size={18} />
          </button>
          <NotificationDropdown userId={userId} />
          <Link href="/cart" className="icon-btn cart-btn" aria-label="Cart">
            <ShoppingCart size={18} />
            {Array.isArray(items) && items.length > 0 && (
              <span className="cart-count">{items.length}</span>
            )}
          </Link>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
