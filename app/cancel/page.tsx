import Link from "next/link";

export default function CancelPage() {
  return (
    <main className="thankyou-container">
      <div className="thankyou-card">
        <h1>❌ Payment Canceled</h1>
        <p>Your payment was not completed.</p>
        <p className="thankyou-note">
          If you still want to confirm your appointment, you can try again anytime.
        </p>

        <Link href="/" className="thankyou-home">
          ⬅️ Return Home
        </Link>
      </div>
    </main>
  );
}
