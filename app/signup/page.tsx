"use client";

import { useState } from "react";

export default function SignupPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(formData: FormData) {
    setBusy(true);
    setStatus(null);

    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    };

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("✅ Account created! You can now log in.");
      } else {
        setStatus(data.error || "❌ Failed to sign up");
      }
    } catch {
      setStatus("⚠️ Network error. Please try again");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="section login">
      <div className="site-container">
        <div className="login-card">
          <h2 className="login-heading">Sign Up</h2>
          <form action={onSubmit} className="login-form">
            <input name="name" placeholder="Name" className="input" required />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input"
              required
            />
            <button
              type="submit"
              className="btn btn-primary wide"
              disabled={busy}
            >
              {busy ? "Signing up..." : "Sign Up"}
            </button>
          </form>
          {status && <p className="login-status">{status}</p>}
        </div>
      </div>
    </section>
  );
}
