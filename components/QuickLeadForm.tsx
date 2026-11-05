"use client";

import { useState } from "react";
import { Phone } from "lucide-react";

type Locale = "en" | "es";

type ServiceRef = {
  category?: string;
  group?: string;
  service?: string;
};

// Short lead form shared by the service template and the city template
// (single template per page, EN + ES). Posts to the same /api/quote-request
// endpoint as the full quote flow, so leads land in the same place
// (MongoDB + company notification email + Mailchimp sync) and fire the
// same Google Ads conversion event. Phone always comes from site-settings
// via props — never hardcoded here.
const TEXT: Record<
  Locale,
  {
    title: string;
    sub: string;
    callNow: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successBody: string;
    error: string;
    trust: string;
  }
> = {
  en: {
    title: "Get your free inspection",
    sub: "Tell us what you need and we'll call you back to confirm your visit — same-day appointments within business hours.",
    callNow: "Call now",
    nameLabel: "Your name",
    namePlaceholder: "Jane Smith",
    phoneLabel: "Phone number",
    phonePlaceholder: "(786) 555-1234",
    messageLabel: "What do you need? (optional)",
    messagePlaceholder: "e.g. Two zones not turning on, and a leak near the driveway",
    submit: "Request a callback",
    submitting: "Sending…",
    successTitle: "Thanks!",
    successBody:
      "was received. We'll call you back shortly to confirm your visit.",
    error: "Something went wrong. Please try again or call us.",
    trust: "Free inspection · Same-day within business hours · No obligation",
  },
  es: {
    title: "Pide tu inspección gratis",
    sub: "Cuéntanos qué necesitas y te llamamos para confirmar tu visita — citas el mismo día dentro del horario.",
    callNow: "Llama ahora",
    nameLabel: "Tu nombre",
    namePlaceholder: "María García",
    phoneLabel: "Número de teléfono",
    phonePlaceholder: "(786) 555-1234",
    messageLabel: "¿Qué necesitas? (opcional)",
    messagePlaceholder: "Ej.: dos zonas no encienden y hay una fuga cerca de la entrada",
    submit: "Pide que te llamemos",
    submitting: "Enviando…",
    successTitle: "¡Gracias!",
    successBody:
      "fue recibida. Te llamamos pronto para confirmar tu visita.",
    error: "Algo salió mal. Por favor, inténtalo de nuevo o llámanos.",
    trust: "Inspección gratis · Mismo día dentro del horario · Sin obligación",
  },
};

export default function QuickLeadForm({
  locale = "en",
  service,
  cityName,
  phoneTel,
  phoneDisplay,
}: {
  locale?: Locale;
  service?: ServiceRef;
  cityName?: string;
  phoneTel: string;
  phoneDisplay: string;
}) {
  const t = TEXT[locale];
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const digits = phone.replace(/\D/g, "");
    if (!name.trim() || digits.length < 7) return;
    setSubmitError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/quote-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service,
          contact: { firstName: name.trim(), phone: phone.trim() },
          location: cityName ? { city: cityName } : undefined,
          details: {
            projectDetails: message.trim() || undefined,
            wantsTechnicianVisitFirst: false,
          },
        }),
      });
      if (!res.ok) throw new Error("Failed to submit request");
      const json = (await res.json().catch(() => null)) as {
        success?: boolean;
        referenceNumber?: string;
      } | null;

      // Same Google Ads Contact conversion as the full quote flow.
      if (typeof window !== "undefined") {
        const gtag = (
          window as unknown as { gtag?: (...args: unknown[]) => void }
        ).gtag;
        if (typeof gtag === "function") {
          gtag("event", "conversion", {
            send_to: "AW-17496959572/UHy5CJ-MkbEdENTUmZdB",
          });
        }
      }

      setReferenceNumber(json?.referenceNumber || "");
    } catch (error) {
      console.error("Quick lead form error:", error);
      setSubmitError(t.error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="quick-lead" aria-label={t.title}>
      <div className="quick-lead__card">
        <h2 className="quick-lead__title">{t.title}</h2>
        <p className="quick-lead__sub">{t.sub}</p>

        <a href={`tel:${phoneTel}`} className="quick-lead__call">
          <Phone size={20} aria-hidden="true" />
          <span>
            {t.callNow}: {phoneDisplay}
          </span>
        </a>

        {referenceNumber ? (
          <div className="quick-lead__success" role="status">
            <p className="quick-lead__success-title">
              {t.successTitle} {name.trim()}
            </p>
            <p>
              {locale === "es" ? "Tu solicitud " : "Your request "}
              <strong>{referenceNumber}</strong> {t.successBody}
            </p>
          </div>
        ) : (
          <form className="quick-lead__form" onSubmit={handleSubmit} noValidate>
            <div className="quick-lead__field">
              <label className="quick-lead__label" htmlFor="quick-lead-name">
                {t.nameLabel}
              </label>
              <input
                id="quick-lead-name"
                className="quick-lead__input"
                type="text"
                autoComplete="name"
                placeholder={t.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="quick-lead__field">
              <label className="quick-lead__label" htmlFor="quick-lead-phone">
                {t.phoneLabel}
              </label>
              <input
                id="quick-lead-phone"
                className="quick-lead__input"
                type="tel"
                autoComplete="tel"
                placeholder={t.phonePlaceholder}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="quick-lead__field">
              <label className="quick-lead__label" htmlFor="quick-lead-message">
                {t.messageLabel}
              </label>
              <textarea
                id="quick-lead-message"
                className="quick-lead__input quick-lead__textarea"
                rows={3}
                placeholder={t.messagePlaceholder}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            {submitError && (
              <p className="quick-lead__error" role="alert">
                {submitError}
              </p>
            )}
            <button
              type="submit"
              className="quick-lead__submit"
              disabled={submitting || !name.trim() || phone.replace(/\D/g, "").length < 7}
            >
              {submitting ? t.submitting : t.submit}
            </button>
          </form>
        )}

        <p className="quick-lead__trust">{t.trust}</p>
      </div>
    </section>
  );
}
