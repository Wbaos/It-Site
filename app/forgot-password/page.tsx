"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import SvgIcon from "@/components/common/SvgIcons";

export default function ForgotPasswordPage() {
  const pathname = usePathname();
  const isSpanish = pathname === "/es" || (pathname ?? "").startsWith("/es/");

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
        setStatus(isSpanish ? "Enlace de restablecimiento enviado a tu correo." : "Reset link sent to your email.");
      } else {
        setStatus(data.error || (isSpanish ? "Algo salió mal." : "Something went wrong."));
      }
    } catch {
      setStatus(isSpanish ? "Error del servidor. Inténtalo más tarde." : "Server error. Try again later.");
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
          <SvgIcon name="chevron-left" size={18} color="var(--brand-teal)" />
          {isSpanish ? "Atrás" : "Back"}
        </button>
      </div>

      {/* ==== FORGOT PASSWORD CARD ==== */}
      <div className="login-box">
        <h2 className="login-title">{isSpanish ? "Olvidé mi Contraseña" : "Forgot Password"}</h2>
        <p className="login-subtitle">
          {isSpanish ? "Ingresa tu correo para recibir un enlace de restablecimiento de contraseña." : "Enter your email to receive a password reset link."}
        </p>

        <form onSubmit={onSubmit} className="login-form">
          <label className="input-label">{isSpanish ? "Correo Electrónico" : "Email"}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isSpanish ? "tu@correo.com" : "you@email.com"}
            className="input-field"
            required
          />

          <button type="submit" className="btn-submit" disabled={busy}>
            {busy ? (isSpanish ? "Enviando..." : "Sending...") : (isSpanish ? "Enviar Enlace de Restablecimiento" : "Send Reset Link")}
          </button>
        </form>

        {status && (
          <p
            className={`login-status mt-3 ${
              status.toLowerCase().includes("sent") || status.toLowerCase().includes("enviado") ? "success" : "error"
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </section>
  );
}
