"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function onSubmit(formData: FormData) {
    setBusy(true);
    setStatus(null);

    const payload = {
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
    };

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus(" Login successful!");
        router.push(data.redirect || "/");
      } else {
        setStatus(data.error || " Invalid email or password");
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
        <div className="login-card relative">
          <button
            type="button"
            onClick={() => router.back()}
            className="back-btn"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          <h2 className="login-heading text-center">Login</h2>

          <form action={onSubmit} className="login-form mt-6">
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
              {busy ? "Logging in..." : "Login"}
            </button>
          </form>

          {status && <p className="login-status">{status}</p>}
        </div>

        <p className="mt-4 text-center">
          Don’t have an account?{" "}
          <a href="/signup" className="sign-up-link">
            Sign Up
          </a>
        </p>
      </div>
    </section>
  );
}
