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
import MobileServicesPanel from "./MobileServicesPanel";
import ServiceGroupList from "./ServiceGroupList";

const NAV = [
  { href: "/assessment", label: "Free Assessment" },
  { href: "/#contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
];

export default function Navbar() {
  const { open, setOpen, notifOpen, dropdownOpen, setDropdownOpen, searchOpen, setSearchOpen, closeAll } = useNav();
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
      <header className="site-header">
        <div className="site-container-var nav-grid">
          {/* BRAND */}
          <Link href="/" className="brand" onClick={closeAll}>
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
                  closeAll();
                } else {
                  setOpen(true);
                }
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
                        setMobileServicesPanel(false);
                        setOpen(false);
                        closeAll();
                        return;
                      }
                      setOpen(true);
                      setMobileServicesPanel(true);
                      return;
                    }
                    // DESKTOP
                    closeAll();
                    setDropdownOpen(true);
                  }}
                >
                  Services ▾
                </a>
                {dropdownOpen && (
                  <div className="dropdown-panel">
                    <div className="dropdown-inner">
                      <h3 className="dropdown-main-title">All Our Services</h3>
                      {loadingServices ? (
                        <p className="loading-text">Loading…</p>
                      ) : activeGroup ? (
                        (() => {
                          const { catIdx, groupIdx } = activeGroup;
                          const group = categories[catIdx]?.groups[groupIdx];
                          if (!group) return null;
                          return (
                            <>
                              <div className="submenu-header">
                                <button
                                  className="back-btn"
                                  onClick={() => setActiveGroup(null)}
                                >
                                  <SvgIcon
                                    name="chevron-left"
                                    size={18}
                                    color="#14b8a6"
                                  />
                                  Back to Groups
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
                                        closeAll();
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
                            <div
                              key={cat.category}
                              className={`dropdown-category col-${(i % 3) + 1}`}
                            >
                              <div className="dropdown-header">
                                {cat.categorySlug ? (
                                  <Link
                                    href={`/services/${cat.categorySlug}`}
                                    className="dropdown-title"
                                    onClick={closeAll}
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
                                {cat.groups?.map((group: any, j: number) => (
                                  <li key={group.slug}>
                                    <a
                                      href="#"
                                      className="dropdown-link"
                                      onClick={e => {
                                        e.preventDefault();
                                        setActiveGroup({ catIdx: i, groupIdx: j });
                                      }}
                                    >
                                      <span className="srv-left">
                                        <span className="dot"></span>
                                        {group.title}
                                      </span>
                                      {group.services && (
                                        <span className="srv-count">
                                          ({group.services.length})
                                        </span>
                                      )}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {/* NAV LINKS */}
              {NAV.map((i) => {
                const isActive = !dropdownOpen && pathname === i.href;
                return (
                  <Link
                    key={i.href}
                    href={i.href}
                    className={`nav-link ${isActive ? "active-nav-link" : ""}`}
                    onClick={closeAll}
                  >
                    {i.label}
                  </Link>
                );
              })}
              {/* GET SUPPORT */}
              <Link
                href="/contact"
                className="support-btn"
                onClick={closeAll}
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
            <div onClick={closeAll}>
              <NotificationDropdown userId={session?.user?.id || "guest"} />
            </div>
            <Link
              href="/cart"
              className="icon-btn cart-btn"
              onClick={closeAll}
            >
              <ShoppingCart size={18} />
              {items?.length > 0 && (
                <span className="cart-count">{items.length}</span>
              )}
            </Link>
            <div onClick={closeAll}>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>
      {searchOpen && (
        <SearchModal onClose={() => {
          closeAll();
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

