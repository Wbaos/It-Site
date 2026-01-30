"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import SvgIcon from "@/components/common/SvgIcons";

export default function SignUpPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setStatus(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        const loginRes = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (loginRes?.error) {
          setStatus("⚠️ Account created, but login failed. Please log in.");
          router.push("/login");
        } else {
          setStatus("Account created and logged in!");
          router.push("/");
        }
      } else {
        setStatus(data.error || "Something went wrong");
      }
    } catch {
      setStatus("Network error");
    } finally {
      setBusy(false);
    }
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
        <SvgIcon name="chevron-left" size={18} color="var(--brand-teal)" />
        Back
        </button>

      </div>

      {/* ==== Signup Card ==== */}
      <div className="login-box">
        <h2 className="login-title">Create an Account</h2>
        <p className="login-subtitle">Join us in just a minute</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="input-label">Full Name</label>
          <input
            id="name"
            name="name"
            placeholder="Your Name"
            className="input-field"
            required
          />

          <label className="input-label">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            className="input-field"
            required
          />

          <label className="input-label">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="********"
            className="input-field"
            required
          />

          <button
            type="submit"
            className="btn-submit"
            disabled={busy}
          >
            {busy ? "Registering..." : "Sign Up"}
          </button>
        </form>

        {status && (
          <p
            className={`login-status ${
              /invalid|error|already|exists|taken|wrong|network/i.test(status)
                ? "error"
                : "success"
            }`}
          >
            {status}
          </p>
        )}


        <p className="signup-wrapper">
          Already have an account?{" "}
          <Link href="/login" className="signup-link">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}
