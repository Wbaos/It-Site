import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Contact Us – CallTechCare | Tech Support for Seniors & Homes",
    description:
        "Get in touch with CallTechCare for tech support inquiries, quotes, or questions about our services in South Florida.",
};

export default function ContactPage() {
    return (
        <main className="contact-page">
            <h1 className="contact-title">Contact Our Team</h1>
            <p className="contact-intro">
                We’re here to help! Whether you have a question, need tech support, or
                want to learn more about our plans, reach out anytime.
            </p>

            <section className="contact-info">
                <p>
                    📞 <strong>Phone:</strong>{" "}
                    <a href="tel:+17863662729">(786) 366-2729</a>
                </p>
                <p>
                    ✉️ <strong>Email:</strong>{" "}
                    <a href="mailto:support@calltechcare.com">
                        support@calltechcare.com
                    </a>
                </p>
                <p>
                    📍 <strong>Service Area:</strong> Broward to Homestead, FL
                </p>
                <p>
                    🕒 <strong>Hours:</strong> Mon–Sat: 8 AM – 9 PM
                </p>
            </section>

            <section className="contact-footer">
                <p>
                    Prefer to book online?{" "}
                    <Link href="/#contact" className="contact-link">
                        Schedule a service
                    </Link>{" "}
                    anytime.
                </p>
            </section>
        </main>
    );
}
