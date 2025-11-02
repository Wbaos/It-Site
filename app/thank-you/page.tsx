import Link from "next/link";

export default function ThankYouPage() {
    return (
        <main className="thankyou-container">
            <div className="thankyou-card">
                <h1>🎉 Thank You!</h1>
                <p>Your payment was successful and your appointment is now confirmed.</p>

                <p className="thankyou-note">
                    A confirmation email has been sent to you. Our team will contact you shortly
                    to finalize the details.
                </p>

                <Link href="/" className="thankyou-home">
                    ⬅️ Back to Home
                </Link>
            </div>
        </main>
    );
}
