"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { useNav } from "@/lib/NavContext";
import { useLoading } from "@/lib/LoadingContext";
import SearchModal from "@/components/SearchModal";
import SvgIcon from "@/components/common/SvgIcons";
import AnnouncementBar from "@/components/AnnouncementBar";
import MobileServicesPanel from "./MobileServicesPanel";
import ServiceGroupList from "./ServiceGroupList";
import { groupTitleEs } from "@/lib/groupTitlesEs";
import { serviceHref } from "@/lib/serviceTwins";
import { FALLBACK_SETTINGS } from "@/lib/sanitySettings";

const NAV = [
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
];

// Spanish chrome: labels in Spanish. Links point only to pages that exist
// in this branch: the Spanish home anchors (#services, #how), the Spanish
// contact page, and the Spanish blog page.
const NAV_ES = [
  { href: "/es/contacto", label: "Contacto" },
  { href: "/es/blog", label: "Blog" },
];

export default function Navbar({
  phoneTel = FALLBACK_SETTINGS.phoneTel,
  phoneDisplay = FALLBACK_SETTINGS.phoneDisplay,
}: {
  phoneTel?: string;
  phoneDisplay?: string;
}) {
  const { open, setOpen, dropdownOpen, setDropdownOpen, searchOpen, setSearchOpen, closeAll } = useNav();
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [activeGroup, setActiveGroup] = useState<{catIdx: number, groupIdx: number} | null>(null);
  const pathname = usePathname();
  const { setLoading } = useLoading();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [mobileServicesPanel, setMobileServicesPanel] = useState(false);

  // Language switcher: pages with a Spanish twin link to it; every other page
  // falls back to the Spanish home (never a broken page, and never a
  // specific service page that would mislead). Spanish pages link
  // back to their English twin, or to the English home when there is none.
  // Twin pairs: "/" <-> "/es/", the thirty city page pairs
  // ("/sprinkler-repair-{city}" <-> "/es/reparacion-de-sprinklers-{city}",
  // hub Miami included), the services hub pair ("/services" <->
  // "/es/servicios"), the eleven service page pairs (plus the two
  // group pages), the ten blog pairs ("/blog" <-> "/es/blog" and nine posts),
  // "/contact" <-> "/es/contacto".
  const ES_HUB_HREF = "/es/";
  const EN_TO_ES: Record<string, string> = {
    "/": "/es/",
    "/sprinkler-repair-sunrise": "/es/reparacion-de-sprinklers-sunrise",
    "/sprinkler-repair-fort-lauderdale": "/es/reparacion-de-sprinklers-fort-lauderdale",
    "/sprinkler-repair-dania-beach": "/es/reparacion-de-sprinklers-dania-beach",
    "/sprinkler-repair-weston": "/es/reparacion-de-sprinklers-weston",
    "/sprinkler-repair-davie": "/es/reparacion-de-sprinklers-davie",
    "/sprinkler-repair-southwest-ranches": "/es/reparacion-de-sprinklers-southwest-ranches",
    "/sprinkler-repair-hollywood": "/es/reparacion-de-sprinklers-hollywood",
    "/sprinkler-repair-west-park": "/es/reparacion-de-sprinklers-west-park",
    "/sprinkler-repair-pembroke-pines": "/es/reparacion-de-sprinklers-pembroke-pines",
    "/sprinkler-repair-miramar": "/es/reparacion-de-sprinklers-miramar",
    "/sprinkler-repair-miami-gardens": "/es/reparacion-de-sprinklers-miami-gardens",
    "/sprinkler-repair-miami-lakes": "/es/reparacion-de-sprinklers-miami-lakes",
    "/sprinkler-repair-country-club": "/es/reparacion-de-sprinklers-country-club",
    "/sprinkler-repair-aventura": "/es/reparacion-de-sprinklers-aventura",
    "/sprinkler-repair-sunny-isles-beach": "/es/reparacion-de-sprinklers-sunny-isles-beach",
    "/sprinkler-repair-north-miami": "/es/reparacion-de-sprinklers-north-miami",
    "/sprinkler-repair-surfside": "/es/reparacion-de-sprinklers-surfside",
    "/sprinkler-repair-north-bay-village": "/es/reparacion-de-sprinklers-north-bay-village",
    "/sprinkler-repair-miami-beach": "/es/reparacion-de-sprinklers-miami-beach",
    "/sprinkler-repair-hialeah": "/es/reparacion-de-sprinklers-hialeah",
    "/sprinkler-repair-doral": "/es/reparacion-de-sprinklers-doral",
    "/sprinkler-repair-fontainebleau": "/es/reparacion-de-sprinklers-fontainebleau",
    "/sprinkler-repair-tamiami": "/es/reparacion-de-sprinklers-tamiami",
    "/sprinkler-repair-miami": "/es/reparacion-de-sprinklers-miami",
    "/sprinkler-repair-coral-gables": "/es/reparacion-de-sprinklers-coral-gables",
    "/sprinkler-repair-key-biscayne": "/es/reparacion-de-sprinklers-key-biscayne",
    "/sprinkler-repair-kendall": "/es/reparacion-de-sprinklers-kendall",
    "/sprinkler-repair-kendale-lakes": "/es/reparacion-de-sprinklers-kendale-lakes",
    "/sprinkler-repair-country-walk": "/es/reparacion-de-sprinklers-country-walk",
    "/sprinkler-repair-cutler-bay": "/es/reparacion-de-sprinklers-cutler-bay",
    "/services/sprinkler-repair-and-installation":
      "/es/reparacion-e-instalacion-de-sprinklers",
    "/services/sprinkler-leak-repair":
      "/es/reparacion-de-fugas-de-sprinklers",
    "/services/sprinkler-valve-repair":
      "/es/reparacion-de-valvulas-de-sprinklers",
    "/services/sprinkler-pump-replacement":
      "/es/reemplazo-de-bombas-de-sprinklers",
    "/services/sprinkler-timer-installation":
      "/es/instalacion-de-temporizadores-de-sprinklers",
    "/services/wifi-sprinkler-controller-upgrade":
      "/es/actualizacion-a-controlador-wifi-de-sprinklers",
    "/services/rain-sensor-installation":
      "/es/instalacion-de-sensores-de-lluvia",
    "/services/new-irrigation-installation":
      "/es/instalacion-nueva-de-irrigacion",
    "/services/wireless-camera-installation":
      "/es/instalacion-de-camaras-inalambricas",
    "/services/sprinkler-maintenance-plan":
      "/es/plan-de-mantenimiento-de-sprinklers",
    "/services/emergency-sprinkler-repair":
      "/es/reparacion-de-emergencia-de-sprinklers",
    "/services/commercial-irrigation-hoa-services":
      "/es/riego-comercial-y-para-hoa",
    "/services/new-irrigation-well-installation":
      "/es/instalacion-de-pozos-nuevos-de-irrigacion",
    "/services/landscaping":
      "/es/reparacion-de-sprinklers-e-irrigacion",
    "/services/home-security":
      "/es/seguridad-del-hogar",
    "/blog": "/es/blog",
    "/blog/wireless-camera-installation-secure-your-home-or-business":
      "/es/blog/instalacion-de-camaras-inalambricas-para-tu-hogar-o-negocio",
    "/blog/how-to-choose-and-install-the-right-video-doorbell-for-your-home-or-small-business":
      "/es/blog/como-elegir-e-instalar-el-videoportero-adecuado-para-tu-hogar-o-pequeno-negocio",
    "/blog/sprinkler-repair-and-installation-in-miami-2026-guide":
      "/es/blog/reparacion-e-instalacion-de-sprinklers-en-miami-guia-2026",
    "/blog/how-often-should-you-run-your-sprinkler-system-in-miami-watering-guide-2026":
      "/es/blog/cada-cuanto-hacer-funcionar-tus-sprinklers-en-miami-guia-de-riego-2026",
    "/blog/security-camera-installation-near-me-miami":
      "/es/blog/instalacion-de-camaras-de-seguridad-cerca-de-mi-en-miami",
    "/blog/sprinkler-repair-near-me-in-miami-fix-your-irrigation-system-fast":
      "/es/blog/reparacion-de-sprinklers-cerca-de-mi-en-miami-arregla-tu-riego-rapido",
    "/blog/sprinkler-system-not-working-miami":
      "/es/blog/sistema-de-sprinklers-no-funciona-en-miami",
    "/blog/why-upgrade-from-an-intermatic-timer-to-a-smart-irrigation-controller-miami-guide-2026":
      "/es/blog/por-que-cambiar-de-un-temporizador-intermatic-a-un-controlador-inteligente-guia-miami-2026",
    "/blog/prepare-sprinkler-system-dry-season-miami":
      "/es/blog/prepara-tu-sistema-de-sprinklers-para-la-temporada-seca-en-miami",
    "/blog/smart-sprinkler-controllers-miami-wifi-timers":
      "/es/blog/controladores-inteligentes-de-sprinklers-en-miami-timers-wifi",
    "/contact": "/es/contacto",
    "/services": "/es/servicios",
    "/about": "/es/sobre-nosotros",
    "/locations": "/es/areas-de-servicio",
    "/locations/miami": "/es/areas-de-servicio/miami",
    "/locations/fort-lauderdale": "/es/areas-de-servicio/fort-lauderdale",
    "/privacy-policy": "/es/politica-de-privacidad",
    "/terms-and-conditions": "/es/terminos-y-condiciones",
    "/accessibility": "/es/accesibilidad",
    "/faq": "/es/preguntas-frecuentes",
  };
  const ES_TO_EN: Record<string, string> = {
    "/es": "/",
    "/es/": "/",
    "/es/reparacion-de-sprinklers-sunrise": "/sprinkler-repair-sunrise",
    "/es/reparacion-de-sprinklers-fort-lauderdale": "/sprinkler-repair-fort-lauderdale",
    "/es/reparacion-de-sprinklers-dania-beach": "/sprinkler-repair-dania-beach",
    "/es/reparacion-de-sprinklers-weston": "/sprinkler-repair-weston",
    "/es/reparacion-de-sprinklers-davie": "/sprinkler-repair-davie",
    "/es/reparacion-de-sprinklers-southwest-ranches": "/sprinkler-repair-southwest-ranches",
    "/es/reparacion-de-sprinklers-hollywood": "/sprinkler-repair-hollywood",
    "/es/reparacion-de-sprinklers-west-park": "/sprinkler-repair-west-park",
    "/es/reparacion-de-sprinklers-pembroke-pines": "/sprinkler-repair-pembroke-pines",
    "/es/reparacion-de-sprinklers-miramar": "/sprinkler-repair-miramar",
    "/es/reparacion-de-sprinklers-miami-gardens": "/sprinkler-repair-miami-gardens",
    "/es/reparacion-de-sprinklers-miami-lakes": "/sprinkler-repair-miami-lakes",
    "/es/reparacion-de-sprinklers-country-club": "/sprinkler-repair-country-club",
    "/es/reparacion-de-sprinklers-aventura": "/sprinkler-repair-aventura",
    "/es/reparacion-de-sprinklers-sunny-isles-beach": "/sprinkler-repair-sunny-isles-beach",
    "/es/reparacion-de-sprinklers-north-miami": "/sprinkler-repair-north-miami",
    "/es/reparacion-de-sprinklers-surfside": "/sprinkler-repair-surfside",
    "/es/reparacion-de-sprinklers-north-bay-village": "/sprinkler-repair-north-bay-village",
    "/es/reparacion-de-sprinklers-miami-beach": "/sprinkler-repair-miami-beach",
    "/es/reparacion-de-sprinklers-hialeah": "/sprinkler-repair-hialeah",
    "/es/reparacion-de-sprinklers-doral": "/sprinkler-repair-doral",
    "/es/reparacion-de-sprinklers-fontainebleau": "/sprinkler-repair-fontainebleau",
    "/es/reparacion-de-sprinklers-tamiami": "/sprinkler-repair-tamiami",
    "/es/reparacion-de-sprinklers-miami": "/sprinkler-repair-miami",
    "/es/reparacion-de-sprinklers-coral-gables": "/sprinkler-repair-coral-gables",
    "/es/reparacion-de-sprinklers-key-biscayne": "/sprinkler-repair-key-biscayne",
    "/es/reparacion-de-sprinklers-kendall": "/sprinkler-repair-kendall",
    "/es/reparacion-de-sprinklers-kendale-lakes": "/sprinkler-repair-kendale-lakes",
    "/es/reparacion-de-sprinklers-country-walk": "/sprinkler-repair-country-walk",
    "/es/reparacion-de-sprinklers-cutler-bay": "/sprinkler-repair-cutler-bay",
    "/es/reparacion-e-instalacion-de-sprinklers":
      "/services/sprinkler-repair-and-installation",
    "/es/reparacion-de-fugas-de-sprinklers":
      "/services/sprinkler-leak-repair",
    "/es/reparacion-de-valvulas-de-sprinklers":
      "/services/sprinkler-valve-repair",
    "/es/reemplazo-de-bombas-de-sprinklers":
      "/services/sprinkler-pump-replacement",
    "/es/instalacion-de-temporizadores-de-sprinklers":
      "/services/sprinkler-timer-installation",
    "/es/actualizacion-a-controlador-wifi-de-sprinklers":
      "/services/wifi-sprinkler-controller-upgrade",
    "/es/instalacion-de-sensores-de-lluvia":
      "/services/rain-sensor-installation",
    "/es/instalacion-nueva-de-irrigacion":
      "/services/new-irrigation-installation",
    "/es/instalacion-de-camaras-inalambricas":
      "/services/wireless-camera-installation",
    "/es/plan-de-mantenimiento-de-sprinklers":
      "/services/sprinkler-maintenance-plan",
    "/es/reparacion-de-emergencia-de-sprinklers":
      "/services/emergency-sprinkler-repair",
    "/es/riego-comercial-y-para-hoa":
      "/services/commercial-irrigation-hoa-services",
    "/es/instalacion-de-pozos-nuevos-de-irrigacion":
      "/services/new-irrigation-well-installation",
    "/es/reparacion-de-sprinklers-e-irrigacion":
      "/services/landscaping",
    "/es/seguridad-del-hogar":
      "/services/home-security",
    "/es/blog": "/blog",
    "/es/blog/instalacion-de-camaras-inalambricas-para-tu-hogar-o-negocio":
      "/blog/wireless-camera-installation-secure-your-home-or-business",
    "/es/blog/como-elegir-e-instalar-el-videoportero-adecuado-para-tu-hogar-o-pequeno-negocio":
      "/blog/how-to-choose-and-install-the-right-video-doorbell-for-your-home-or-small-business",
    "/es/blog/reparacion-e-instalacion-de-sprinklers-en-miami-guia-2026":
      "/blog/sprinkler-repair-and-installation-in-miami-2026-guide",
    "/es/blog/cada-cuanto-hacer-funcionar-tus-sprinklers-en-miami-guia-de-riego-2026":
      "/blog/how-often-should-you-run-your-sprinkler-system-in-miami-watering-guide-2026",
    "/es/blog/instalacion-de-camaras-de-seguridad-cerca-de-mi-en-miami":
      "/blog/security-camera-installation-near-me-miami",
    "/es/blog/reparacion-de-sprinklers-cerca-de-mi-en-miami-arregla-tu-riego-rapido":
      "/blog/sprinkler-repair-near-me-in-miami-fix-your-irrigation-system-fast",
    "/es/blog/sistema-de-sprinklers-no-funciona-en-miami":
      "/blog/sprinkler-system-not-working-miami",
    "/es/blog/por-que-cambiar-de-un-temporizador-intermatic-a-un-controlador-inteligente-guia-miami-2026":
      "/blog/why-upgrade-from-an-intermatic-timer-to-a-smart-irrigation-controller-miami-guide-2026",
    "/es/blog/prepara-tu-sistema-de-sprinklers-para-la-temporada-seca-en-miami":
      "/blog/prepare-sprinkler-system-dry-season-miami",
    "/es/blog/controladores-inteligentes-de-sprinklers-en-miami-timers-wifi":
      "/blog/smart-sprinkler-controllers-miami-wifi-timers",
    "/es/contacto": "/contact",
    "/es/servicios": "/services",
    "/es/sobre-nosotros": "/about",
    "/es/areas-de-servicio": "/locations",
    "/es/areas-de-servicio/miami": "/locations/miami",
    "/es/areas-de-servicio/fort-lauderdale": "/locations/fort-lauderdale",
    "/es/politica-de-privacidad": "/privacy-policy",
    "/es/terminos-y-condiciones": "/terms-and-conditions",
    "/es/accesibilidad": "/accessibility",
    "/es/preguntas-frecuentes": "/faq",
  };
  // "/es" itself (the Spanish home) does not start with "/es/", so check
  // for it explicitly: otherwise the chrome on /es would render in English.
  const isSpanishPage =
    pathname === "/es" || (pathname ?? "").startsWith("/es/");
  const spanishHref = EN_TO_ES[pathname ?? ""] ?? ES_HUB_HREF;
  const englishHref = ES_TO_EN[pathname ?? ""] ?? "/";

  // Segmented language switcher: two separate, directly tappable buttons
  // ("EN" and "ES") instead of one pill to toggle — tap the language you
  // want to go to. The active language is highlighted in brand green with
  // dark text; the inactive one stays visible but dimmed. Hrefs and
  // mappings above are untouched.
  // Rendered in the desktop nav (NavLinks) and, separately, in the header
  // actions for mobile, where it is visible without opening the menu.
  const langSwitcher = (extraClass: string) => (
    <span
      className={`lang-switcher ${extraClass}`}
      role="group"
      aria-label="Language switcher"
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px",
        background: "rgba(15, 23, 42, 0.55)",
        border: "1px solid rgba(255, 255, 255, 0.18)",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 700,
        lineHeight: "1",
        whiteSpace: "nowrap",
      }}
    >
      {isSpanishPage ? (
        <>
          <Link
            href={englishHref}
            onClick={closeAllMenus}
            aria-label="View this page in English"
            style={{
              textDecoration: "none",
              color: "#e2e8f0",
              opacity: 0.7,
              padding: "5px 9px",
              borderRadius: "999px",
            }}
          >
            EN
          </Link>
          <span
            aria-current="true"
            style={{
              background: "#00E793",
              color: "#0f172a",
              padding: "5px 9px",
              borderRadius: "999px",
            }}
          >
            ES
          </span>
        </>
      ) : (
        <>
          <span
            aria-current="true"
            style={{
              background: "#00E793",
              color: "#0f172a",
              padding: "5px 9px",
              borderRadius: "999px",
            }}
          >
            EN
          </span>
          <Link
            href={spanishHref}
            onClick={closeAllMenus}
            aria-label="Ver esta página en español"
            style={{
              textDecoration: "none",
              color: "#e2e8f0",
              opacity: 0.7,
              padding: "5px 9px",
              borderRadius: "999px",
            }}
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
                        <h4 className="submenu-title">
                          {isSpanishPage
                            ? groupTitleEs(group.slug, group.title)
                            : group.title}
                        </h4>
                      </div>
                      <div className="submenu-body">
                        <div className="submenu-columns">
                          <div className="submenu-left-column">
                            <ServiceGroupList
                              title={
                                isSpanishPage
                                  ? groupTitleEs(group.slug, group.title)
                                  : group.title
                              }
                              locale={isSpanishPage ? "es" : "en"}
                              items={group.services}
                              onSelect={(srv) => {
                                closeAllMenus();
                                if (srv?.slug) router.push(serviceHref(srv.slug, isSpanishPage ? "es" : "en"));
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
                            <h4 style={{ marginLeft: 8 }}>{isSpanishPage && cat.categoryEs ? cat.categoryEs : cat.category}</h4>
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
                            <h4 style={{ marginLeft: 8 }}>{isSpanishPage && cat.categoryEs ? cat.categoryEs : cat.category}</h4>
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
                                {isSpanishPage ? groupTitleEs(group.slug, group.title) : group.title}
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

      {/* GET HELP — plain contact page link. Never "Support": the
          business does no tech support, and the label must not sound
          like it. */}
      <Link href={isSpanishPage ? "/es/contacto" : "/contact"} className="support-btn" onClick={closeAllMenus}>
        {isSpanishPage ? "Obtener ayuda" : "Get Help"}
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
      <AnnouncementBar phoneTel={phoneTel} phoneDisplay={phoneDisplay} />
      <header className="site-header">
        <div className="site-container-var nav-grid">
          {/* BRAND: stays in the current language (Spanish home when in Spanish mode) */}
          <Link href={isSpanishPage ? "/es/" : "/"} className="brand" onClick={closeAllMenus}>
            {/* Brand mark: the owner's logo mark (fist + hose) from the
                footer logo file, in place of the old headphone glyph
                (9 Nov 2026). The wordmark stays as text next to it. */}
            <div className="logo-wrapper">
              <span className="logo-lockup logo-desktop">
                <Image
                  src="/logo-mark-v3.svg"
                  alt=""
                  width={38}
                  height={32}
                  className="logo-mark"
                  priority
                />
                <span className="logo-name">CallTechCare</span>
              </span>
              <span className="logo-lockup logo-mobile">
                <Image
                  src="/logo-mark-v3.svg"
                  alt=""
                  width={34}
                  height={29}
                  className="logo-mark"
                  priority
                />
                <span className="logo-name-stacked">
                  <span>Call</span>
                  <span>TechCare</span>
                </span>
              </span>
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

