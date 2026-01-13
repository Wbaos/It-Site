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
            href="#hero"
            className="footer-brand"
            aria-label="CallTechCare – back to top"
          >
            <Image
              src="/logo-simple.png"
              alt="CallTechCare Logo"
              width={80}
              height={80}
              className="footer-logo"
              style={{ objectFit: "contain", objectPosition: "center" }}
            />
            <span>CallTechCare</span>
          </a>
          <p className="footer-tagline">
            Reliable Tech Support for Seniors & Homes in South Florida
          </p>
        </div>

        {/* Navigation */}
        <nav className="footer-nav" aria-label="Footer Navigation">
          <Link href="/#services">Services</Link>
          <Link href="/#how">How It Works</Link>
          <Link href="/#pricing">Pricing</Link>
          <Link href="/locations">Locations</Link>
          <Link href="/#contact">Contact</Link>
          <a href="/about">About Us</a>
          <a href="/faq">FAQ</a>
        </nav>

        {/* Contact Info */}
        <div className="footer-contact">
          <p>
            <strong>CallTechCare LLC</strong>
            <br />
            Serving Broward to Homestead, FL
          </p>
          <p>
            📞 <a href="tel:+17863662729">(786) 366-2729</a>
            <br />
            ✉️{" "}
            <a href="mailto:support@calltechcare.com">
              support@calltechcare.com
            </a>
          </p>
          <p>Mon–Sat: 8 AM – 9 PM</p>

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
              href="https://instagram.com"
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

        <a className="to-top" href="#hero" aria-label="Back to top">
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
