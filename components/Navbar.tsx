"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X, ShoppingCart } from "lucide-react";

import { useCart } from "@/lib/CartContext";
import { useNav } from "@/lib/NavContext";
import { useLoading } from "@/lib/LoadingContext";

import NotificationDropdown from "@/components/NotificationDropdown";
import UserMenu from "@/components/UserMenu";
import SearchModal from "@/components/SearchModal";
import SvgIcon from "@/components/common/SvgIcons";
import ServiceGroupList from "./ServiceGroupList";
import MobileServicesPanel from "./MobileServicesPanel";

/* TYPES */
type PromoBox = {
  enabled?: boolean;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  items?: string[];
  icon?: {
    asset?: { url: string };
    alt?: string;
  };
};

type ActiveServiceType = {
  title: string;
  subservices: any[];
  slug?: string;
  promo?: PromoBox;
};

const NAV = [
  { href: "/assessment", label: "Free Assessment" },
  { href: "/#contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
];

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id || "guest";
  const pathname = usePathname();
  const { items } = useCart();
  const { setLoading } = useLoading();

  const { open, setOpen, notifOpen, dropdownOpen, setDropdownOpen } = useNav();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [categories, setCategories] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const { searchOpen, setSearchOpen, closeAll } = useNav();

  const [activeService, setActiveService] =
    useState<ActiveServiceType | null>(null);

  const [mobileServicesPanel, setMobileServicesPanel] = useState(false);

  useEffect(() => setLoading(false), [pathname, setLoading]);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch("/api/services");
        const data = await res.json();
        setCategories(data);
      } catch {
        console.error("SERVICES FETCH ERROR");
      } finally {
        setLoadingServices(false);
      }
    }
    fetchServices();
  }, []);

  useEffect(() => {
    function clickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setActiveService(null);
      }
    }

    if (dropdownOpen) document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
    }, [dropdownOpen]);

    useEffect(() => {
      if (typeof window !== "undefined") {
        const isMobile = window.innerWidth <= 900;

        if (isMobile && (open || notifOpen || mobileServicesPanel || searchOpen)) {
          document.body.classList.add("no-scroll");
        } else {
          document.body.classList.remove("no-scroll");
        }
      }
    }, [open, notifOpen, mobileServicesPanel, searchOpen]);



  function closeEverything() {
    setOpen(false);
    setDropdownOpen(false);
    setMobileServicesPanel(false);
    setActiveService(null);
    document.body.classList.remove("no-scroll");
  }

  return (
    <>
      <header className="site-header">
        <div className="site-container-var nav-grid">        

          {/* BRAND */}
          <Link href="/" className="brand" onClick={closeEverything}>
            <div className="logo-wrapper">
              <SvgIcon name="calltechcare-logoName" color="#fff" size={180} className="logo-desktop" />

              <SvgIcon name="calltechcare-logoMobile" color="#fff" size={100} className="logo-mobile" />
            </div>

          </Link>

            <div className="left-slot">
            <button
              className="menu-toggle"
              onClick={() => {
                if (open) closeEverything();
                else closeEverything(), setOpen(true);
              }}
            >
              {open ? <X size={30} /> : <Menu size={30} />}
            </button>

            {/* NAV */}
            <nav className={`primary-nav ${open ? "open" : ""}`}>
              <div className="nav-item dropdown" ref={dropdownRef}>
                {/* SERVICES BUTTON */}
                <a
                  href="#"
                  className={`nav-link ${dropdownOpen ? "active-nav-link" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();

                    // MOBILE
                    if (window.innerWidth < 900) {
                      if (mobileServicesPanel) {
                        closeEverything();
                        return;
                      }
                      closeEverything();
                      setMobileServicesPanel(true);
                      return;
                    }

                    // DESKTOP
                    closeEverything();
                    setDropdownOpen(true);
                  }}
                >
                  Services ▾
                </a>

                {dropdownOpen && (
                  <div className="dropdown-panel">
                    <div
                      className={`dropdown-inner ${
                        activeService ? "two-col" : ""
                      }`}
                    >
                      {!activeService && (
                        <h3 className="dropdown-main-title">
                          All Our Services
                        </h3>
                      )}

                      {loadingServices ? (
                        <p className="loading-text">Loading…</p>
                      ) : activeService ? (
                        <>
                          <div className="submenu-header">
                            <button
                              className="back-btn"
                              onClick={() => setActiveService(null)}
                            >
                              <SvgIcon
                                name="chevron-left"
                                size={18}
                                color="#14b8a6"
                              />
                              Back to Services
                            </button>

                            <h4 className="submenu-title">
                              {activeService.title}
                            </h4>
                          </div>

                          <div className="submenu-body">
                            <div className="submenu-columns">
                              <div className="submenu-left-column">
                                {(() => {
                                  const installSubs =
                                    activeService.subservices.filter(
                                      (s) => s.serviceType === "installation"
                                    );
                                  const supportSubs =
                                    activeService.subservices.filter(
                                      (s) => s.serviceType === "support"
                                    );

                                  return (
                                    <>
                                      {installSubs.length > 0 && (
                                        <ServiceGroupList
                                          title="Installation & Setup"
                                          items={installSubs}
                                          onSelect={closeEverything}
                                        />
                                      )}

                                      {supportSubs.length > 0 && (
                                        <ServiceGroupList
                                          title="Support"
                                          items={supportSubs}
                                          onSelect={closeEverything}
                                        />
                                      )}
                                    </>
                                  );
                                })()}
                              </div>

                              <div className="submenu-right-column">
                                {activeService.promo?.enabled && (
                                  <div className="promo-card">
                                    {activeService.promo.icon?.asset?.url && (
                                      <div className="promo-icon">
                                        <img
                                          src={
                                            activeService.promo.icon.asset.url
                                          }
                                          alt={
                                            activeService.promo.icon.alt ||
                                            "promo icon"
                                          }
                                        />
                                      </div>
                                    )}

                                    <h3 className="promo-title">
                                      {activeService.promo.title}
                                    </h3>

                                    <p className="promo-subtitle">
                                      {activeService.promo.subtitle}
                                    </p>

                                    <ul className="promo-list">
                                      {activeService.promo.items?.map(
                                        (item, i) => <li key={i}>{item}</li>
                                      )}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        categories.map((cat, i) => (
                          <div
                            key={cat.category}
                            className={`dropdown-category col-${(i % 3) + 1}`}
                          >
                            <div className="dropdown-header">
                              {cat.categorySlug ? (
                                <Link
                                  href={`/services/${cat.categorySlug}`}
                                  className="dropdown-title"
                                  onClick={closeEverything}
                                  style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                >
                                  {cat.icon?.url ? (
                                    <img
                                      src={cat.icon.url}
                                      alt={cat.icon.alt || cat.category}
                                      width={22}
                                      height={22}
                                    />
                                  ) : (
                                    <SvgIcon name="tag" size={22} />
                                  )}
                                  <h4 style={{ marginLeft: 8 }}>{cat.category}</h4>
                                </Link>
                              ) : (
                                <div className="dropdown-title" style={{ display: 'flex', alignItems: 'center', opacity: 0.5 }}>
                                  {cat.icon?.url ? (
                                    <img
                                      src={cat.icon.url}
                                      alt={cat.icon.alt || cat.category}
                                      width={22}
                                      height={22}
                                    />
                                  ) : (
                                    <SvgIcon name="tag" size={22} />
                                  )}
                                  <h4 style={{ marginLeft: 8 }}>{cat.category}</h4>
                                </div>
                              )}
                            </div>

                            <ul>
                              {cat.items?.map((srv: any) => {
                                const hasSubs =
                                  srv.subservices?.length > 0;

                                return (
                                  <li key={srv.slug}>
                                    <a
                                      href="#"
                                      className="dropdown-link"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        if (hasSubs) {
                                          setActiveService({
                                            title: srv.title,
                                            subservices: srv.subservices,
                                            slug: srv.slug,
                                            promo: srv.promo || null,
                                          });
                                        } else {
                                          closeEverything();
                                          router.push(`/services/${srv.slug}`);
                                        }
                                      }}
                                    >
                                      <span className="srv-left">
                                        <span className="dot"></span>
                                        {srv.title}
                                      </span>

                                      {hasSubs && (
                                        <span className="srv-count">
                                          ({srv.subservices.length})
                                        </span>
                                      )}
                                    </a>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* NAV LINKS */}
              {NAV.map((i) => {
                const isActive =
                  !dropdownOpen && pathname === i.href; 

                return (
                  <Link
                    key={i.href}
                    href={i.href}
                    className={`nav-link ${isActive ? "active-nav-link" : ""}`}
                    onClick={closeEverything}
                  >
                    {i.label}
                  </Link>
                );
              })}

              {/* GET SUPPORT */}
              <Link
                href="/contact"
                className="support-btn"
                onClick={closeEverything}
              >
                Get Support
              </Link>
            </nav>
          </div>

          {/* RIGHT ACTIONS */}
          <div className="actions">
            <button
              className="icon-btn"
              aria-label="Search"
              onClick={(e) => {
                e.stopPropagation();

                if (searchOpen) {
                  setSearchOpen(false);
                  return;
                }

                closeAll();
                setSearchOpen(true);
              }}
            >
              <Search size={18} />
            </button>

            <div onClick={closeEverything}>
              <NotificationDropdown userId={userId} />
            </div>

            <Link
              href="/cart"
              className="icon-btn cart-btn"
              onClick={closeEverything}
            >
              <ShoppingCart size={18} />
              {items?.length > 0 && (
                <span className="cart-count">{items.length}</span>
              )}
            </Link>

            <div onClick={closeEverything}>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {searchOpen && (
        <SearchModal onClose={() => {
          closeEverything();
          setSearchOpen(false);
        }} />
      )}

      {mobileServicesPanel && (
        <MobileServicesPanel
          categories={categories}
          onClose={closeEverything}
        />
      )}
    </>
  );
}
