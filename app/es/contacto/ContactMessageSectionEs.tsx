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

export default function ContactMessageSectionEs() {
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
      setStatus({ type: "error", message: "Por favor completa nombre, correo y mensaje." });
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
        setStatus({ type: "error", message: data.error || "Algo salió mal. Por favor, inténtalo de nuevo." });
        return;
      }

      if (data.emailSent === false) {
        setStatus({
          type: "success",
          message: "Mensaje recibido. Las notificaciones por email no están configuradas en este entorno, pero tu mensaje se guardó correctamente.",
        });
      } else {
        setStatus({ type: "success", message: "¡Gracias! Recibimos tu mensaje y te responderemos dentro de 24 horas." });
      }
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus({ type: "error", message: "Error de red. Por favor, inténtalo de nuevo." });
    }
  };

  const isSubmitting = status.type === "submitting";

  return (
    <div className="contact-message">
      <div className="contact-message-grid">
        {/* Left: Form */}
        <section className="contact-message-card" aria-label="Envíanos un mensaje">
          <header className="contact-message-cardHeader">
            <h2 className="contact-message-title">Envíanos un mensaje</h2>
            <p className="contact-message-subtitle">Completa el formulario y te responderemos dentro de 24 horas.</p>
          </header>

          <form className="contact-message-form" onSubmit={onSubmit}>
            <div className="contact-message-row">
              <label className="contact-message-field">
                <span className="contact-message-label">Nombre</span>
                <input
                  className="contact-message-input"
                  value={form.name}
                  onChange={onChange("name")}
                  placeholder="Tu nombre"
                  autoComplete="name"
                />
              </label>

              <label className="contact-message-field">
                <span className="contact-message-label">Correo electrónico</span>
                <input
                  className="contact-message-input"
                  value={form.email}
                  onChange={onChange("email")}
                  placeholder="tu@correo.com"
                  autoComplete="email"
                  inputMode="email"
                />
              </label>
            </div>

            <label className="contact-message-field">
              <span className="contact-message-label">Asunto</span>
              <input
                className="contact-message-input"
                value={form.subject}
                onChange={onChange("subject")}
                placeholder="¿En qué podemos ayudarte?"
              />
            </label>

            <label className="contact-message-field">
              <span className="contact-message-label">Mensaje</span>
              <textarea
                className="contact-message-textarea"
                value={form.message}
                onChange={onChange("message")}
                placeholder="Cuéntanos más sobre tu problema o pregunta..."
                rows={6}
              />
            </label>

            <button className="contact-message-submit" type="submit" disabled={isSubmitting}>
              <SvgIcon name="paper-plane" size={18} className="contact-message-submitIcon" />
              {isSubmitting ? "Enviando..." : "Enviar mensaje"}
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
        <section className="contact-message-side" aria-label="Otras formas de contactarnos">
          <header className="contact-message-sideHeader">
            <h2 className="contact-message-title">Otras formas de contactarnos</h2>
            <p className="contact-message-subtitle">Elige el método que mejor te funcione.</p>
          </header>

          <div className="contact-message-sideStack">
            <div className="contact-message-sideCard">
              <div className="contact-message-sideCardTitle">
                <Clock size={18} className="contact-message-sideIcon" aria-hidden="true" />
                Horario de oficina
              </div>

              <div className="contact-message-hours">
                <div className="contact-message-hoursRow">
                  <div className="contact-message-hoursDay">Lunes – Viernes</div>
                  <div className="contact-message-hoursTime">8:00 AM – 7:00 PM</div>
                </div>
                <div className="contact-message-hoursRow">
                  <div className="contact-message-hoursDay">Sábado</div>
                  <div className="contact-message-hoursTime">8:00 AM – 7:00 PM</div>
                </div>
                <div className="contact-message-hoursRow">
                  <div className="contact-message-hoursDay">Domingo</div>
                  <div className="contact-message-hoursTime">9:00 AM – 6:00 PM</div>
                </div>
              </div>

              <div className="contact-message-sideDivider" />
              <div className="contact-message-sideNote">
                <span className="contact-message-sideNoteIcon" aria-hidden="true">📞</span>
                  Servicio de emergencia durante el horario de servicio
              </div>
            </div>

            <div className="contact-message-sideCard">
              <div className="contact-message-sideCardTitle">
                <MapPin size={18} className="contact-message-sideIcon" aria-hidden="true" />
                Nuestra ubicación
              </div>

              <div className="contact-message-location">
                <div>Sur de Florida</div>
                <div className="contact-message-locationMuted">Atendemos Miami, Broward y áreas cercanas</div>
              </div>

              <Link className="contact-message-sideLink" href="/locations">
                Ver todas las ubicaciones
              </Link>
            </div>

            <a className="contact-message-sideCard contact-message-sideCard--emergency" href="tel:+17863662729">
              <div className="contact-message-sideCardTitle">
                <PhoneCall size={18} className="contact-message-sideIcon" aria-hidden="true" />
                Soporte de emergencia
              </div>

              <div className="contact-message-emergencyText">
                Para problemas urgentes de sprinklers, llámanos para prioridad el mismo día.
              </div>
              <div className="contact-message-emergencyNumber">+1 (786) 366-2729</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
