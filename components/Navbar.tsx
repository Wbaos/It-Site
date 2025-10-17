"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Menu,
  X,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useNav } from "@/lib/NavContext";
import NotificationDropdown from "@/components/NotificationDropdown";
import UserMenu from "@/components/UserMenu";
import SearchModal from "@/components/SearchModal";
import { useLoading } from "@/lib/LoadingContext";
import SvgIcon from "@/components/common/SvgIcons";


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
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loadingServices, setLoadingServices] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { items } = useCart();
  const { open, setOpen, dropdownOpen, setDropdownOpen, notifOpen } = useNav();
  const { setLoading } = useLoading();
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Hide loader automatically when route changes
  useEffect(() => {
    setLoading(false);
  }, [pathname, setLoading]);

  // ✅ Fetch categories/services from API
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
        setLoadingServices(false);
      }
    }
    fetchData();
  }, []);

  // ✅ Close dropdown when clicking outside
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

  // ✅ Disable body scroll when overlays open
  useEffect(() => {
    if (open || dropdownOpen || notifOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [open, dropdownOpen, notifOpen]);

  // ✅ Close mobile nav when resizing above breakpoint
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 900 && open) {
        setOpen(false);
        setServicesOpen(false);
        setActiveCategory(null);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [open]);

  // ✅ Ensure search or notifications close mobile nav
  useEffect(() => {
    if (searchOpen || notifOpen) {
      setOpen(false);
      setServicesOpen(false);
      setActiveCategory(null);
    }
  }, [searchOpen, notifOpen]);

  return (
    <>
      <header className="site-header">
        <div className="site-container-var nav-grid">
          {/* LEFT SECTION */}
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
              {/* SERVICES DROPDOWN */}
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
                      loadingServices ? (
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
                                          {srv.title}
                                        </a>
                                      ) : (
                                        <Link
                                          href={`/services/${slug}`}
                                          className="dropdown-link"
                                          onClick={(e) => {
                                            // ✅ Prevent infinite loader if clicking same service
                                            if (pathname === `/services/${slug}`) {
                                              setLoading(true);
                                              setTimeout(() => setLoading(false), 800);
                                            } else {
                                              setLoading(true);
                                            }
                                            setDropdownOpen(false);
                                          }}
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
                        {(() => {
                          const parentInfo = categories
                            .map((cat) => ({
                              categoryName: cat.category,
                              service: cat.items.find(
                                (s: any) => (s.slug?.current || s.slug) === activeService
                              ),
                            }))
                            .find((x) => x.service);

                          const categoryName = parentInfo?.categoryName || "";
                          const parentName = parentInfo?.service?.title || "";

                          return (
                            <div className="dropdown-subpanel">
                              <div className="dropdown-header">
                                {/* Clickable category breadcrumb */}
                                <button className="dropdown-back" onClick={() => setActiveService(null)}>
                                  <SvgIcon name="arrow-back" size={22} className="arrow" />
                                  {categoryName}
                                </button>

                                <span className="breadcrumb-sep">/</span>
                                <span className="dropdown-current">{parentName}</span>
                              </div>

                              {/* Subservices list */}
                              <ul className="dropdown-sublist">
                                {parentInfo?.service?.subservices?.map((sub: any) => (
                                  <li key={sub._id}>
                                    <Link
                                      href={`/services/${sub.slug?.current || sub.slug}`}
                                      className="dropdown-sublink"
                                      onClick={(e) => {
                                        if (
                                          pathname === `/services/${sub.slug?.current || sub.slug}`
                                        ) {
                                          setLoading(true);
                                          setTimeout(() => setLoading(false), 800);
                                        } else {
                                          setLoading(true);
                                        }
                                        setDropdownOpen(false);
                                      }}
                                    >
                                      {sub.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })()}
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

          {/* BRAND */}
          <Link href="/" className="brand" aria-label="Home">
            CareTech
          </Link>

          {/* ACTIONS */}
          <div className="actions">
            <button
              className="icon-btn"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
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

      {/* ✅ MOBILE NAV */}
      {open && (
        <div className="mobile-nav">
          <div className="mobile-category">
            <button
              className="mobile-category-btn"
              onClick={() => setServicesOpen(!servicesOpen)}
            >
              <span>Services</span>
              {servicesOpen ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>

            {servicesOpen && (
              <div className="mobile-sublist-wrapper expanded">
                {categories.map((cat) => {
                  const isOpen = activeCategory === cat.category;
                  return (
                    <div key={cat.category} className="mobile-subcategory">
                      <button
                        className="mobile-subcategory-btn"
                        onClick={() =>
                          setActiveCategory(isOpen ? null : cat.category)
                        }
                      >
                        <span>{cat.category}</span>
                        {isOpen ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>

                      <div
                        className={`mobile-sublist-wrapper ${isOpen ? "expanded" : "collapsed"
                          }`}
                      >
                        <ul className="mobile-sublist">
                          {cat.items.map((srv: any) => {
                            const slug = srv.slug?.current || srv.slug;
                            return (
                              <li key={srv._id}>
                                <Link
                                  href={`/services/${slug}`}
                                  onClick={(e) => {
                                    if (pathname === `/services/${slug}`) {
                                      setLoading(true);
                                      setTimeout(() => setLoading(false), 800);
                                    } else {
                                      setLoading(true);
                                    }
                                    setOpen(false);
                                  }}
                                >
                                  {srv.title}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

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
        </div>
      )}

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}

    </>
  );
}
