"use client";

import { useState } from "react";
import { Clock, MapPin, PhoneCall } from "lucide-react";
import Link from "next/link";
import SvgIcon from "@/components/common/SvgIcons";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type SubmitStatus =
  | { type: "idle" }
  | { type: "submitting" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export type ContactSideTexts = {
  sideTitle?: string;
  sideSubtitle?: string;
  hoursTitle?: string;
  dayMonFri?: string;
  daySat?: string;
  daySun?: string;
  emergencyNote?: string;
  locationTitle?: string;
  locationCity?: string;
  locationMuted?: string;
  locationsLink?: string;
  emergencyTitle?: string;
  emergencyText?: string;
};

// Side-section copy comes from Sanity when provided; the form labels,
// placeholders, buttons and status messages below stay in code (they are
// interface strings, not page content).
export default function ContactMessageSection({
  locale = "en",
  side,
}: {
  locale?: "en" | "es";
  side?: ContactSideTexts;
}) {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<SubmitStatus>({ type: "idle" });

  const onChange = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();
    const subject = form.subject.trim();
    const message = form.message.trim();

    if (!name || !email || !message) {
      setStatus({ type: "error", message: T.validationError });
      return;
    }

    setStatus({ type: "submitting" });

    try {
      const composedMessage = subject ? `Subject: ${subject}\n\n${message}` : message;

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message: composedMessage }),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string; emailSent?: boolean };

      if (!res.ok || !data.ok) {
        setStatus({ type: "error", message: data.error || T.genericError });
        return;
      }

      if (data.emailSent === false) {
        setStatus({
          type: "success",
          message: T.emailNotConfigured,
        });
      } else {
        setStatus({ type: "success", message: T.success });
      }
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus({ type: "error", message: T.networkError });
    }
  };


  const T =
    locale === "es"
      ? {
          validationError: "Por favor completa nombre, correo y mensaje.",
          genericError: "Algo sali\u00f3 mal. Por favor, int\u00e9ntalo de nuevo.",
          emailNotConfigured:
            "Mensaje recibido. Las notificaciones por email no est\u00e1n configuradas en este entorno, pero tu mensaje se guard\u00f3 correctamente.",
          success:
            "\u00a1Gracias! Recibimos tu mensaje y te responderemos dentro de 24 horas.",
          networkError: "Error de red. Por favor, int\u00e9ntalo de nuevo.",
          formAriaLabel: "Env\u00edanos un mensaje",
          formTitle: "Env\u00edanos un mensaje",
          formSubtitle: "Completa el formulario y te responderemos dentro de 24 horas.",
          nameLabel: "Nombre",
          namePlaceholder: "Tu nombre",
          emailLabel: "Correo electr\u00f3nico",
          emailPlaceholder: "tu@correo.com",
          subjectLabel: "Asunto",
          subjectPlaceholder: "\u00bfEn qu\u00e9 podemos ayudarte?",
          messageLabel: "Mensaje",
          messagePlaceholder: "Cu\u00e9ntanos m\u00e1s sobre tu problema o pregunta...",
          sending: "Enviando...",
          send: "Enviar mensaje",
          sideAriaLabel: "Otras formas de contactarnos",
          sideTitle: "Otras formas de contactarnos",
          sideSubtitle: "Elige el m\u00e9todo que mejor te funcione.",
          hoursTitle: "Horario de servicio",
          dayMonFri: "Lunes \u2013 Viernes",
          daySat: "S\u00e1bado",
          daySun: "Domingo",
          emergencyNote: "Servicio de emergencia durante el horario de servicio",
          locationTitle: "Área de servicio",
          locationCity: "Sur de Florida",
          locationMuted: "Atendemos Miami, Broward y \u00e1reas cercanas",
          locationsLink: "Ver todas las ubicaciones",
          emergencyTitle: "Soporte de emergencia",
          emergencyText:
            "Para problemas urgentes de sprinklers, ll\u00e1manos para prioridad el mismo d\u00eda.",
        }
      : {
          validationError: "Please fill out name, email, and message.",
          genericError: "Something went wrong. Please try again.",
          emailNotConfigured:
            "Message received. Email notifications are not configured in this environment, but your message was saved successfully.",
          success:
            "Thanks! We received your message and will get back to you within 24 hours.",
          networkError: "Network error. Please try again.",
          formAriaLabel: "Send us a message",
          formTitle: "Send Us a Message",
          formSubtitle: "Fill out the form and we\u2019ll get back to you within 24 hours.",
          nameLabel: "Name",
          namePlaceholder: "Your name",
          emailLabel: "Email",
          emailPlaceholder: "your@email.com",
          subjectLabel: "Subject",
          subjectPlaceholder: "How can we help?",
          messageLabel: "Message",
          messagePlaceholder: "Tell us more about your issue or question...",
          sending: "Sending...",
          send: "Send Message",
          sideAriaLabel: "Other ways to reach us",
          sideTitle: "Other Ways to Reach Us",
          sideSubtitle: "Choose the method that works best for you.",
          hoursTitle: "Service Hours",
          dayMonFri: "Monday \u2013 Friday",
          daySat: "Saturday",
          daySun: "Sunday",
          emergencyNote: "Emergency service during business hours",
          locationTitle: "Service Area",
          locationCity: "South Florida",
          locationMuted: "Serving Miami, Broward County, and surrounding areas",
          locationsLink: "View all locations",
          emergencyTitle: "Emergency Support",
          emergencyText: "For urgent sprinkler issues, call us for same-day priority.",
        };

  const S = {
    sideTitle: side?.sideTitle ?? T.sideTitle,
    sideSubtitle: side?.sideSubtitle ?? T.sideSubtitle,
    hoursTitle: side?.hoursTitle ?? T.hoursTitle,
    dayMonFri: side?.dayMonFri ?? T.dayMonFri,
    daySat: side?.daySat ?? T.daySat,
    daySun: side?.daySun ?? T.daySun,
    emergencyNote: side?.emergencyNote ?? T.emergencyNote,
    locationTitle: side?.locationTitle ?? T.locationTitle,
    locationCity: side?.locationCity ?? T.locationCity,
    locationMuted: side?.locationMuted ?? T.locationMuted,
    locationsLink: side?.locationsLink ?? T.locationsLink,
    emergencyTitle: side?.emergencyTitle ?? T.emergencyTitle,
    emergencyText: side?.emergencyText ?? T.emergencyText,
  };

  const isSubmitting = status.type === "submitting";

  return (
    <div className="contact-message">
      <div className="contact-message-grid">
        {/* Left: Form */}
        <section className="contact-message-card" aria-label={T.formAriaLabel}>
          <header className="contact-message-cardHeader">
            <h2 className="contact-message-title">{T.formTitle}</h2>
            <p className="contact-message-subtitle">{T.formSubtitle}</p>
          </header>

          <form className="contact-message-form" onSubmit={onSubmit}>
            <div className="contact-message-row">
              <label className="contact-message-field">
                <span className="contact-message-label">{T.nameLabel}</span>
                <input
                  className="contact-message-input"
                  value={form.name}
                  onChange={onChange("name")}
                  placeholder={T.namePlaceholder}
                  autoComplete="name"
                />
              </label>

              <label className="contact-message-field">
                <span className="contact-message-label">{T.emailLabel}</span>
                <input
                  className="contact-message-input"
                  value={form.email}
                  onChange={onChange("email")}
                  placeholder={T.emailPlaceholder}
                  autoComplete="email"
                  inputMode="email"
                />
              </label>
            </div>

            <label className="contact-message-field">
              <span className="contact-message-label">{T.subjectLabel}</span>
              <input
                className="contact-message-input"
                value={form.subject}
                onChange={onChange("subject")}
                placeholder={T.subjectPlaceholder}
              />
            </label>

            <label className="contact-message-field">
              <span className="contact-message-label">{T.messageLabel}</span>
              <textarea
                className="contact-message-textarea"
                value={form.message}
                onChange={onChange("message")}
                placeholder={T.messagePlaceholder}
                rows={6}
              />
            </label>

            <button className="contact-message-submit" type="submit" disabled={isSubmitting}>
              <SvgIcon name="paper-plane" size={18} className="contact-message-submitIcon" />
              {isSubmitting ? T.sending : T.send}
            </button>

            {status.type === "error" && (
              <div className="contact-message-status contact-message-status--error" role="alert">
                {status.message}
              </div>
            )}
            {status.type === "success" && (
              <div className="contact-message-status contact-message-status--success" role="status">
                {status.message}
              </div>
            )}
          </form>
        </section>

        {/* Right: Other ways */}
        <section className="contact-message-side" aria-label={T.sideAriaLabel}>
          <header className="contact-message-sideHeader">
            <h2 className="contact-message-title">{S.sideTitle}</h2>
            <p className="contact-message-subtitle">{S.sideSubtitle}</p>
          </header>

          <div className="contact-message-sideStack">
            <div className="contact-message-sideCard">
              <div className="contact-message-sideCardTitle">
                <Clock size={18} className="contact-message-sideIcon" aria-hidden="true" />
                {S.hoursTitle}
              </div>

              <div className="contact-message-hours">
                <div className="contact-message-hoursRow">
                  <div className="contact-message-hoursDay">{S.dayMonFri}</div>
                  <div className="contact-message-hoursTime">8:00 AM – 7:00 PM</div>
                </div>
                <div className="contact-message-hoursRow">
                  <div className="contact-message-hoursDay">{S.daySat}</div>
                  <div className="contact-message-hoursTime">8:00 AM – 7:00 PM</div>
                </div>
                <div className="contact-message-hoursRow">
                  <div className="contact-message-hoursDay">{S.daySun}</div>
                  <div className="contact-message-hoursTime">9:00 AM – 6:00 PM</div>
                </div>
              </div>

              <div className="contact-message-sideDivider" />
              <div className="contact-message-sideNote">
                <span className="contact-message-sideNoteIcon" aria-hidden="true">📞</span>
                  {S.emergencyNote}
              </div>
            </div>

            <div className="contact-message-sideCard">
              <div className="contact-message-sideCardTitle">
                <MapPin size={18} className="contact-message-sideIcon" aria-hidden="true" />
                {S.locationTitle}
              </div>

              <div className="contact-message-location">
                <div>{S.locationCity}</div>
                <div className="contact-message-locationMuted">{S.locationMuted}</div>
              </div>

              <Link className="contact-message-sideLink" href="/locations">
                {S.locationsLink}
              </Link>
            </div>

            <a className="contact-message-sideCard contact-message-sideCard--emergency" href="tel:+17863662729">
              <div className="contact-message-sideCardTitle">
                <PhoneCall size={18} className="contact-message-sideIcon" aria-hidden="true" />
                {S.emergencyTitle}
              </div>

              <div className="contact-message-emergencyText">
                {S.emergencyText}
              </div>
              <div className="contact-message-emergencyNumber">+1 (786) 366-2729</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
