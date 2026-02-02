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

export default function ContactMessageSection() {
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
      setStatus({ type: "error", message: "Please fill out name, email, and message." });
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
        setStatus({ type: "error", message: data.error || "Something went wrong. Please try again." });
        return;
      }

      if (data.emailSent === false) {
        setStatus({
          type: "success",
          message: "Message received. Email notifications are not configured in this environment, but your message was saved successfully.",
        });
      } else {
        setStatus({ type: "success", message: "Thanks! We received your message and will get back to you within 24 hours." });
      }
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus({ type: "error", message: "Network error. Please try again." });
    }
  };

  const isSubmitting = status.type === "submitting";

  return (
    <div className="contact-message">
      <div className="contact-message-grid">
        {/* Left: Form */}
        <section className="contact-message-card" aria-label="Send us a message">
          <header className="contact-message-cardHeader">
            <h2 className="contact-message-title">Send Us a Message</h2>
            <p className="contact-message-subtitle">Fill out the form and we’ll get back to you within 24 hours.</p>
          </header>

          <form className="contact-message-form" onSubmit={onSubmit}>
            <div className="contact-message-row">
              <label className="contact-message-field">
                <span className="contact-message-label">Name</span>
                <input
                  className="contact-message-input"
                  value={form.name}
                  onChange={onChange("name")}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </label>

              <label className="contact-message-field">
                <span className="contact-message-label">Email</span>
                <input
                  className="contact-message-input"
                  value={form.email}
                  onChange={onChange("email")}
                  placeholder="your@email.com"
                  autoComplete="email"
                  inputMode="email"
                />
              </label>
            </div>

            <label className="contact-message-field">
              <span className="contact-message-label">Subject</span>
              <input
                className="contact-message-input"
                value={form.subject}
                onChange={onChange("subject")}
                placeholder="How can we help?"
              />
            </label>

            <label className="contact-message-field">
              <span className="contact-message-label">Message</span>
              <textarea
                className="contact-message-textarea"
                value={form.message}
                onChange={onChange("message")}
                placeholder="Tell us more about your issue or question..."
                rows={6}
              />
            </label>

            <button className="contact-message-submit" type="submit" disabled={isSubmitting}>
              <SvgIcon name="paper-plane" size={18} className="contact-message-submitIcon" />
              {isSubmitting ? "Sending..." : "Send Message"}
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
        <section className="contact-message-side" aria-label="Other ways to reach us">
          <header className="contact-message-sideHeader">
            <h2 className="contact-message-title">Other Ways to Reach Us</h2>
            <p className="contact-message-subtitle">Choose the method that works best for you.</p>
          </header>

          <div className="contact-message-sideStack">
            <div className="contact-message-sideCard">
              <div className="contact-message-sideCardTitle">
                <Clock size={18} className="contact-message-sideIcon" aria-hidden="true" />
                Office Hours
              </div>

              <div className="contact-message-hours">
                <div className="contact-message-hoursRow">
                  <div className="contact-message-hoursDay">Monday – Friday</div>
                  <div className="contact-message-hoursTime">8:00 AM – 7:00 PM</div>
                </div>
                <div className="contact-message-hoursRow">
                  <div className="contact-message-hoursDay">Saturday</div>
                  <div className="contact-message-hoursTime">8:00 AM – 7:00 PM</div>
                </div>
                <div className="contact-message-hoursRow">
                  <div className="contact-message-hoursDay">Sunday</div>
                  <div className="contact-message-hoursTime">9:00 AM – 6:00 PM</div>
                </div>
              </div>

              <div className="contact-message-sideDivider" />
              <div className="contact-message-sideNote">
                <span className="contact-message-sideNoteIcon" aria-hidden="true">📞</span>
                Phone support available 24/7
              </div>
            </div>

            <div className="contact-message-sideCard">
              <div className="contact-message-sideCardTitle">
                <MapPin size={18} className="contact-message-sideIcon" aria-hidden="true" />
                Our Location
              </div>

              <div className="contact-message-location">
                <div>South Florida</div>
                <div className="contact-message-locationMuted">Serving Miami, Broward County, and surrounding areas</div>
              </div>

              <Link className="contact-message-sideLink" href="/locations">
                View all locations
              </Link>
            </div>

            <a className="contact-message-sideCard contact-message-sideCard--emergency" href="tel:+17863662729">
              <div className="contact-message-sideCardTitle">
                <PhoneCall size={18} className="contact-message-sideIcon" aria-hidden="true" />
                Emergency Support
              </div>

              <div className="contact-message-emergencyText">
                For urgent issues outside business hours, call our hotline.
              </div>
              <div className="contact-message-emergencyNumber">+1 (786) 366-2729</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
