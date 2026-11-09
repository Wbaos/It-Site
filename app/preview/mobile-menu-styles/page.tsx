"use client";

// PREVIEW ONLY — style picker for the mobile menu. Lives in a branch, never merged.
// Six working menu styles in phone frames so Wilber can try each one on his
// phone and pick a number. Links are demos: tapping one shows where it would go.

import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import styles from "./styles.module.css";

type Lang = "es" | "en";
type MenuKind =
  | "current"
  | "fullscreen"
  | "right"
  | "left"
  | "sheet"
  | "dropdown"
  | "icons"
  | "green"
  | "accordion"
  | "search"
  | "center"
  | "contact"
  | "emergency";

const PHONE_DISPLAY = "(786) 366-2729";
const PHONE_TEL = "tel:+17863662729";

const L: Record<Lang, Record<string, string>> = {
  es: {
    home: "Inicio",
    services: "Servicios",
    allServices: "Todos los servicios",
    sprinklerRepair: "Reparación de sprinklers",
    cameras: "Cámaras inalámbricas",
    contact: "Contacto",
    blog: "Blog",
    areas: "Áreas de servicio",
    callNow: "Llamar ahora",
    close: "Cerrar",
    wouldGo: "Irías a:",
    emergency: "¿Emergencia? Llámanos",
    hours: "Lun–Sáb 8am–7pm · Dom 9am–6pm",
    servicesTitle: "Servicios",
    helpTitle: "Ayuda",
    menu: "Menú",
    quickAccess: "Accesos rápidos",
    descRepair: "Reparación e instalación",
    descCameras: "Videovigilancia para tu casa",
    descAll: "Ver todos los servicios",
    searchPh: "Buscar en el menú…",
    noResults: "Sin resultados",
    emergencyTitle: "¿Emergencia?",
    emergencyText: "Atendemos el mismo día en horario.",
    followUs: "Síguenos",
  },
  en: {
    home: "Home",
    services: "Services",
    allServices: "All services",
    sprinklerRepair: "Sprinkler repair",
    cameras: "Wireless cameras",
    contact: "Contact",
    blog: "Blog",
    areas: "Service areas",
    callNow: "Call now",
    close: "Close",
    wouldGo: "You'd go to:",
    emergency: "Emergency? Call us",
    hours: "Mon–Sat 8am–7pm · Sun 9am–6pm",
    servicesTitle: "Services",
    helpTitle: "Help",
    menu: "Menu",
    quickAccess: "Quick access",
    descRepair: "Repair & installation",
    descCameras: "Home video security",
    descAll: "See all services",
    searchPh: "Search the menu…",
    noResults: "No results",
    emergencyTitle: "Emergency?",
    emergencyText: "Same-day service during business hours.",
    followUs: "Follow us",
  },
};

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    x: <path d="M6 6l12 12M18 6L6 18" />,
    droplet: (
      <path d="M12 3s6 6.2 6 10.5a6 6 0 1 1-12 0C6 9.2 12 3 12 3z" />
    ),
    wrench: (
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    ),
    camera: (
      <>
        <path d="M4 8h2.5l2-2.5h5l2 2.5H20v11H4z" />
        <circle cx="12" cy="13" r="3.2" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" />
      </>
    ),
    phone: (
      <path d="M5 4h4l1.8 4.5-2.3 1.7a12 12 0 0 0 5.3 5.3l1.7-2.3L20 15v4a2 2 0 0 1-2 2A16.5 16.5 0 0 1 3 6a2 2 0 0 1 2-2z" />
    ),
    home: (
      <>
        <path d="M4 11l8-7 8 7" />
        <path d="M6 9.5V20h12V9.5" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3.5 7l8.5 6 8.5-6" />
      </>
    ),
    pin: (
      <>
        <path d="M12 21s-6.5-5.6-6.5-10.5a6.5 6.5 0 1 1 13 0C18.5 15.4 12 21 12 21z" />
        <circle cx="12" cy="10.5" r="2.3" />
      </>
    ),
    chevron: <path d="M9 6l6 6-6 6" />,
    check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
    grid: (
      <>
        <rect x="4" y="4" width="7" height="7" rx="1.5" />
        <rect x="13" y="4" width="7" height="7" rx="1.5" />
        <rect x="4" y="13" width="7" height="7" rx="1.5" />
        <rect x="13" y="13" width="7" height="7" rx="1.5" />
      </>
    ),
    doc: (
      <>
        <path d="M7 3h7l4 4v14H7z" />
        <path d="M14 3v4h4M10 12h5M10 16h5" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.5 12h17M12 3.5c2.6 2.3 3.9 5.2 3.9 8.5s-1.3 6.2-3.9 8.5c-2.6-2.3-3.9-5.2-3.9-8.5s1.3-6.2 3.9-8.5z" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

interface PickFn {
  (href: string): (e: MouseEvent) => void;
}

function LangPill({
  lang,
  setLang,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
}) {
  return (
    <span className={styles.pill} role="group" aria-label="Language / Idioma">
      <button
        type="button"
        className={lang === "en" ? styles.pillActive : ""}
        onClick={() => setLang("en")}
      >
        EN
      </button>
      <button
        type="button"
        className={lang === "es" ? styles.pillActive : ""}
        onClick={() => setLang("es")}
      >
        ES
      </button>
    </span>
  );
}

function CallButton({ t }: { t: Record<string, string> }) {
  return (
    <a href={PHONE_TEL} className={styles.callBtn}>
      <Icon name="phone" size={20} />
      <span>
        <strong>{t.callNow}</strong>
        <small>{PHONE_DISPLAY}</small>
      </span>
    </a>
  );
}

function VariantFrame({
  kind,
  num,
  name,
  blurb,
  isCurrent,
  selected,
  onSelect,
}: {
  kind: MenuKind;
  num: string;
  name: string;
  blurb: string;
  isCurrent?: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("es");
  const [toast, setToast] = useState<string | null>(null);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [query, setQuery] = useState("");
  const t = L[lang];

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(id);
  }, [toast]);

  const pick: PickFn = (href) => (e) => {
    e.preventDefault();
    setToast(`${t.wouldGo} ${href}`);
  };

  const link = (
    href: string,
    icon: string,
    label: string,
    cls?: string,
    withChevron = false
  ) => (
    <a key={href + label} href={href} onClick={pick(href)} className={cls}>
      <Icon name={icon} size={20} />
      <span>{label}</span>
      {withChevron && <Icon name="chevron" size={18} />}
    </a>
  );

  const servicesGroup = (cls?: string) => (
    <div className={styles.servicesGroup}>
      <span className={styles.groupLabel}>{t.services}</span>
      {link(
        "/services/sprinkler-repair-and-installation",
        "droplet",
        t.sprinklerRepair,
        cls,
        true
      )}
      {link(
        "/services/wireless-camera-installation",
        "camera",
        t.cameras,
        cls,
        true
      )}
      {link("/services", "grid", t.allServices, cls, true)}
    </div>
  );

  const plainLinks = (cls?: string) => (
    <>
      {link("/contact", "mail", t.contact, cls, true)}
      {link("/blog", "doc", t.blog, cls, true)}
      {link("/locations", "pin", t.areas, cls, true)}
    </>
  );

  const menuCls = (extra: string) =>
    `${styles.menu} ${extra} ${open ? styles.open : ""}`;

  const renderMenu = () => {
    if (kind === "current") {
      return (
        <nav
          className={menuCls(styles.menuCurrent)}
          aria-hidden={!open}
        >
          <a href="/" onClick={pick("/")} className={styles.currentLink}>
            {t.services}
          </a>
          <a href="/contact" onClick={pick("/contact")} className={styles.currentLink}>
            {t.contact}
          </a>
          <a href="/blog" onClick={pick("/blog")} className={styles.currentLink}>
            {t.blog}
          </a>
          <span className={styles.currentLang}>
            <LangPill lang={lang} setLang={setLang} />
          </span>
        </nav>
      );
    }
    if (kind === "fullscreen") {
      return (
        <nav className={menuCls(styles.menuFullscreen)} aria-hidden={!open}>
          <div className={styles.fsTop}>
            <span className={styles.fsBrand}>
              <img src="/logo-mark-v4.svg" alt="" width={34} height={29} />
              <span>CallTechCare</span>
            </span>
            <button
              type="button"
              className={styles.closeBtn}
              aria-label={t.close}
              onClick={() => setOpen(false)}
            >
              <Icon name="x" size={26} />
            </button>
          </div>
          <div className={styles.fsLinks}>
            {[
              { href: "/", label: t.home },
              { href: "/services", label: t.services },
              { href: "/contact", label: t.contact },
              { href: "/blog", label: t.blog },
              { href: "/locations", label: t.areas },
            ].map((l, i) => (
              <a
                key={l.href + l.label}
                href={l.href}
                onClick={pick(l.href)}
                style={{ transitionDelay: open ? `${90 + i * 70}ms` : "0ms" }}
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className={styles.fsFoot}>
            <CallButton t={t} />
            <small>{t.hours}</small>
          </div>
        </nav>
      );
    }
    if (kind === "right" || kind === "left") {
      return (
        <>
          <div
            className={`${styles.dim} ${open ? styles.open : ""}`}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <nav
            className={menuCls(
              kind === "right" ? styles.menuRight : styles.menuLeft
            )}
            aria-hidden={!open}
          >
            {kind === "left" && (
              <div className={styles.drawerGreenHead}>
                <span className={styles.drawerGreenBrand}>
                  <img src="/logo-mark-v4.svg" alt="" width={30} height={26} />
                  <span>CallTechCare</span>
                </span>
                <a href={PHONE_TEL} className={styles.drawerGreenPhone}>
                  <Icon name="phone" size={16} /> {PHONE_DISPLAY}
                </a>
              </div>
            )}
            <div className={styles.drawerTop}>
              <span>{t.menu}</span>
              <button
                type="button"
                className={styles.closeBtn}
                aria-label={t.close}
                onClick={() => setOpen(false)}
              >
                <Icon name="x" size={22} />
              </button>
            </div>
            <div className={styles.drawerLinks}>
              {link("/", "home", t.home, styles.drawerLink, true)}
              {servicesGroup(styles.drawerLink)}
              {plainLinks(styles.drawerLink)}
            </div>
            <div className={styles.drawerFoot}>
              <CallButton t={t} />
              <small>{t.hours}</small>
            </div>
          </nav>
        </>
      );
    }
    if (kind === "sheet") {
      return (
        <>
          <div
            className={`${styles.dim} ${open ? styles.open : ""}`}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <nav className={menuCls(styles.menuSheet)} aria-hidden={!open}>
            <span className={styles.sheetHandle} aria-hidden="true" />
            <span className={styles.sheetTitle}>{t.quickAccess}</span>
            <div className={styles.tileGrid}>
              {link(
                "/services/sprinkler-repair-and-installation",
                "droplet",
                t.sprinklerRepair,
                styles.tile
              )}
              {link(
                "/services/wireless-camera-installation",
                "camera",
                t.cameras,
                styles.tile
              )}
              {link("/services", "grid", t.allServices, styles.tile)}
              {link("/contact", "mail", t.contact, styles.tile)}
            </div>
            <div className={styles.sheetLinks}>
              {link("/", "home", t.home, styles.sheetLink, true)}
              {link("/blog", "doc", t.blog, styles.sheetLink, true)}
              {link("/locations", "pin", t.areas, styles.sheetLink, true)}
            </div>
            <CallButton t={t} />
          </nav>
        </>
      );
    }
    if (kind === "dropdown") {
      return (
        <nav className={menuCls(styles.menuDropdown)} aria-hidden={!open}>
          <span className={styles.dropLabel}>{t.servicesTitle}</span>
          <div className={styles.dropRows}>
            {link(
              "/services/sprinkler-repair-and-installation",
              "droplet",
              t.sprinklerRepair,
              styles.dropRow,
              true
            )}
            {link(
              "/services/wireless-camera-installation",
              "camera",
              t.cameras,
              styles.dropRow,
              true
            )}
            {link("/services", "grid", t.allServices, styles.dropRow, true)}
          </div>
          <span className={styles.dropLabel}>{t.helpTitle}</span>
          <div className={styles.dropRows}>
            {link("/contact", "mail", t.contact, styles.dropRow, true)}
            {link("/blog", "doc", t.blog, styles.dropRow, true)}
            {link("/locations", "pin", t.areas, styles.dropRow, true)}
          </div>
          <a href={PHONE_TEL} className={styles.dropCall}>
            <span className={styles.dropCallIcon}>
              <Icon name="phone" size={20} />
            </span>
            <span>
              <strong>{PHONE_DISPLAY}</strong>
              <small>{t.hours}</small>
            </span>
          </a>
        </nav>
      );
    }
    if (kind === "green") {
      return (
        <nav className={menuCls(styles.menuGreen)} aria-hidden={!open}>
          <img src="/logo-mark-v4.svg" alt="" className={styles.greenMark} />
          <div className={styles.fsTop}>
            <span className={styles.fsBrand}>
              <img src="/logo-mark-v4.svg" alt="" width={34} height={29} />
              <span>CallTechCare</span>
            </span>
            <button
              type="button"
              className={styles.closeBtn}
              aria-label={t.close}
              onClick={() => setOpen(false)}
            >
              <Icon name="x" size={26} />
            </button>
          </div>
          <div className={styles.fsLinks}>
            {[
              { href: "/", label: t.home },
              { href: "/services", label: t.services },
              { href: "/contact", label: t.contact },
              { href: "/blog", label: t.blog },
              { href: "/locations", label: t.areas },
            ].map((l, i) => (
              <a
                key={l.href + l.label}
                href={l.href}
                onClick={pick(l.href)}
                style={{ transitionDelay: open ? `${90 + i * 70}ms` : "0ms" }}
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className={styles.fsFoot}>
            <a
              href={PHONE_TEL}
              className={`${styles.callBtn} ${styles.callBtnDark}`}
            >
              <Icon name="phone" size={20} />
              <span>
                <strong>{t.callNow}</strong>
                <small>{PHONE_DISPLAY}</small>
              </span>
            </a>
            <small>{t.hours}</small>
          </div>
        </nav>
      );
    }
    if (kind === "accordion") {
      return (
        <>
          <div
            className={`${styles.dim} ${open ? styles.open : ""}`}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <nav className={menuCls(styles.menuRight)} aria-hidden={!open}>
            <div className={styles.drawerTop}>
              <span>{t.menu}</span>
              <button
                type="button"
                className={styles.closeBtn}
                aria-label={t.close}
                onClick={() => setOpen(false)}
              >
                <Icon name="x" size={22} />
              </button>
            </div>
            <div className={styles.drawerLinks}>
              {link("/", "home", t.home, styles.drawerLink, true)}
              <button
                type="button"
                className={styles.accHead}
                onClick={() => setServicesOpen((v) => !v)}
                aria-expanded={servicesOpen}
              >
                <span className={styles.accHeadLeft}>
                  <Icon name="wrench" size={20} />
                  <span>{t.services}</span>
                </span>
                <span
                  className={`${styles.accChevron} ${
                    servicesOpen ? styles.accChevronOpen : ""
                  }`}
                >
                  <Icon name="chevron" size={18} />
                </span>
              </button>
              {servicesOpen && (
                <div className={styles.accSub}>
                  {[
                    {
                      href: "/services/sprinkler-repair-and-installation",
                      icon: "droplet",
                      label: t.sprinklerRepair,
                      desc: t.descRepair,
                    },
                    {
                      href: "/services/wireless-camera-installation",
                      icon: "camera",
                      label: t.cameras,
                      desc: t.descCameras,
                    },
                    {
                      href: "/services",
                      icon: "grid",
                      label: t.allServices,
                      desc: t.descAll,
                    },
                  ].map((a) => (
                    <a
                      key={a.href}
                      href={a.href}
                      onClick={pick(a.href)}
                      className={styles.accRow}
                    >
                      <Icon name={a.icon} size={20} />
                      <span>
                        <strong>{a.label}</strong>
                        <small>{a.desc}</small>
                      </span>
                      <Icon name="chevron" size={18} />
                    </a>
                  ))}
                </div>
              )}
              {link("/contact", "mail", t.contact, styles.drawerLink, true)}
              {link("/blog", "doc", t.blog, styles.drawerLink, true)}
              {link("/locations", "pin", t.areas, styles.drawerLink, true)}
            </div>
            <div className={styles.drawerFoot}>
              <CallButton t={t} />
              <small>{t.hours}</small>
            </div>
          </nav>
        </>
      );
    }
    if (kind === "search") {
      const all = [
        { href: "/", label: t.home, icon: "home" },
        {
          href: "/services/sprinkler-repair-and-installation",
          label: t.sprinklerRepair,
          icon: "droplet",
        },
        {
          href: "/services/wireless-camera-installation",
          label: t.cameras,
          icon: "camera",
        },
        { href: "/services", label: t.allServices, icon: "grid" },
        { href: "/contact", label: t.contact, icon: "mail" },
        { href: "/blog", label: t.blog, icon: "doc" },
        { href: "/locations", label: t.areas, icon: "pin" },
      ];
      const norm = (v: string) =>
        v
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();
      const q = norm(query.trim());
      const filtered = q ? all.filter((a) => norm(a.label).includes(q)) : all;
      return (
        <nav className={menuCls(styles.menuSearch)} aria-hidden={!open}>
          <div className={styles.fsTop}>
            <span className={styles.fsBrand}>
              <img src="/logo-mark-v4.svg" alt="" width={34} height={29} />
              <span>CallTechCare</span>
            </span>
            <button
              type="button"
              className={styles.closeBtn}
              aria-label={t.close}
              onClick={() => setOpen(false)}
            >
              <Icon name="x" size={26} />
            </button>
          </div>
          <label className={styles.searchBox}>
            <Icon name="search" size={20} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPh}
              aria-label={t.searchPh}
            />
          </label>
          <div className={styles.searchList}>
            {filtered.length === 0 && (
              <span className={styles.searchEmpty}>{t.noResults}</span>
            )}
            {filtered.map((a) => (
              <a
                key={a.href + a.label}
                href={a.href}
                onClick={pick(a.href)}
                className={styles.searchLink}
              >
                <Icon name={a.icon} size={20} />
                <span>{a.label}</span>
                <Icon name="chevron" size={18} />
              </a>
            ))}
          </div>
          <div className={styles.fsFoot}>
            <CallButton t={t} />
          </div>
        </nav>
      );
    }
    if (kind === "center") {
      return (
        <nav className={menuCls(styles.menuCenter)} aria-hidden={!open}>
          <button
            type="button"
            className={`${styles.closeBtn} ${styles.centerClose}`}
            aria-label={t.close}
            onClick={() => setOpen(false)}
          >
            <Icon name="x" size={22} />
          </button>
          <img
            src="/logo-mark-v4.svg"
            alt=""
            width={76}
            height={64}
            className={styles.centerLogo}
          />
          <span className={styles.centerName}>CallTechCare</span>
          <div className={styles.centerLinks}>
            {[
              { href: "/", label: t.home },
              { href: "/services", label: t.services },
              { href: "/contact", label: t.contact },
              { href: "/blog", label: t.blog },
              { href: "/locations", label: t.areas },
            ].map((l) => (
              <a key={l.href + l.label} href={l.href} onClick={pick(l.href)}>
                {l.label}
              </a>
            ))}
          </div>
          <a href={PHONE_TEL} className={styles.centerCall}>
            <Icon name="phone" size={18} /> {PHONE_DISPLAY}
          </a>
        </nav>
      );
    }
    if (kind === "contact") {
      return (
        <>
          <div
            className={`${styles.dim} ${open ? styles.open : ""}`}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <nav className={menuCls(styles.menuLeft)} aria-hidden={!open}>
            <div className={styles.drawerTop}>
              <span>{t.menu}</span>
              <button
                type="button"
                className={styles.closeBtn}
                aria-label={t.close}
                onClick={() => setOpen(false)}
              >
                <Icon name="x" size={22} />
              </button>
            </div>
            <div className={styles.drawerLinks}>
              {link("/", "home", t.home, styles.drawerLink, true)}
              {servicesGroup(styles.drawerLink)}
              {link("/contact", "mail", t.contact, styles.drawerLink, true)}
              {link("/blog", "doc", t.blog, styles.drawerLink, true)}
              {link("/locations", "pin", t.areas, styles.drawerLink, true)}
            </div>
            <div className={styles.contactCard}>
              <a href={PHONE_TEL} className={styles.contactRow}>
                <Icon name="phone" size={18} />
                <span>
                  <small>{t.callNow}</small>
                  <strong>{PHONE_DISPLAY}</strong>
                </span>
              </a>
              <a
                href="mailto:support@calltechcare.com"
                onClick={pick("mailto:support@calltechcare.com")}
                className={styles.contactRow}
              >
                <Icon name="mail" size={18} />
                <span>
                  <small>Email</small>
                  <strong>support@calltechcare.com</strong>
                </span>
              </a>
              <span className={styles.contactRow}>
                <Icon name="clock" size={18} />
                <span>
                  <small>{t.hours}</small>
                  <strong>Miami &amp; Broward</strong>
                </span>
              </span>
            </div>
            <div className={styles.socialBlock}>
              <span className={styles.groupLabel}>{t.followUs}</span>
              <div className={styles.socialRows}>
                <a
                  href="https://www.facebook.com/CallTechCare"
                  onClick={pick("https://www.facebook.com/CallTechCare")}
                  className={styles.socialRow}
                >
                  <Icon name="globe" size={18} />
                  <span>Facebook</span>
                  <Icon name="chevron" size={16} />
                </a>
                <a
                  href="https://instagram.com/calltechcare"
                  onClick={pick("https://instagram.com/calltechcare")}
                  className={styles.socialRow}
                >
                  <Icon name="camera" size={18} />
                  <span>Instagram</span>
                  <Icon name="chevron" size={16} />
                </a>
              </div>
            </div>
          </nav>
        </>
      );
    }
    if (kind === "emergency") {
      return (
        <>
          <div
            className={`${styles.dim} ${open ? styles.open : ""}`}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <nav className={menuCls(styles.menuRight)} aria-hidden={!open}>
            <div className={styles.emBanner}>
              <strong>{t.emergencyTitle}</strong>
              <span>{t.emergencyText}</span>
              <a href={PHONE_TEL} className={styles.emCall}>
                <Icon name="phone" size={18} /> {PHONE_DISPLAY}
              </a>
            </div>
            <div className={styles.drawerTop}>
              <span>{t.menu}</span>
              <button
                type="button"
                className={styles.closeBtn}
                aria-label={t.close}
                onClick={() => setOpen(false)}
              >
                <Icon name="x" size={22} />
              </button>
            </div>
            <div className={styles.drawerLinks}>
              {link("/", "home", t.home, styles.drawerLink, true)}
              {servicesGroup(styles.drawerLink)}
              {link("/contact", "mail", t.contact, styles.drawerLink, true)}
              {link("/blog", "doc", t.blog, styles.drawerLink, true)}
              {link("/locations", "pin", t.areas, styles.drawerLink, true)}
            </div>
            <div className={styles.drawerFoot}>
              <small>{t.hours}</small>
            </div>
          </nav>
        </>
      );
    }
    // icons
    const iconRows: Array<{
      href: string;
      icon: string;
      label: string;
      sub: string;
    }> = [
      { href: "/", icon: "home", label: t.home, sub: t.areas },
      {
        href: "/services/sprinkler-repair-and-installation",
        icon: "droplet",
        label: t.sprinklerRepair,
        sub: t.services,
      },
      {
        href: "/services/wireless-camera-installation",
        icon: "camera",
        label: t.cameras,
        sub: t.services,
      },
      { href: "/services", icon: "grid", label: t.allServices, sub: t.services },
      { href: "/contact", icon: "mail", label: t.contact, sub: PHONE_DISPLAY },
      { href: "/blog", icon: "doc", label: t.blog, sub: t.helpTitle },
    ];
    return (
      <nav className={menuCls(styles.menuIcons)} aria-hidden={!open}>
        <div className={styles.iconsTop}>
          <span>{t.menu}</span>
          <button
            type="button"
            className={styles.closeBtn}
            aria-label={t.close}
            onClick={() => setOpen(false)}
          >
            <Icon name="x" size={22} />
          </button>
        </div>
        <div className={styles.iconRows}>
          {iconRows.map((r) => (
            <a key={r.href + r.label} href={r.href} onClick={pick(r.href)}>
              <span className={styles.iconSquare}>
                <Icon name={r.icon} size={22} />
              </span>
              <span className={styles.iconTexts}>
                <strong>{r.label}</strong>
                <small>{r.sub}</small>
              </span>
              <Icon name="chevron" size={18} />
            </a>
          ))}
        </div>
        <div className={styles.iconsFoot}>
          <CallButton t={t} />
        </div>
      </nav>
    );
  };

  return (
    <section
      className={`${styles.variant} ${selected ? styles.chosen : ""} ${
        isCurrent ? styles.variantCurrent : ""
      }`}
    >
      <div className={styles.variantHead}>
        <span className={styles.num}>{num}</span>
        <div>
          <h2>{name}</h2>
          <p>{blurb}</p>
        </div>
      </div>
      <div className={styles.frame}>
        <div className={styles.miniHeader}>
          <span className={styles.miniBrand}>
            <img src="/logo-mark-v4.svg" alt="" width={34} height={29} />
            <span className={styles.miniName}>
              <span>Call</span>
              <span>TechCare</span>
            </span>
          </span>
          <span className={styles.miniActions}>
            <LangPill lang={lang} setLang={setLang} />
            <button
              type="button"
              className={styles.burger}
              aria-label={t.menu}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <Icon name={open ? "x" : "menu"} size={24} />
            </button>
          </span>
        </div>
        <div className={styles.fakePage}>
          <span className={styles.fakeEyebrow}>Miami &amp; Broward</span>
          <strong>Sprinkler Repair Miami &amp; Broward</strong>
          <span className={styles.fakeBtn}>Free inspection</span>
          <div className={styles.fakeChips}>
            <span>5.0 ★ · 30 reviews</span>
            <span>Same-day</span>
          </div>
        </div>
        {renderMenu()}
        {toast && <div className={styles.toast}>{toast}</div>}
      </div>
      {!isCurrent && (
        <button
          type="button"
          className={styles.chooseBtn}
          onClick={onSelect}
          aria-pressed={selected}
        >
          {selected ? (
            <>
              <Icon name="check" size={18} /> Tu elección
            </>
          ) : (
            "Me gusta este estilo"
          )}
        </button>
      )}
    </section>
  );
}

const VARIANTS: Array<{
  kind: MenuKind;
  num: string;
  name: string;
  blurb: string;
  isCurrent?: boolean;
}> = [
  {
    kind: "current",
    num: "0",
    name: "El actual (para comparar)",
    blurb:
      "El menú de ahora: solo enlaces de texto, sin iconos ni botón de llamar.",
    isCurrent: true,
  },
  {
    kind: "fullscreen",
    num: "1",
    name: "Pantalla completa",
    blurb: "Ocupa todo el teléfono, enlaces enormes, nada distrae.",
  },
  {
    kind: "right",
    num: "2",
    name: "Panel desde la derecha",
    blurb: "Se desliza desde la derecha; se cierra tocando fuera.",
  },
  {
    kind: "left",
    num: "3",
    name: "Panel desde la izquierda",
    blurb: "Entra desde la izquierda, con cabecera verde y teléfono arriba.",
  },
  {
    kind: "sheet",
    num: "4",
    name: "Hoja desde abajo",
    blurb: "Sube desde abajo como una tarjeta, con accesos rápidos.",
  },
  {
    kind: "dropdown",
    num: "5",
    name: "Desplegable vestido",
    blurb:
      "Cae desde el header como ahora, pero con secciones, iconos y teléfono.",
  },
  {
    kind: "icons",
    num: "6",
    name: "Iconos + Llamar",
    blurb:
      "Cada sección con su icono y el botón de llamar siempre abajo.",
  },
  {
    kind: "green",
    num: "7",
    name: "Verde a pantalla completa",
    blurb: "El mismo menú grande, pero todo en verde con el logo de fondo.",
  },
  {
    kind: "accordion",
    num: "8",
    name: "Acordeón de servicios",
    blurb: "Servicios se abre y muestra cada servicio con su descripción.",
  },
  {
    kind: "search",
    num: "9",
    name: "Con buscador",
    blurb: "Escribe y el menú filtra los enlaces al instante.",
  },
  {
    kind: "center",
    num: "10",
    name: "Centrado minimalista",
    blurb: "Logo grande al centro, enlaces con aire, nada de ruido.",
  },
  {
    kind: "contact",
    num: "11",
    name: "Contacto y redes",
    blurb: "El menú trae la tarjeta de contacto y las redes sociales.",
  },
  {
    kind: "emergency",
    num: "12",
    name: "Con aviso de emergencia",
    blurb: "Arriba un aviso de emergencia el mismo día, luego los enlaces.",
  },
];

export default function MobileMenuStylesPage() {
  const [selected, setSelected] = useState<MenuKind | null>(null);
  const chosen = VARIANTS.find((v) => v.kind === selected);

  return (
    <main className={styles.page}>
      <header className={styles.pageHead}>
        <span className={styles.eyebrow}>Vista previa · No está en vivo</span>
        <h1>El menú del teléfono: 12 estilos para elegir</h1>
        <p>
          Toca la hamburguesa dentro de cada teléfono para abrir el menú y
          probarlo de verdad: enlaces, idioma y botón de llamar. Cuando te
          guste uno, toca «Me gusta este estilo» y dime el número en el chat.
        </p>
      </header>
      <div className={styles.grid}>
        {VARIANTS.map((v) => (
          <VariantFrame
            key={v.kind}
            kind={v.kind}
            num={v.num}
            name={v.name}
            blurb={v.blurb}
            isCurrent={v.isCurrent}
            selected={selected === v.kind}
            onSelect={() => setSelected(v.kind)}
          />
        ))}
      </div>
      {chosen && (
        <div className={styles.choiceBar}>
          <span>
            <strong>
              Tu elección: {chosen.num}. {chosen.name}
            </strong>{" "}
            — dímelo en el chat y lo pongo en vivo.
          </span>
          <button type="button" onClick={() => setSelected(null)}>
            Quitar
          </button>
        </div>
      )}
    </main>
  );
}
