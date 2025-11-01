import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Accessibility Statement – CallTechCare",
    description:
        "Accessibility Statement for CallTechCare: Learn about our ongoing efforts to ensure digital accessibility for all users, including seniors and individuals with disabilities.",
};

export default function AccessibilityPage() {
    return (
        <main className="accessibility-section">
            <h1 className="accessibility-title">Accessibility Statement</h1>
            <p className="accessibility-date">
                Last updated:{" "}
                {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                })}
            </p>

            <div className="accessibility-content">
                <p>
                    At <strong>CallTechCare</strong>, we are committed to making our
                    website accessible to everyone, including people with disabilities.
                </p>

                <h2>Our Commitment</h2>
                <p>
                    We aim to meet or exceed the requirements of the Web Content
                    Accessibility Guidelines (WCAG) 2.1 Level AA. We continuously test our
                    website to ensure compatibility with assistive technologies and modern
                    browsers.
                </p>

                <h2>Assistance</h2>
                <p>
                    If you experience difficulty accessing any part of our website, please
                    contact us at{" "}
                    <a href="mailto:support@calltechcare.com">
                        support@calltechcare.com
                    </a>{" "}
                    or call us at{" "}
                    <a href="tel:+17863662729">(786) 366-2729</a>. We’ll be happy to help
                    you access the information or service you need.
                </p>

                <h2>Continuous Improvement</h2>
                <p>
                    We welcome your feedback on our accessibility practices. Our goal is
                    to make technology easier and more inclusive for everyone — especially
                    the senior community we proudly serve.
                </p>
            </div>
        </main>
    );
}
