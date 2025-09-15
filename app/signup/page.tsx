"use client";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

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

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("✅ Account created successfully. You can log in now.");
        form.reset();
      } else {
        setStatus(`❌ ${data.error || "Something went wrong"}`);
      }
    } catch {
      setStatus("❌ Network error");
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
              autoComplete="name"
            />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className="input"
              required
              autoComplete="email"
            />
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              className="input"
              required
              autoComplete="new-password"
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
