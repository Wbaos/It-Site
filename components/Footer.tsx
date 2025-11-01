import Image from "next/image";
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
              src="/logo.svg"
              alt="CallTechCare Logo"
              width={40}
              height={40}
              className="footer-logo"
            />
            <span>CallTechCare</span>
          </a>
          <p className="footer-tagline">
            Reliable Tech Support for Seniors & Homes in South Florida
          </p>
        </div>

        {/* Navigation */}
        <nav className="footer-nav" aria-label="Footer Navigation">
          <a href="/#services">Services</a>
          <a href="/#how">How It Works</a>
          <a href="/#pricing">Pricing</a>
          <a href="/#contact">Contact</a>
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
            {/* <a
              href="https://linkedin.com"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SvgIcon name="linkedin" size={28} />

            </a> */}
            {/* <a
              href="https://youtube.com"
              aria-label="YouTube"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SvgIcon name="youtube" size={28} />

            </a> */}
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
          © {year} CallTechCare. All rights reserved. Built with ❤️ in South
          Florida.
        </p>
      </div>
    </footer>
  );
}
