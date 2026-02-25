import Image from "next/image";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import SvgIcon from "./common/SvgIcons";

export default function Footer() {
  const year = new Date().getFullYear();

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
              alt="CallTechCare Logo"
              width={250}
              height={250}
              className="footer-logo"
              style={{ objectFit: "contain", objectPosition: "center" }}
            />
          </a>
          <p className="footer-tagline">
              Reliable Tech Support for Homes & Businesses in South Florida
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
          <a href="/about">About Us</a>
          <a href="/faq">FAQ</a>
        </nav>

        {/* Services List (SEO) */}
        <div className="footer-services">
          <p className="footer-services-title">
            🛠️ Tech Services We Offer
          </p>

          <ul className="footer-services-list">
            <li>
              <Link href="/services/tv-mounting-and-setup">
                TV Mounting & Setup
              </Link>
            </li>
            <li>
              <Link href="/services/wifi-and-internet">
                Wi-Fi & Internet Support
              </Link>
            </li>
            <li>
              <Link href="/services/home-security">
                Home Security & Cameras
              </Link>
            </li>
            <li>
              <Link href="/services/smart-home">
                Smart Home Installation
              </Link>
            </li>
            <li>
              <Link href="/services/device-setup">
                Device Setup & Configuration
              </Link>
            </li>
            <li>
              <Link href="/services/computer-and-printers">
                Computer & Printer Support
              </Link>
            </li>
            <li>
              <Link href="/services/senior-help">
                Senior-Friendly Tech Help
              </Link>
            </li>
            <li>
              <Link href="/services/sprinkler-repair-and-installation">
                Irrigation & Sprinkler Services
              </Link>
            </li>
          </ul>
        </div>


        {/* Contact Info */}
        <div className="footer-contact">
          <p>
            <strong>CallTechCare LLC</strong>
            <br />
            Serving South Florida (Broward County to Homestead)
          </p>
          <p>
            📞 <a href="tel:+17863662729">(786) 366-2729</a>
            <br />
            ✉️{" "}
            <a href="mailto:support@calltechcare.com">
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
              Miami • Pembroke Pines • Broward County • Homestead • Miramar •
              Hollywood • Fort Lauderdale • Doral • Kendall • Hialeah • Weston •
              Davie • Sunrise • Cutler Bay • Aventura
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
            />
            <Image src="/icons/ssl.png" alt="SSL Secured" width={24} height={24} />
          </div>
        </div>

        <a className="to-top" href="#top" aria-label="Back to top">
          <ArrowUp size={18} />
        </a>
      </div>

      {/* ===== Bottom Row ===== */}
      <div className="site-container footer-bottom">
        <div className="legal">
          <a href="/privacy-policy" aria-label="Privacy Policy">
            Privacy Policy
          </a>
          <span>•</span>
          <a href="#cookie-settings" aria-label="Cookie Settings">
            Cookie Settings
          </a>
          <span>•</span>
          <a href="/terms-and-conditions" aria-label="Terms and Conditions">
            Terms & Conditions
          </a>
          <span>•</span>
          <a href="/accessibility" aria-label="Accessibility Statement">
            Accessibility
          </a>
        </div>

        <p className="copy">
          © {year} CallTechCare. All rights reserved. Built with ❤️ in South Florida.
        </p>
      </div>
    </footer>
  );
}
