"use client";

import { useState } from "react";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function Contact({
  headline = "Get In Touch",
  subtitle = "Have a question? We're here to help.",
  locale = "en",
}: {
  headline?: string;
  subtitle?: string;
  locale?: "en" | "es";
}) {
  const isSpanish = locale === "es";
  // Same form, same structure in both languages; only the labels,
  // placeholders and status messages change.
  const t = isSpanish
    ? {
        name: "Nombre",
        namePlaceholder: "Juan Pérez",
        email: "Correo Electrónico",
        emailPlaceholder: "juan@empresa.com",
        company: "Empresa",
        companyPlaceholder: "Tu empresa",
        message: "Mensaje",
        messagePlaceholder:
          "Cuéntanos qué necesitas (reparación de sprinklers/irrigación o cámaras de seguridad)...",
        send: "Enviar Mensaje",
        sending: "Enviando...",
        success: "¡Gracias! Te responderemos pronto.",
        error: "Algo salió mal.",
        networkError: "Error de red. Inténtalo de nuevo.",
      }
    : {
        name: "Name",
        namePlaceholder: "John Doe",
        email: "Email",
        emailPlaceholder: "john@company.com",
        company: "Company",
        companyPlaceholder: "Your Company",
        message: "Message",
        messagePlaceholder:
          "Tell us what you need help with (sprinkler repair/irrigation or security cameras)...",
        send: "Send Message",
        sending: "Sending...",
        success: "Thanks! We'll reply shortly.",
        error: "Something went wrong.",
        networkError: "Network error. Try again.",
      };
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setStatus(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      company: String(formData.get("company") || ""),
      message: String(formData.get("message") || ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus(t.success);
        form.reset();

        // Google Ads conversion tracking
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "conversion", {
            send_to: "AW-17496959572/O9vCKjXw4QcENtUmZdB",
          });
        }
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus(data.error || t.error);
      }
    } catch {
      setStatus(t.networkError);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="contact" className="contact">
      <div className="contact-blob" aria-hidden="true"></div>

      <div className="contact-header">
        <h2 className="contact-title">{headline}</h2>
        <p className="contact-desc">{subtitle}</p>
      </div>

      <div className="contact-form-card">
        <form className="contact-form" onSubmit={handleSubmit}>
          
          <div className="form-row">
            <div className="field">
              <label className="label">{t.name}</label>
              <input
                name="name"
                className="input"
                placeholder={t.namePlaceholder}
                required
              />
            </div>

            <div className="field">
              <label className="label">{t.email}</label>
              <input
                name="email"
                className="input"
                type="email"
                placeholder={t.emailPlaceholder}
                required
              />
            </div>
          </div>

          <div className="field">
            <label className="label">{t.company}</label>
            <input
              name="company"
              className="input"
              placeholder={t.companyPlaceholder}
            />
          </div>

          <div className="field">
            <label className="label">{t.message}</label>
            <textarea
              name="message"
              className="textarea"
              placeholder={t.messagePlaceholder}
              required
            />
          </div>

          <button type="submit" className="btn-submit" disabled={busy}>
            {busy ? t.sending : t.send}
          </button>

          {status && <p className="form-status">{status}</p>}
        </form>
      </div>
    </section>
  );
}