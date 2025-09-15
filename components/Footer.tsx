import { ArrowUp } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      {/* top row */}
      <div className="site-container footer-top">
        <a
          href="#hero"
          className="footer-brand"
          aria-label="CareTech – back to top"
        >
          CareTech
        </a>

        <nav className="footer-nav" aria-label="Footer">
          <a href="#services">Services</a>
          <a href="#how">How It Works</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
        </nav>

        <a className="to-top" href="#hero" aria-label="Back to top">
          <ArrowUp size={18} />
        </a>
      </div>

      <div className="site-container footer-bottom">
        <p className="copy">© {year} CareTech. All rights reserved.</p>
        <div className="legal">
          <a href="#" aria-label="Privacy policy">
            Privacy
          </a>
          <span>•</span>
          <a href="#" aria-label="Terms of service">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
