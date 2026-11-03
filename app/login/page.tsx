"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react"; // 👈 ADD THIS
import SvgIcon from "@/components/common/SvgIcons";

function LoginContent() {
  const pathname = usePathname();
  const isSpanish = pathname === "/es" || (pathname ?? "").startsWith("/es/");

  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👈 state for eye toggle
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  async function onSubmit(formData: FormData) {
    setBusy(true);
    setStatus(null);

    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setStatus(isSpanish ? "Correo o contraseña inválidos" : "Invalid email or password");
    } else {
      setStatus(isSpanish ? "¡Inicio de sesión exitoso!" : "Login successful!");
      router.push(callbackUrl);
    }

    setBusy(false);
  }

  return (
    <section className="login-wrapper">
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

      {/* ==== LOGIN CARD ==== */}
      <div className="login-box">
        <h2 className="login-title">{isSpanish ? "Bienvenido de Nuevo" : "Welcome Back"}</h2>
        <p className="login-subtitle">{isSpanish ? "Inicia sesión en tu cuenta" : "Sign in to your account"}</p>

        <form action={onSubmit} className="login-form">
          {/* Email */}
          <label className="input-label">{isSpanish ? "Correo Electrónico" : "Email"}</label>
          <input
            type="email"
            name="email"
            placeholder={isSpanish ? "tu@correo.com" : "your@email.com"}
            className="input-field"
            required
          />

          {/* Password */}
          <label className="input-label">{isSpanish ? "Contraseña" : "Password"}</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="********"
              className="input-field password-input"
              required
            />

            <button
              type="button"
              className="password-toggle-btn btn-reset"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={isSpanish ? "Mostrar u ocultar contraseña" : "Toggle password visibility"}
            >
              {showPassword ? (
                <EyeOff size={18} strokeWidth={1.8} />
              ) : (
                <Eye size={18} strokeWidth={1.8} />
              )}
            </button>
          </div>

          {/* Submit */}
          <button type="submit" className="btn-submit" disabled={busy}>
            {busy ? (isSpanish ? "Iniciando sesión..." : "Logging in...") : (isSpanish ? "Iniciar Sesión" : "Login")}
          </button>
        </form>

        <p className="forgot-wrapper">
          <Link href="/forgot-password" className="forgot-link">
            {isSpanish ? "¿Olvidaste tu contraseña?" : "Forgot your password?"}
          </Link>
        </p>

        {status && (
          <p
            className={`login-status ${
              /invalid|inválid|error|already|exists|taken|wrong/i.test(status)
                ? "error"
                : "success"
            }`}
          >
            {status}
          </p>
        )}



        <p className="signup-wrapper">
          {isSpanish ? "¿No tienes una cuenta?" : "Don’t have an account?"}{" "}
          <Link href="/signup" className="signup-link">
            {isSpanish ? "Regístrate" : "Sign up"}
          </Link>
        </p>
      </div>
    </section>
  );
}

export default function LoginPage() {
  const pathname = usePathname();
  const isSpanish = pathname === "/es" || (pathname ?? "").startsWith("/es/");

  return (
    <Suspense fallback={<div>{isSpanish ? "Cargando..." : "Loading..."}</div>}>
      <LoginContent />
    </Suspense>
  );
}
