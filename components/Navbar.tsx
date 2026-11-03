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
import AnnouncementBar from "@/components/AnnouncementBar";
import MobileServicesPanel from "./MobileServicesPanel";
import ServiceGroupList from "./ServiceGroupList";

const NAV = [
  // { href: "/assessment", label: "Free Assessment" },
  { href: "/#contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
];

// Spanish chrome: labels in Spanish. Links point only to pages that exist
// in this branch: the Spanish home anchors (#services, #how), the Spanish
// contact page, and the English /blog page, which has no Spanish twin yet.
const NAV_ES = [
  { href: "/es/contacto", label: "Contacto" },
  { href: "/blog", label: "Blog" },
];

export default function Navbar() {
  const { open, setOpen, dropdownOpen, setDropdownOpen, searchOpen, setSearchOpen, closeAll } = useNav();
  const router = useRouter();
  const { data: session } = useSession();
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [activeGroup, setActiveGroup] = useState<{catIdx: number, groupIdx: number} | null>(null);
  const pathname = usePathname();
  const { items } = useCart();
  const { setLoading } = useLoading();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [mobileServicesPanel, setMobileServicesPanel] = useState(false);

  // Language switcher: pages with a Spanish twin link to it; every other page
  // falls back to the Spanish hub (never a broken page). Spanish pages link
  // back to their English twin, or to the English home when there is none.
  // Twin pairs: "/" <-> "/es/", "/sprinkler-repair-miami" <->
  // "/es/reparacion-de-sprinklers-miami", and the main service page pair.
  const ES_HUB_HREF = "/es/reparacion-de-sprinklers-miami";
  const EN_TO_ES: Record<string, string> = {
    "/": "/es/",
    "/sprinkler-repair-miami": "/es/reparacion-de-sprinklers-miami",
    "/services/sprinkler-repair-and-installation":
      "/es/reparacion-e-instalacion-de-sprinklers",
    "/contact": "/es/contacto",
    "/request-quote": "/es/solicita-una-cotizacion",
  };
  const ES_TO_EN: Record<string, string> = {
    "/es": "/",
    "/es/": "/",
    "/es/reparacion-de-sprinklers-miami": "/sprinkler-repair-miami",
    "/es/reparacion-e-instalacion-de-sprinklers":
      "/services/sprinkler-repair-and-installation",
    "/es/contacto": "/contact",
    "/es/solicita-una-cotizacion": "/request-quote",
  };
  // "/es" itself (the Spanish home) does not start with "/es/", so check
  // for it explicitly: otherwise the chrome on /es would render in English.
  const isSpanishPage =
    pathname === "/es" || (pathname ?? "").startsWith("/es/");
  const spanishHref = EN_TO_ES[pathname ?? ""] ?? ES_HUB_HREF;
  const englishHref = ES_TO_EN[pathname ?? ""] ?? "/";

  // Shared language pill: solid brand-green background with dark bold text,
  // so it is clearly visible. Hrefs and mappings above are untouched.
  // Rendered in the desktop nav (NavLinks) and, separately, in the header
  // actions for mobile, where it is visible without opening the menu.
  const langSwitcher = (extraClass: string) => (
    <span
      className={`lang-switcher ${extraClass}`}
      aria-label="Language switcher"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "8px 14px",
        background: "#00E793",
        color: "#0f172a",
        borderRadius: "999px",
        fontSize: "14px",
        fontWeight: 700,
        lineHeight: "1",
        whiteSpace: "nowrap",
      }}
    >
      {isSpanishPage ? (
        <>
          <span aria-current="true" style={{ fontWeight: 700 }}>
            ES
          </span>
          <span aria-hidden="true">|</span>
          <Link
            href={englishHref}
            onClick={closeAllMenus}
            aria-label="View this page in English"
            style={{ textDecoration: "none", color: "inherit", opacity: 0.75 }}
          >
            EN
          </Link>
        </>
      ) : (
        <>
          <span aria-current="true" style={{ fontWeight: 700 }}>
            EN
          </span>
          <span aria-hidden="true">|</span>
          <Link
            href={spanishHref}
            onClick={closeAllMenus}
            aria-label="Ver esta página en español"
            style={{ textDecoration: "none", color: "inherit", opacity: 0.75 }}
          >
            ES
          </Link>
        </>
      )}
    </span>
  );

  const NavLinks = ({ attachDropdownRef }: { attachDropdownRef: boolean }) => (
    <>
      <div className="nav-item dropdown" ref={attachDropdownRef ? dropdownRef : undefined}>
        {/* SERVICES BUTTON */}
        <a
          href="#"
          className={`nav-link ${dropdownOpen ? "active-nav-link" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            // MOBILE
            if (typeof window !== "undefined" && window.innerWidth < 900) {
              if (mobileServicesPanel) {
                setMobileServicesPanel(false);
                setOpen(false);
                closeAllMenus();
                return;
              }
              closeAllMenus();
              setOpen(true);
              setMobileServicesPanel(true);
              return;
            }
            // DESKTOP
            closeAllMenus();
            setDropdownOpen(true);
          }}
        >
          {isSpanishPage ? "Servicios ▾" : "Services ▾"}
        </a>
        {dropdownOpen && (
          <div className="dropdown-panel">
            <div className="dropdown-inner">
              <h3 className="dropdown-main-title">{isSpanishPage ? "Todos Nuestros Servicios" : "All Our Services"}</h3>
              {loadingServices ? (
                <p className="loading-text">{isSpanishPage ? "Cargando…" : "Loading…"}</p>
              ) : activeGroup ? (
                (() => {
                  const { catIdx, groupIdx } = activeGroup;
                  const group = categories[catIdx]?.groups[groupIdx];
                  if (!group) return null;
                  return (
                    <>
                      <div className="submenu-header">
                        <button className="back-btn" onClick={() => setActiveGroup(null)}>
                          <SvgIcon name="chevron-left" size={18} color="var(--brand-teal)" />
                          {isSpanishPage ? "Volver a Todos los Servicios" : "Back to All Services"}
                        </button>
                        <h4 className="submenu-title">{group.title}</h4>
                      </div>
                      <div className="submenu-body">
                        <div className="submenu-columns">
                          <div className="submenu-left-column">
                            <ServiceGroupList
                              title={group.title}
                              items={group.services}
                              onSelect={(srv) => {
                                closeAllMenus();
                                if (srv?.slug) router.push(`/services/${srv.slug}`);
                              }}
                            />
                          </div>
                          {group.promo?.enabled && (
                            <div className="submenu-right-column">
                              <div className="promo-card">
                                {group.promo.icon?.asset?.url && (
                                  <div className="promo-icon">
                                    <img
                                      src={group.promo.icon.asset.url}
                                      alt={group.promo.icon.alt || "promo icon"}
                                    />
                                  </div>
                                )}
                                <h3 className="promo-title">{group.promo.title}</h3>
                                <p className="promo-subtitle">{group.promo.subtitle}</p>
                                <ul className="promo-list">
                                  {group.promo.items?.map((item: string, i: number) => (
                                    <li key={i}>{item}</li>
                                  ))}
                                </ul>
                                {group.promo.buttonText && (
                                  <button className="promo-btn">{group.promo.buttonText}</button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  );
                })()
              ) : (
                <>
                  {categories.map((cat, i) => (
                    <div key={cat.category} className={`dropdown-category col-${(i % 3) + 1}`}>
                      <div className="dropdown-header">
                        {cat.categorySlug ? (
                          <Link
                            href={`/services/${cat.categorySlug}`}
                            className="dropdown-title"
                            onClick={closeAllMenus}
                            style={{
                              textDecoration: "none",
                              color: "inherit",
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                          >
                            {cat.icon?.url ? (
                              <img src={cat.icon.url} alt={cat.icon.alt || cat.category} width={22} height={22} />
                            ) : (
                              <SvgIcon name="tag" size={22} />
                            )}
                            <h4 style={{ marginLeft: 8 }}>{cat.category}</h4>
                          </Link>
                        ) : (
                          <div
                            className="dropdown-title"
                            style={{ display: "flex", alignItems: "center", opacity: 0.5 }}
                          >
                            {cat.icon?.url ? (
                              <img src={cat.icon.url} alt={cat.icon.alt || cat.category} width={22} height={22} />
                            ) : (
                              <SvgIcon name="tag" size={22} />
                            )}
                            <h4 style={{ marginLeft: 8 }}>{cat.category}</h4>
                          </div>
                        )}
                      </div>
                      <ul>
                        {cat.groups?.map((group: any, j: number) => (
                          <li key={group.slug}>
                            <a
                              href="#"
                              className="dropdown-link"
                              onClick={(e) => {
                                e.preventDefault();
                                setActiveGroup({ catIdx: i, groupIdx: j });
                              }}
                            >
                              <span className="srv-left">
                                <span className="dot"></span>
                                {group.title}
                              </span>
                              {group.services && <span className="srv-count">({group.services.length})</span>}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </>
              )}
            </div>
            <div className="custom-service-box-separator-wrapper">
              <hr className="custom-service-box-separator" />
              <div className="custom-service-box">
                <div className="custom-service-icon">
                  <span role="img" aria-label="chat">
                    💬
                  </span>
                </div>
                <h2 className="custom-service-title">{isSpanishPage ? "¿Necesitas Algo Personalizado?" : "Need Something Custom?"}</h2>
                <p className="custom-service-desc">
                  {isSpanishPage
                    ? "¿No encuentras lo que buscas? Ofrecemos servicios personalizados según tus necesidades específicas."
                    : "Can't find what you're looking for? We offer customized services tailored to your specific needs."}
                </p>
                <a href={isSpanishPage ? "/es/contacto" : "/contact"} className="custom-service-btn-grey">
                  {isSpanishPage ? "Contáctanos para Servicios Personalizados" : "Contact Us for Custom Services"}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* NAV LINKS */}
      {(isSpanishPage ? NAV_ES : NAV).map((i) => {
        const isActive = !dropdownOpen && pathname === i.href;
        return (
          <Link
            key={i.href}
            href={i.href}
            className={`nav-link ${isActive ? "active-nav-link" : ""}`}
            onClick={closeAllMenus}
          >
            {i.label}
          </Link>
        );
      })}

      {/* GET SUPPORT */}
      <Link href={isSpanishPage ? "/es/contacto" : "/contact"} className="support-btn" onClick={closeAllMenus}>
        {isSpanishPage ? "Obtener Soporte" : "Get Support"}
      </Link>

      {/* LANGUAGE SWITCHER (desktop nav only: attachDropdownRef is true for
          the desktop render; mobile uses the header-actions pill so it is
          visible without opening the menu). */}
      {attachDropdownRef && langSwitcher("lang-switcher--in-nav")}
    </>
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 900) return;
    if (searchOpen) return;

    const shouldLock = open || mobileServicesPanel;
    if (!shouldLock) return;

    const scrollY = window.scrollY;
    const { style } = document.body;
    const prev = {
      position: style.position,
      top: style.top,
      left: style.left,
      right: style.right,
      width: style.width,
    };

    document.body.classList.add("no-scroll");
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.left = "0";
    style.right = "0";
    style.width = "100%";

    return () => {
      document.body.classList.remove("no-scroll");
      style.position = prev.position;
      style.top = prev.top;
      style.left = prev.left;
      style.right = prev.right;
      style.width = prev.width;
      window.scrollTo(0, scrollY);
    };
  }, [open, mobileServicesPanel, searchOpen]);

  const closeAllMenus = () => {
    closeAll();
    setMobileServicesPanel(false);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownOpen && dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setActiveGroup(null);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

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

  return (
    <>
      <AnnouncementBar />
      <header className="site-header">
        <div className="site-container-var nav-grid">
          {/* BRAND: stays in the current language (Spanish home when in Spanish mode) */}
          <Link href={isSpanishPage ? "/es/" : "/"} className="brand" onClick={closeAllMenus}>
            <div className="logo-wrapper">
              <SvgIcon name="calltechcare-logoName" color="#fff" size={180} className="logo-desktop" />
              <SvgIcon name="calltechcare-logoMobile" color="#fff" size={100} className="logo-mobile" />
            </div>
          </Link>
          <div className="left-slot">
            <button
              className="menu-toggle"
              onClick={() => {
                if (open) {
                  setMobileServicesPanel(false);
                  setOpen(false);
                  closeAllMenus();
                } else {
                  closeAllMenus();
                  setOpen(true);
                }
              }}
            >
              {open ? <X size={30} /> : <Menu size={30} />}
            </button>
            {/* NAV */}
            <nav className="primary-nav primary-nav--desktop">
              <NavLinks attachDropdownRef={true} />
            </nav>
          </div>
          {/* RIGHT ACTIONS */}
          <div className="actions">
            {/* LANGUAGE SWITCHER, mobile only (see .mobile-only): visible
                without opening the menu. */}
            {langSwitcher("mobile-only lang-switcher--header-actions")}
            <button
              className="icon-btn"
              aria-label={isSpanishPage ? "Buscar" : "Search"}
              onClick={(e) => {
                e.stopPropagation();
                if (searchOpen) {
                  setSearchOpen(false);
                  closeAllMenus();
                  return;
                }
                closeAllMenus();
                setSearchOpen(true);
              }}
            >
              <Search size={18} />
            </button>
            <NotificationDropdown
              userId={session?.user?.id || "guest"}
              onOpen={closeAllMenus}
            />
            <Link
              href="/cart"
              className="icon-btn cart-btn"
              onClick={closeAllMenus}
            >
              <ShoppingCart size={18} />
              {items?.length > 0 && (
                <span className="cart-count">{items.length}</span>
              )}
            </Link>
            <div onClick={closeAllMenus}>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav must be outside the blurred fixed header (iOS/WebKit fix) */}
      {open && (
        <nav className={`primary-nav primary-nav--mobile ${open ? "open" : ""}`}>
          <NavLinks attachDropdownRef={false} />
        </nav>
      )}

      {searchOpen && (
        <SearchModal onClose={() => {
          closeAllMenus();
          setSearchOpen(false);
        }} />
      )}
      {mobileServicesPanel && (
        <MobileServicesPanel
          categories={categories}
          onClose={() => {
            setMobileServicesPanel(false);
            setOpen(false);
          }}
        />
      )}
    </>
  );
}

