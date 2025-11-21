"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SvgIcon from "@/components/common/SvgIcons";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

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
        setStatus("Reset link sent to your email.");
      } else {
        setStatus(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("Server error. Try again later.");
    }

    setBusy(false);
  }

  return (
    <section className="login-wrapper">

      {/* ==== Back Button ==== */}
      <div className="login-back-container">
        <button
          type="button"
          onClick={() => router.back()}
          className="single-blog-back btn-reset"
        >
          <SvgIcon name="chevron-left" size={18} color="#14b8a6" />
          Back
        </button>
      </div>

      {/* ==== FORGOT PASSWORD CARD ==== */}
      <div className="login-box">
        <h2 className="login-title">Forgot Password</h2>
        <p className="login-subtitle">
          Enter your email to receive a password reset link.
        </p>

        <form onSubmit={onSubmit} className="login-form">
          <label className="input-label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="input-field"
            required
          />

          <button type="submit" className="btn-submit" disabled={busy}>
            {busy ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {status && (
          <p
            className={`login-status mt-3 ${
              status.toLowerCase().includes("sent") ? "success" : "error"
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </section>
  );
}
