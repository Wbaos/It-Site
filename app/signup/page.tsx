"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { signIn } from "next-auth/react";
import SvgIcon from "@/components/common/SvgIcons";

export default function SignUpPage() {
  const pathname = usePathname();
  const isSpanish = pathname === "/es" || (pathname ?? "").startsWith("/es/");

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
          setStatus(isSpanish ? "⚠️ Cuenta creada, pero el inicio de sesión falló. Por favor inicia sesión." : "⚠️ Account created, but login failed. Please log in.");
          router.push(isSpanish ? "/es/iniciar-sesion" : "/login");
        } else {
          setStatus(isSpanish ? "¡Cuenta creada e inicio de sesión exitoso!" : "Account created and logged in!");
          router.push(isSpanish ? "/es/" : "/");
        }
      } else {
        setStatus(data.error || (isSpanish ? "Algo salió mal" : "Something went wrong"));
      }
    } catch {
      setStatus(isSpanish ? "Error de red" : "Network error");
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
        {isSpanish ? "Atrás" : "Back"}
        </button>

      </div>

      {/* ==== Signup Card ==== */}
      <div className="login-box">
        <h2 className="login-title">{isSpanish ? "Crear una Cuenta" : "Create an Account"}</h2>
        <p className="login-subtitle">{isSpanish ? "Únete en solo un minuto" : "Join us in just a minute"}</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="input-label">{isSpanish ? "Nombre Completo" : "Full Name"}</label>
          <input
            id="name"
            name="name"
            placeholder={isSpanish ? "Tu Nombre" : "Your Name"}
            className="input-field"
            required
          />

          <label className="input-label">{isSpanish ? "Correo Electrónico" : "Email"}</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder={isSpanish ? "tu@correo.com" : "your@email.com"}
            className="input-field"
            required
          />

          <label className="input-label">{isSpanish ? "Contraseña" : "Password"}</label>
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
            {busy ? (isSpanish ? "Registrando..." : "Registering...") : (isSpanish ? "Registrarse" : "Sign Up")}
          </button>
        </form>

        {status && (
          <p
            className={`login-status ${
              /invalid|error|already|exists|taken|wrong|network|falló|salió mal/i.test(status)
                ? "error"
                : "success"
            }`}
          >
            {status}
          </p>
        )}


        <p className="signup-wrapper">
          {isSpanish ? "¿Ya tienes una cuenta?" : "Already have an account?"}{" "}
          <Link href={isSpanish ? "/es/iniciar-sesion" : "/login"} className="signup-link">
            {isSpanish ? "Iniciar Sesión" : "Login"}
          </Link>
        </p>
      </div>
    </section>
  );
}
