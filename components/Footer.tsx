"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";
import SvgIcon from "./common/SvgIcons";

import { FALLBACK_SETTINGS } from "@/lib/sanitySettings";

type FooterArea = { name: string; slug: string; esSlug: string };

// Contact data comes from the siteSettings document via the layout;
// the defaults below are the exact values shown today.
export default function Footer({
  areas,
  phoneTel = FALLBACK_SETTINGS.phoneTel,
  phoneDisplay = FALLBACK_SETTINGS.phoneDisplay,
  email = "support@calltechcare.com",
  hoursWeekdayLabel = "Mon–Sat",
  hoursWeekdayLabelEs = "Lun–Sáb",
  hoursWeekdayTime = "8 AM – 7 PM",
  hoursWeekendLabel = "Sun",
  hoursWeekendLabelEs = "Dom",
  hoursWeekendTime = "9 AM – 6 PM",
}: {
  areas?: FooterArea[];
  phoneTel?: string;
  phoneDisplay?: string;
  email?: string;
  hoursWeekdayLabel?: string;
  hoursWeekdayLabelEs?: string;
  hoursWeekdayTime?: string;
  hoursWeekendLabel?: string;
  hoursWeekendLabelEs?: string;
  hoursWeekendTime?: string;
}) {
  const year = new Date().getFullYear();
  const pathname = usePathname();
  // Same locale check as the Navbar: "/es" itself plus any "/es/*" route.
  const isSpanishPage =
    pathname === "/es" || (pathname ?? "").startsWith("/es/");

  // The footer no longer lists cities: the home page "Service Areas"
  // section and the /locations page carry all 30 cities, so the footer
  // keeps only the single "View all service areas" link below.
  // The `areas` prop is kept in the signature because the layout passes
  // it; it is intentionally not rendered here anymore.

  return (
    <footer className="site-footer">
      {/* ===== Top Section ===== */}
      <div className="site-container footer-top">
        {/* Brand */}
        <div className="footer-brand-wrapper">
          <a
  href="#top"
  className="footer-brand"
  aria-label="CallTechCare – back to top"
>

            <Image
              src="/footer-logo.svg"
              alt="CallTechCare – Sprinkler Repair & Irrigation Services in Miami and Broward"
              width={280}
              height={171}
              className="footer-logo"
              priority
              style={{
                width: "auto",
                height: "auto",
                objectFit: "contain",
                objectPosition: "center",
              }}
            />
          </a>
        </div>

        {/* Navigation: in Spanish mode, links point only to pages that exist
            in this branch: the Spanish home anchors (#how,
            #contact), the Spanish blog page, and the existing English pages
            (locations, about, faq). No /es/* page that does not exist is linked. */}
        <nav className="footer-nav" aria-label={isSpanishPage ? "Navegación del pie de página" : "Footer Navigation"}>
          <a href={isSpanishPage ? "/es/#how" : "/#how"}>{isSpanishPage ? "Cómo Funciona" : "How It Works"}</a>
          <Link href={isSpanishPage ? "/es/blog" : "/blog"}>Blog</Link>
          <a href={isSpanishPage ? "/es/contacto" : "/contact"}>{isSpanishPage ? "Contacto" : "Contact"}</a>
          <Link href={isSpanishPage ? "/es/sobre-nosotros" : "/about"}>{isSpanishPage ? "Sobre Nosotros" : "About Us"}</Link>
          <Link href={isSpanishPage ? "/es/preguntas-frecuentes" : "/faq"}>{isSpanishPage ? "Preguntas Frecuentes" : "FAQ"}</Link>
          <Link href={isSpanishPage ? "/es/servicios" : "/services"}>{isSpanishPage ? "Todos los Servicios" : "All Services"}</Link>
        </nav>

        {/* Contact Info */}
        <div className="footer-contact">
          <p>
            📞 <a href={`tel:${phoneTel}`} title="Call CallTechCare">{phoneDisplay}</a>
            <br />
            ✉️{" "}
              <a href={`mailto:${email}`} title="Email CallTechCare support">
              {email}
            </a>
          </p>
          <p>
            {isSpanishPage ? `${hoursWeekdayLabelEs}: ${hoursWeekdayTime}` : `${hoursWeekdayLabel}: ${hoursWeekdayTime}`}
            <br />
            {isSpanishPage ? `${hoursWeekendLabelEs}: ${hoursWeekendTime}` : `${hoursWeekendLabel}: ${hoursWeekendTime}`}
          </p>
          <div className="footer-areas">
            <p className="areas-list">
              <Link href={isSpanishPage ? "/es/areas-de-servicio" : "/locations"}>
                {isSpanishPage ? "Ver todas las áreas" : "View all service areas"}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ===== Social + Legal ===== */}
      <div className="site-container footer-middle">
        <div className="footer-social">
          <p>{isSpanishPage ? "Síguenos" : "Follow Us"}</p>
          <div className="social-icons">
            <a
              href="https://www.facebook.com/CallTechCare"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SvgIcon name="facebook" size={28} color="#ffffff" className="social-icon" />
            </a>
            <a
              href="https://instagram.com/calltechcare"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SvgIcon name="instagram" size={28} color="#ffffff" />
            </a>
            
          </div>
        </div>

        <div className="footer-trust">
          <p>{isSpanishPage ? "Llámanos para tu inspección gratis" : "Call us for your free inspection"}</p>
          <div className="trust-icons">
            <Image
              src="/icons/ssl.png"
              alt="SSL Secured"
              width={24}
              height={24}
              style={{ width: "auto", height: "auto" }}
            />
          </div>
        </div>

        <a className="to-top" href="#top" aria-label={isSpanishPage ? "Volver arriba" : "Back to top"}>
          <ArrowUp size={18} />
        </a>
      </div>

      {/* ===== Bottom Row ===== */}
      <div className="site-container footer-bottom">
        <div className="legal">
          <Link href={isSpanishPage ? "/es/politica-de-privacidad" : "/privacy-policy"} aria-label={isSpanishPage ? "Política de Privacidad" : "Privacy Policy"}>
            {isSpanishPage ? "Política de Privacidad" : "Privacy Policy"}
          </Link>
          <span>•</span>
          <a href="#cookie-settings" aria-label={isSpanishPage ? "Configuración de Cookies" : "Cookie Settings"}>
            {isSpanishPage ? "Configuración de Cookies" : "Cookie Settings"}
          </a>
          <span>•</span>
          <Link href={isSpanishPage ? "/es/terminos-y-condiciones" : "/terms-and-conditions"} aria-label={isSpanishPage ? "Términos y Condiciones" : "Terms and Conditions"}>
            {isSpanishPage ? "Términos y Condiciones" : "Terms & Conditions"}
          </Link>
          <span>•</span>
          <Link href={isSpanishPage ? "/es/accesibilidad" : "/accessibility"} aria-label={isSpanishPage ? "Declaración de Accesibilidad" : "Accessibility Statement"}>
            {isSpanishPage ? "Accesibilidad" : "Accessibility"}
          </Link>
        </div>

        <p className="copy">
          © {year} CallTechCare. {isSpanishPage ? "Todos los derechos reservados. Hecho con ❤️ en el sur de Florida." : "All rights reserved. Built with ❤️ in South Florida."}
        </p>
      </div>
    </footer>
  );
}
