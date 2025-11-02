import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "FAQ – CallTechCare | Tech Support for Seniors & Homes",
    description:
        "Find answers to frequently asked questions about CallTechCare services, pricing, and on-site support in South Florida.",
};

export default function FAQPage() {
    const faqs = [
        {
            q: "What areas do you serve?",
            a: "We currently provide in-home and remote tech support services from Broward County down to Homestead, Florida.",
        },
        {
            q: "Do you help seniors with basic tech setups?",
            a: "Absolutely! We specialize in patient, step-by-step assistance for seniors—whether it's setting up phones, computers, smart TVs, or Wi-Fi.",
        },
        {
            q: "How can I book a service?",
            a: "You can book directly on our website using the 'Book Now' button or call us at (786) 366-2729 to schedule an appointment.",
        },
        {
            q: "What payment methods do you accept?",
            a: "We accept all major credit and debit cards through Stripe’s secure checkout. You can also pay at the end of your appointment.",
        },
        {
            q: "Do you offer monthly or yearly plans?",
            a: "Yes! Our CallTechCare Plans let you enjoy ongoing tech support for a flat monthly or annual rate. Perfect for seniors who want reliable help anytime.",
        },
        {
            q: "Can I get remote help instead of an in-person visit?",
            a: "Yes. Many issues can be resolved through our secure remote session software, saving you time and travel costs.",
        },
        {
            q: "What if I’m not satisfied with the service?",
            a: "Your satisfaction is our priority. If an issue wasn’t fully resolved, we’ll make it right or credit your account for a follow-up visit.",
        },
    ];

    return (
        <main className="faq-page">
            <h1 className="faq-title">Frequently Asked Questions</h1>
            <p className="faq-intro">
                Here are answers to some of the most common questions about our
                services, pricing, and support process. We’re here to make tech easy for
                everyone!
            </p>

            <div className="faq-container">
                {faqs.map((faq, i) => (
                    <details key={i} className="faq-item">
                        <summary className="faq-question">
                            {faq.q}
                            <span className="faq-arrow">▼</span>
                        </summary>
                        <p className="faq-answer">{faq.a}</p>
                    </details>
                ))}
            </div>

            <section className="faq-contact">
                <p>
                    Still have questions?{" "}
                    <a href="/contact" className="faq-link">
                        Contact our team
                    </a>{" "}
                    and we’ll be happy to help.
                </p>
            </section>
        </main>
    );
}
