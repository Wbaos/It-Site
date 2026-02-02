import type { Metadata } from "next";
import Link from "next/link";
import SvgIcon from "@/components/common/SvgIcons";

export const metadata: Metadata = {
    title: "Accessibility Statement – CallTechCare",
    description:
        "Accessibility Statement for CallTechCare: Learn about our ongoing efforts to ensure digital accessibility for all users, including seniors and individuals with disabilities.",
};

export default function AccessibilityPage() {
    return (
        <section className="legal-wrapper">
            <div className="legal-container">
                <Link href="/" className="legal-back">
                    <SvgIcon name="chevron-left" size={18} color="var(--brand-teal)" />
                    Back to Home
                </Link>

                <div className="legal-header">
                    <SvgIcon
                        name="document"
                        size={76}
                        color="var(--brand-teal)"
                        className="legal-header-icon"
                    />

                    <h1>Accessibility Statement</h1>
                    <p className="legal-updated">Last Updated: February 2, 2026</p>

                    <p className="legal-intro">
                        At <strong>CallTechCare</strong>, we are committed to making our website
                        and digital services accessible to as many people as possible, including
                        users with disabilities.
                    </p>
                </div>

                <div className="legal-card">
                    <div className="legal-card-header">
                        <SvgIcon name="checkmark-circle" size={38} className="legal-card-icon" />
                        <h2>Our Commitment</h2>
                    </div>
                    <p>
                        We aim to meet or exceed the Web Content Accessibility Guidelines (WCAG)
                        2.1 Level AA and to continuously improve usability for all visitors.
                    </p>
                    <p>
                        Accessibility is an ongoing effort. We periodically review our site and
                        update content and functionality to reduce barriers.
                    </p>
                </div>

                <div className="legal-card">
                    <div className="legal-card-header">
                        <SvgIcon name="laptop" size={38} className="legal-card-icon" />
                        <h2>Accessibility Features & Best Practices</h2>
                    </div>
                    <p className="legal-highlight">We work to support:</p>
                    <ul>
                        <li>Keyboard navigation for key site interactions</li>
                        <li>Clear headings and readable content structure</li>
                        <li>High-contrast styling and legible typography</li>
                        <li>Meaningful link text and labels</li>
                        <li>Responsive layouts for mobile and tablet devices</li>
                    </ul>
                </div>

                <div className="legal-card">
                    <div className="legal-card-header">
                        <SvgIcon name="shield" size={38} className="legal-card-icon" />
                        <h2>Compatibility</h2>
                    </div>
                    <p>
                        We strive to ensure compatibility with modern browsers and assistive
                        technologies, including screen readers and screen magnifiers.
                    </p>
                    <p className="legal-highlight">Recommended setup:</p>
                    <ul>
                        <li>Latest version of Chrome, Edge, Firefox, or Safari</li>
                        <li>Built-in OS accessibility features (Zoom, VoiceOver, Narrator)</li>
                        <li>Updated assistive technology software when available</li>
                    </ul>
                </div>

                <div className="legal-card">
                    <div className="legal-card-header">
                        <SvgIcon name="clipboard" size={38} className="legal-card-icon" />
                        <h2>Known Limitations</h2>
                    </div>
                    <p>
                        While we work hard to maintain an accessible experience, some content may
                        not yet fully conform to WCAG 2.1 AA, especially on newly released features
                        or third‑party embedded components.
                    </p>
                    <p>
                        If you encounter any accessibility barriers, please let us know and we will
                        prioritize a fix.
                    </p>
                </div>

                <div className="legal-card">
                    <div className="legal-card-header">
                        <SvgIcon name="paper-plane" size={38} className="legal-card-icon" />
                        <h2>Feedback & Assistance</h2>
                    </div>
                    <p>
                        If you experience difficulty accessing any part of our website, we can help.
                        Please reach out and include:
                    </p>
                    <ul>
                        <li>The page URL where you experienced the issue</li>
                        <li>What you were trying to do</li>
                        <li>Your browser/device and any assistive technology you use</li>
                    </ul>
                    <p>
                        Email us at <a href="mailto:support@calltechcare.com">support@calltechcare.com</a>
                        {" "}or call <a href="tel:+17863662729">(786) 366-2729</a>.
                    </p>
                </div>

                <div className="legal-card legal-contact-card">
                    <div className="legal-card-header">
                        <SvgIcon name="alert-circle" size={22} className="legal-card-icon" />
                        <h2>Formal Concerns</h2>
                    </div>
                    <p>
                        If you believe we are not meeting accessibility requirements, please contact
                        us directly so we can address your concern promptly.
                    </p>
                </div>
            </div>
        </section>
    );
}
