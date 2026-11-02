import Image from "next/image";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import SvgIcon from "./common/SvgIcons";

export default function Footer() {
  const year = new Date().getFullYear();

  const footerAreas = [
    { name: "Sunrise", href: "/sprinkler-repair-sunrise" },
    { name: "Fort Lauderdale", href: "/sprinkler-repair-fort-lauderdale" },
    { name: "Dania Beach", href: "/sprinkler-repair-dania-beach" },
    { name: "Weston", href: "/sprinkler-repair-weston" },
    { name: "Davie", href: "/sprinkler-repair-davie" },
    { name: "Southwest Ranches", href: "/sprinkler-repair-southwest-ranches" },
    { name: "Hollywood", href: "/sprinkler-repair-hollywood" },
    { name: "West Park", href: "/sprinkler-repair-west-park" },
    { name: "Pembroke Pines", href: "/sprinkler-repair-pembroke-pines" },
    { name: "Miramar", href: "/sprinkler-repair-miramar" },
    { name: "Miami Gardens", href: "/sprinkler-repair-miami-gardens" },
    { name: "Miami Lakes", href: "/sprinkler-repair-miami-lakes" },
    { name: "Country Club", href: "/sprinkler-repair-country-club" },
    { name: "Aventura", href: "/sprinkler-repair-aventura" },
    { name: "Sunny Isles Beach", href: "/sprinkler-repair-sunny-isles-beach" },
    { name: "North Miami", href: "/sprinkler-repair-north-miami" },
    { name: "Surfside", href: "/sprinkler-repair-surfside" },
    { name: "North Bay Village", href: "/sprinkler-repair-north-bay-village" },
    { name: "Miami Beach", href: "/sprinkler-repair-miami-beach" },
    { name: "Hialeah", href: "/sprinkler-repair-hialeah" },
    { name: "Doral", href: "/sprinkler-repair-doral" },
    { name: "Fontainebleau", href: "/sprinkler-repair-fontainebleau" },
    { name: "Tamiami", href: "/sprinkler-repair-tamiami" },
    { name: "Miami", href: "/sprinkler-repair-miami" },
    { name: "Coral Gables", href: "/sprinkler-repair-coral-gables" },
    { name: "Key Biscayne", href: "/sprinkler-repair-key-biscayne" },
    { name: "Kendall", href: "/sprinkler-repair-kendall" },
    { name: "Kendale Lakes", href: "/sprinkler-repair-kendale-lakes" },
    { name: "Country Walk", href: "/sprinkler-repair-country-walk" },
    { name: "Cutler Bay", href: "/sprinkler-repair-cutler-bay" },
  ];

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
              Sprinkler Repair & Irrigation Services in Miami & Broward
          </p>
        </div>

        {/* Navigation */}
        <nav className="footer-nav" aria-label="Footer Navigation">
          <Link href="/#services">Services</Link>
          <Link href="/#how">How It Works</Link>
          {/* <Link href="/#pricing">Pricing</Link> */}
          <Link href="/blog">Blog</Link>
          <Link href="/locations">Service Areas</Link>
          <Link href="/#contact">Contact</Link>
          <Link href="/about">About Us</Link>
          <Link href="/faq">FAQ</Link>
        </nav>

        {/* Services List (SEO) */}
        <div className="footer-services">
          <p className="footer-services-title">
            Popular Services in Miami & Broward
          </p>

          <ul className="footer-services-list">
            <li>
              <Link href="/sprinkler-repair-miami">
                Sprinkler Repair Miami
              </Link>
            </li>
            <li>
              <Link href="/services/sprinkler-repair-and-installation">
                Sprinkler Repair & Irrigation
              </Link>
            </li>
            <li>
              <Link href="/services/sprinkler-leak-repair">
                Sprinkler Leak Repair
              </Link>
            </li>
            <li>
              <Link href="/services/sprinkler-valve-repair">
                Sprinkler Valve Repair
              </Link>
            </li>
            <li>
              <Link href="/services/sprinkler-pump-replacement">
                Sprinkler Pump Replacement
              </Link>
            </li>
            <li>
              <Link href="/services/sprinkler-timer-installation">
                Sprinkler Timer Installation
              </Link>
            </li>
            <li>
              <Link href="/services/wifi-sprinkler-controller-upgrade">
                WiFi Sprinkler Controller Upgrade
              </Link>
            </li>
            <li>
              <Link href="/services/rain-sensor-installation">
                Rain Sensor Installation
              </Link>
            </li>
            <li>
              <Link href="/services/new-irrigation-installation">
                New Irrigation Installation
              </Link>
            </li>
            <li>
              <Link href="/services/home-security">
                Security Camera Installation
              </Link>
            </li>
            <li>
              <Link href="/services/wifi-and-internet">
                Wi-Fi & Internet Support
              </Link>
            </li>
            <li>
              <Link href="/services/computer-and-printers">
                Computer & Printer Support
              </Link>
            </li>
          </ul>
        </div>


        {/* Contact Info */}
        <div className="footer-contact">
          <p>
            <strong>CallTechCare</strong>
            <br />
            Serving South Florida — from Sunrise to Cutler Bay
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
            Mon–Sat: 8 AM – 7 PM
            <br />
            Sun: 9 AM – 6 PM
          </p>
          <div className="footer-areas">
            <p className="areas-title">📍 Service Areas</p>
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
          <p>Follow Us</p>
          <div className="social-icons">
            <a
              href="https://www.facebook.com/profile.php?id=61583200677803"
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
          <p>Secure Checkout • Powered by Stripe</p>
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

        <a className="to-top" href="#top" aria-label="Back to top">
          <ArrowUp size={18} />
        </a>
      </div>

      {/* ===== Bottom Row ===== */}
      <div className="site-container footer-bottom">
        <div className="legal">
          <Link href="/privacy-policy" aria-label="Privacy Policy">
            Privacy Policy
          </Link>
          <span>•</span>
          <a href="#cookie-settings" aria-label="Cookie Settings">
            Cookie Settings
          </a>
          <span>•</span>
          <Link href="/terms-and-conditions" aria-label="Terms and Conditions">
            Terms & Conditions
          </Link>
          <span>•</span>
          <Link href="/accessibility" aria-label="Accessibility Statement">
            Accessibility
          </Link>
        </div>

        <p className="copy">
          © {year} CallTechCare. All rights reserved. Built with ❤️ in South Florida.
        </p>
      </div>
    </footer>
  );
}
