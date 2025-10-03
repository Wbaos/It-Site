"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus(null);

    try {
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("✅ Reset link sent to your email.");
      } else {
        setStatus(`⚠️ ${data.error || "Something went wrong."}`);
      }
    } catch (err) {
      setStatus("⚠️ Server error. Try again later.");
    }

    setBusy(false);
  }

  return (
    <section className="section login">
      <div className="site-container">
        <div className="login-card">
          <h2 className="login-heading">Forgot Password</h2>
          <p className="text-center mb-4">
            Enter your email address and we’ll send you a link to reset your
            password.
          </p>

          <form onSubmit={onSubmit} className="login-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="input"
              required
            />

            <button
              type="submit"
              className="btn btn-primary wide"
              disabled={busy}
            >
              {busy ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {status && <p className="login-status mt-3">{status}</p>}
        </div>
      </div>
    </section>
  );
}
