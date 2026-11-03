"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";
import SvgIcon from "./common/SvgIcons";

import { cityHref } from "@/lib/cityTwins";
import { serviceHref } from "@/lib/serviceTwins";

type FooterArea = { name: string; slug: string; esSlug: string };

export default function Footer({ areas }: { areas?: FooterArea[] }) {
  const year = new Date().getFullYear();
  const pathname = usePathname();
  // Same locale check as the Navbar: "/es" itself plus any "/es/*" route.
  const isSpanishPage =
    pathname === "/es" || (pathname ?? "").startsWith("/es/");
  const locale = isSpanishPage ? "es" : "en";

  // Areas from Sanity (via layout); falls back to the fixed canonical list
  // when the layout renders without them.
  const footerAreas = (areas?.length ? areas : [
    { name: "Sunrise", slug: "sunrise", esSlug: "reparacion-de-sprinklers-sunrise" },
    { name: "Fort Lauderdale", slug: "fort-lauderdale", esSlug: "reparacion-de-sprinklers-fort-lauderdale" },
    { name: "Dania Beach", slug: "dania-beach", esSlug: "reparacion-de-sprinklers-dania-beach" },
    { name: "Weston", slug: "weston", esSlug: "reparacion-de-sprinklers-weston" },
    { name: "Davie", slug: "davie", esSlug: "reparacion-de-sprinklers-davie" },
    { name: "Southwest Ranches", slug: "southwest-ranches", esSlug: "reparacion-de-sprinklers-southwest-ranches" },
    { name: "Hollywood", slug: "hollywood", esSlug: "reparacion-de-sprinklers-hollywood" },
    { name: "West Park", slug: "west-park", esSlug: "reparacion-de-sprinklers-west-park" },
    { name: "Pembroke Pines", slug: "pembroke-pines", esSlug: "reparacion-de-sprinklers-pembroke-pines" },
    { name: "Miramar", slug: "miramar", esSlug: "reparacion-de-sprinklers-miramar" },
    { name: "Miami Gardens", slug: "miami-gardens", esSlug: "reparacion-de-sprinklers-miami-gardens" },
    { name: "Miami Lakes", slug: "miami-lakes", esSlug: "reparacion-de-sprinklers-miami-lakes" },
    { name: "Country Club", slug: "country-club", esSlug: "reparacion-de-sprinklers-country-club" },
    { name: "Aventura", slug: "aventura", esSlug: "reparacion-de-sprinklers-aventura" },
    { name: "Sunny Isles Beach", slug: "sunny-isles-beach", esSlug: "reparacion-de-sprinklers-sunny-isles-beach" },
    { name: "North Miami", slug: "north-miami", esSlug: "reparacion-de-sprinklers-north-miami" },
    { name: "Surfside", slug: "surfside", esSlug: "reparacion-de-sprinklers-surfside" },
    { name: "North Bay Village", slug: "north-bay-village", esSlug: "reparacion-de-sprinklers-north-bay-village" },
    { name: "Miami Beach", slug: "miami-beach", esSlug: "reparacion-de-sprinklers-miami-beach" },
    { name: "Hialeah", slug: "hialeah", esSlug: "reparacion-de-sprinklers-hialeah" },
    { name: "Doral", slug: "doral", esSlug: "reparacion-de-sprinklers-doral" },
    { name: "Fontainebleau", slug: "fontainebleau", esSlug: "reparacion-de-sprinklers-fontainebleau" },
    { name: "Tamiami", slug: "tamiami", esSlug: "reparacion-de-sprinklers-tamiami" },
    { name: "Miami", slug: "miami", esSlug: "reparacion-de-sprinklers-miami" },
    { name: "Coral Gables", slug: "coral-gables", esSlug: "reparacion-de-sprinklers-coral-gables" },
    { name: "Key Biscayne", slug: "key-biscayne", esSlug: "reparacion-de-sprinklers-key-biscayne" },
    { name: "Kendall", slug: "kendall", esSlug: "reparacion-de-sprinklers-kendall" },
    { name: "Kendale Lakes", slug: "kendale-lakes", esSlug: "reparacion-de-sprinklers-kendale-lakes" },
    { name: "Country Walk", slug: "country-walk", esSlug: "reparacion-de-sprinklers-country-walk" },
    { name: "Cutler Bay", slug: "cutler-bay", esSlug: "reparacion-de-sprinklers-cutler-bay" },
  ]).map((area) => ({ ...area, href: cityHref(area.slug, locale) }));

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
              src="/Print_Transparent.svg"
              alt="CallTechCare – Sprinkler Repair & Irrigation Services in Miami and Broward"
              width={250}
              height={250}
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
          <p className="footer-tagline">
              {isSpanishPage
                ? "Servicios de Reparación de Sprinklers e Irrigación en Miami y Broward"
                : "Sprinkler Repair & Irrigation Services in Miami & Broward"}
          </p>
        </div>

        {/* Navigation: in Spanish mode, links point only to pages that exist
            in this branch: the Spanish home anchors (#services, #how,
            #contact), the Spanish blog page, and the existing English pages
            (locations, about, faq). No /es/* page that does not exist is linked. */}
        <nav className="footer-nav" aria-label={isSpanishPage ? "Navegación del pie de página" : "Footer Navigation"}>
          <Link href={isSpanishPage ? "/es/#services" : "/#services"}>{isSpanishPage ? "Servicios" : "Services"}</Link>
          <Link href={isSpanishPage ? "/es/#how" : "/#how"}>{isSpanishPage ? "Cómo Funciona" : "How It Works"}</Link>
          <Link href={isSpanishPage ? "/es/blog" : "/blog"}>Blog</Link>
          <Link href={isSpanishPage ? "/es/areas-de-servicio" : "/locations"}>{isSpanishPage ? "Áreas de Servicio" : "Service Areas"}</Link>
          <Link href={isSpanishPage ? "/es/contacto" : "/#contact"}>{isSpanishPage ? "Contacto" : "Contact"}</Link>
          <Link href={isSpanishPage ? "/es/sobre-nosotros" : "/about"}>{isSpanishPage ? "Sobre Nosotros" : "About Us"}</Link>
          <Link href={isSpanishPage ? "/es/preguntas-frecuentes" : "/faq"}>{isSpanishPage ? "Preguntas Frecuentes" : "FAQ"}</Link>
        </nav>

        {/* Services List (SEO) */}
        <div className="footer-services">
          <p className="footer-services-title">
            {isSpanishPage ? "Servicios Populares en Miami y Broward" : "Popular Services in Miami & Broward"}
          </p>

          <ul className="footer-services-list">
            <li>
              <Link href={cityHref("miami", locale)}>
                {isSpanishPage ? "Reparación de Sprinklers en Miami" : "Sprinkler Repair Miami"}
              </Link>
            </li>
            <li>
              <Link href={serviceHref("sprinkler-repair-and-installation", locale)}>
                {isSpanishPage ? "Reparación e Instalación de Sprinklers" : "Sprinkler Repair & Irrigation"}
              </Link>
            </li>
            <li>
              <Link href={serviceHref("sprinkler-leak-repair", locale)}>
                {isSpanishPage ? "Reparación de Fugas de Sprinklers" : "Sprinkler Leak Repair"}
              </Link>
            </li>
            <li>
              <Link href={serviceHref("sprinkler-valve-repair", locale)}>
                {isSpanishPage ? "Reparación de Válvulas de Sprinklers" : "Sprinkler Valve Repair"}
              </Link>
            </li>
            <li>
              <Link href={serviceHref("sprinkler-pump-replacement", locale)}>
                {isSpanishPage ? "Reemplazo de Bombas de Sprinklers" : "Sprinkler Pump Replacement"}
              </Link>
            </li>
            <li>
              <Link href={serviceHref("sprinkler-timer-installation", locale)}>
                {isSpanishPage ? "Instalación de Temporizadores de Sprinklers" : "Sprinkler Timer Installation"}
              </Link>
            </li>
            <li>
              <Link href={serviceHref("wifi-sprinkler-controller-upgrade", locale)}>
                {isSpanishPage ? "Actualización a Controlador WiFi de Sprinklers" : "WiFi Sprinkler Controller Upgrade"}
              </Link>
            </li>
            <li>
              <Link href={serviceHref("rain-sensor-installation", locale)}>
                {isSpanishPage ? "Instalación de Sensores de Lluvia" : "Rain Sensor Installation"}
              </Link>
            </li>
            <li>
              <Link href={serviceHref("new-irrigation-installation", locale)}>
                {isSpanishPage ? "Instalación Nueva de Irrigación" : "New Irrigation Installation"}
              </Link>
            </li>
            <li>
              <Link href="/services/home-security">
                {isSpanishPage ? "Instalación de Cámaras de Seguridad" : "Security Camera Installation"}
              </Link>
            </li>
            <li>
              <Link href="/services/landscaping">
                {isSpanishPage ? "Jardinería" : "Landscaping"}
              </Link>
            </li>
          </ul>
        </div>


        {/* Contact Info */}
        <div className="footer-contact">
          <p>
            <strong>CallTechCare</strong>
            <br />
            {isSpanishPage
              ? "Sirviendo al sur de Florida — desde Sunrise hasta Cutler Bay"
              : "Serving South Florida — from Sunrise to Cutler Bay"}
          </p>
          <p>
            📞 <a href="tel:+17863662729" title="Call CallTechCare">(786) 366-2729</a>
            <br />
            ✉️{" "}
              <a href="mailto:support@calltechcare.com" title="Email CallTechCare support">
              support@calltechcare.com
            </a>
          </p>
          <p>
            {isSpanishPage ? "Lun–Sáb: 8 AM – 7 PM" : "Mon–Sat: 8 AM – 7 PM"}
            <br />
            {isSpanishPage ? "Dom: 9 AM – 6 PM" : "Sun: 9 AM – 6 PM"}
          </p>
          <div className="footer-areas">
            <p className="areas-title">{isSpanishPage ? "📍 Áreas de Servicio" : "📍 Service Areas"}</p>
            <p className="areas-list">
              {footerAreas.map((area, i) => (
                <span key={area.href}>
                  {i > 0 && " • "}
                  <Link href={area.href}>{area.name}</Link>
                </span>
              ))}
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
          <p>{isSpanishPage ? "Pago seguro • Desarrollado con Stripe" : "Secure Checkout • Powered by Stripe"}</p>
          <div className="trust-icons">
            <Image
              src="/icons/stripe-white.png"
              alt="Stripe Secure Payments"
              width={60}
              height={20}
              style={{ width: "auto", height: "auto" }}
            />
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
