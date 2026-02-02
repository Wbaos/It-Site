import { Metadata } from "next";
import Link from "next/link";
import SvgIcon from "@/components/common/SvgIcons";

export const metadata: Metadata = {
    title: "Terms of Service | CallTechCare",
    description:
        "Review CallTechCare's Terms of Service outlining your rights and obligations when using our website or IT support services.",
};

export default function TermsAndConditionsPage() {
    return (
        <section className="legal-wrapper terms-wrapper">
            <div className="terms-hero">
                <div className="terms-inner terms-hero-inner">
                    <Link href="/" className="legal-back terms-back">
                        <SvgIcon name="chevron-left" size={18} color="var(--brand-teal)" />
                        Back to Home
                    </Link>

                    <div className="terms-hero-titleRow">
                        <SvgIcon name="document" size={34} className="terms-hero-icon" />
                        <div className="terms-hero-titleCol">
                            <h1 className="terms-hero-title">Terms of Service</h1>
                            <p className="terms-hero-updated">Last updated: February 2, 2026</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="terms-bodySection">
                <div className="terms-inner terms-body">
                    <div className="legal-card">
                        <p>
                            Welcome to <strong>CallTechCare</strong>. By accessing or using our website
                            or services, you agree to be bound by these Terms of Service. Please read
                            them carefully before using our platform.
                        </p>
                    </div>

                    <div className="terms-steps">
                        <div className="terms-step">
                            <div className="terms-step-header">
                                <span className="terms-step-badge">1</span>
                                <h2>Acceptance of Terms</h2>
                            </div>
                            <p>
                                By accessing and using CallTechCare services, you acknowledge that you
                                have read, understood, and agree to be bound by these Terms of Service
                                and our Privacy Policy.
                            </p>
                            <p>If you do not accept these terms, please do not use our services.</p>
                        </div>

                        <div className="terms-step">
                            <div className="terms-step-header">
                                <span className="terms-step-badge">2</span>
                                <h2>Services Description</h2>
                            </div>
                            <p>
                                CallTechCare provides professional technical support and home IT
                                services, including (but not limited to):
                            </p>
                            <ul>
                                <li>Remote and on-site troubleshooting</li>
                                <li>Device setup and configuration</li>
                                <li>Network and Wi‑Fi support</li>
                                <li>Software installation and optimization</li>
                                <li>General IT consulting</li>
                            </ul>
                        </div>

                        <div className="terms-step">
                            <div className="terms-step-header">
                                <span className="terms-step-badge">3</span>
                                <h2>Service Appointments</h2>
                            </div>

                            <p className="legal-highlight">Scheduling</p>
                            <p>
                                Service appointments can be scheduled through our website. Confirmation
                                will be provided via email.
                            </p>

                            <p className="legal-highlight">Cancellations</p>
                            <p>
                                You may cancel or reschedule an appointment up to 24 hours before the
                                scheduled time without penalty.
                            </p>

                            <p className="legal-highlight">No-shows</p>
                            <p>
                                If you are not available at the scheduled time, a rescheduling fee may
                                apply.
                            </p>
                        </div>

                        <div className="terms-step">
                            <div className="terms-step-header">
                                <span className="terms-step-badge">4</span>
                                <h2>Pricing and Payment</h2>
                            </div>

                            <p>
                                Prices displayed on our website are estimates. Final pricing may be
                                confirmed before work begins.
                            </p>
                            <p>
                                Payments are securely processed via Stripe. Subscriptions renew
                                automatically unless canceled before the next billing cycle.
                            </p>

                            <p className="legal-highlight">Additional charges may apply for:</p>
                            <ul>
                                <li>Parts and materials (quoted separately)</li>
                                <li>After-hours or emergency service</li>
                                <li>Travel beyond standard service areas</li>
                            </ul>
                        </div>

                        <div className="terms-step">
                            <div className="terms-step-header">
                                <span className="terms-step-badge">5</span>
                                <h2>Warranty and Guarantees</h2>
                            </div>

                            <div className="terms-callout">
                                <p className="terms-callout-title">30‑Day Workmanship Warranty</p>
                                <p className="terms-callout-text">
                                    All services come with a 30‑day warranty covering workmanship issues.
                                    If a problem is related to our work within this period, we will return
                                    to fix it at no additional charge.
                                </p>
                            </div>
                        </div>

                        <div className="terms-step">
                            <div className="terms-step-header">
                                <span className="terms-step-badge">6</span>
                                <h2>Limitation of Liability</h2>
                            </div>
                            <p>CallTechCare is not liable for:</p>
                            <ul>
                                <li>Pre-existing damage to equipment or property</li>
                                <li>Data loss during computer repairs (customers should back up data)</li>
                                <li>Damage caused by customer misuse after service completion</li>
                                <li>Third-party equipment defects or failures</li>
                            </ul>
                            <p>
                                Our total liability shall not exceed the amount paid for the specific
                                service in question.
                            </p>
                        </div>

                        <div className="terms-step">
                            <div className="terms-step-header">
                                <span className="terms-step-badge">7</span>
                                <h2>User Responsibilities</h2>
                            </div>
                            <p>You agree to:</p>
                            <ul>
                                <li>Provide accurate information when booking services</li>
                                <li>Ensure safe access to the service location</li>
                                <li>Be present for any authorized adult present during appointments</li>
                                <li>Inform technicians of safety concerns or hazards</li>
                            </ul>
                        </div>

                        <div className="terms-step">
                            <div className="terms-step-header">
                                <span className="terms-step-badge">8</span>
                                <h2>Changes to Terms</h2>
                            </div>
                            <p>
                                We reserve the right to modify these terms at any time. Changes will be
                                posted on this page with an updated revision date. Continued use of our
                                services after changes constitutes acceptance of the updated terms.
                            </p>
                        </div>
                    </div>

                    <div className="legal-card legal-contact-card legal-contact-layout">
                        <div className="legal-contact-icon-col">
                            <SvgIcon name="mail" size={64} className="legal-card-icon" />
                        </div>
                        <div className="legal-contact-content-col">
                            <h2>Questions About These Terms?</h2>
                            <p>
                                If you have any questions about these Terms of Service, please contact us:
                            </p>
                            <p >
                                <strong >Email:</strong>{" "}
                                <a href="mailto:support@calltechcare.com" className="terms-contact-item-email">support@calltechcare.com</a>
                            </p>
                            <p >
                                <strong>Phone:</strong> 
                                <a href="tel:+17863662729" className="terms-contact-item-phone"> (786) 366-2729</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
