import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms & Conditions | CallTechCare",
    description:
        "Review CallTechCare's Terms & Conditions outlining your rights and obligations when using our website or IT support services.",
};

export default function TermsAndConditionsPage() {
    return (
        <section className="legal-section">
            <h1 className="legal-title">Terms & Conditions</h1>
            <p className="legal-date">Last updated: October 31, 2025</p>

            <div className="legal-content">
                <p>
                    Welcome to <strong>CallTechCare</strong>. By using our website or booking our
                    services, you agree to these Terms & Conditions. Please read them carefully.
                </p>

                <h2>1. Services</h2>
                <p>
                    CallTechCare provides remote and on-site IT support, troubleshooting, and
                    maintenance for individuals and small businesses within South Florida.
                </p>

                <h2>2. Payments</h2>
                <p>
                    Payments are securely processed via Stripe. Subscriptions renew automatically
                    unless canceled before the next billing cycle. All prices are in USD.
                </p>

                <h2>3. Cancellations & Refunds</h2>
                <p>
                    You can cancel services at least 24 hours before your scheduled appointment.
                    Refunds are available only for unfulfilled or accidental duplicate charges.
                </p>

                <h2>4. User Responsibilities</h2>
                <p>
                    You agree to use our website and services lawfully and responsibly. Misuse or
                    unauthorized access attempts may result in termination of service.
                </p>

                <h2>5. Limitation of Liability</h2>
                <p>
                    CallTechCare is not responsible for indirect or consequential damages arising
                    from service use, software installation, or device repair outcomes.
                </p>

                <h2>6. Governing Law</h2>
                <p>
                    These Terms are governed by the laws of the State of Florida, USA. Any dispute
                    shall be resolved in Florida courts.
                </p>

                <h2>7. Contact</h2>
                <p>
                    For questions about these terms, contact{" "}
                    <a href="mailto:support@calltechcare.com">support@calltechcare.com</a>.
                </p>
            </div>
        </section>
    );
}
