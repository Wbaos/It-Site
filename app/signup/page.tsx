"use client";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

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
      //  Create user
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        //  Auto-login the user
        const loginRes = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (loginRes?.error) {
          setStatus("⚠️ Account created, but login failed. Please log in.");
          router.push("/login");
        } else {
          setStatus(" Account created and logged in!");
          //  Redirect to homepage
          router.push("/");
        }
      } else {
        setStatus(` ${data.error || "Something went wrong"}`);
      }
    } catch {
      setStatus(" Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="section login">
      <div className="site-container">
        <div className="login-card">
          <button
            type="button"
            className="back-btn"
            aria-label="Go back"
            onClick={() => router.back()}
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          <h2 className="login-heading">Sign Up</h2>

          <form onSubmit={handleSubmit} className="login-form">
            <input
              id="name"
              name="name"
              placeholder="Full Name"
              className="input"
              required
            />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className="input"
              required
            />
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              className="input"
              required
            />
            <button
              type="submit"
              className="btn btn-primary wide"
              disabled={busy}
            >
              {busy ? "Registering..." : "Sign Up"}
            </button>
          </form>

          {status && <p className="login-status">{status}</p>}
        </div>
      </div>
    </section>
  );
}
