import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | CallTechCare",
    description:
        "Learn how CallTechCare collects, uses, and protects your personal information while providing tech support services.",
};

export default function PrivacyPolicyPage() {
    return (
        <section className="legal-section">
            <h1 className="legal-title">Privacy Policy</h1>
            <p className="legal-date">Last updated: October 31, 2025</p>

            <div className="legal-content">
                <p>
                    Welcome to <strong>CallTechCare</strong> (“we,” “our,” “us”). We respect your
                    privacy and are committed to protecting your personal information. This
                    Privacy Policy explains how we collect, use, and safeguard your data when you
                    visit our website or use our services.
                </p>

                <h2>1. Information We Collect</h2>
                <ul>
                    <li>Personal details such as name, email, phone number, and address.</li>
                    <li>Payment data processed securely through Stripe (we don’t store cards).</li>
                    <li>Technical data such as IP address, browser type, and cookies.</li>
                </ul>

                <h2>2. How We Use Information</h2>
                <p>
                    We use your data to provide and improve our IT support services, process
                    payments, communicate with you, and enhance your overall experience.
                </p>

                <h2>3. Data Protection</h2>
                <p>
                    We use SSL encryption and secure hosting to protect your data. Only
                    authorized personnel have access to your information.
                </p>

                <h2>4. Your Rights</h2>
                <p>
                    You can request access, correction, or deletion of your data by emailing{" "}
                    <a href="mailto:support@calltechcare.com">support@calltechcare.com</a>.
                </p>

                <h2>5. Contact</h2>
                <p>
                    For questions regarding this policy, contact{" "}
                    <a href="mailto:support@calltechcare.com">support@calltechcare.com</a>.
                </p>
            </div>
        </section>
    );
}
