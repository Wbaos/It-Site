"use client";
import { useState } from "react";

export default function Contact({
  headline = "Questions? Let’s talk.",
  phone = "(786) 366-2729",
}) {
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
      message: String(formData.get("message") || ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("Thanks! We’ll get back to you within a business day.");
        form.reset();
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const telHref = `tel:${phone.replace(/[^\d+]/g, "")}`;

  return (
    <section id="contact" className="section contact">
      <div className="contact-blob" aria-hidden="true" />
      <div className="site-container">
        <div className="contact-card form">
          <h2 className="contact-heading">{headline}</h2>
          <p className="contact-sub">
            Call us at{" "}
            <a href={telHref} className="contact-link">
              {phone}
            </a>{" "}
            or send a message:
          </p>

          <form
            onSubmit={handleSubmit}
            className="contact-form"
            aria-describedby="contact-help"
          >
            <div className="field">
              <label htmlFor="name" className="label">
                Your name
              </label>
              <input id="name" name="name" className="input" required />
            </div>

            <div className="field">
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="input"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="message" className="label">
                How can we help?
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="textarea"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary wide"
              disabled={busy}
            >
              {busy ? "Sending..." : "Send"}
            </button>

            <p id="contact-help" className="form-hint">
              We typically reply within one business day.
            </p>

            {status && (
              <p className="form-status" role="status" aria-live="polite">
                {status}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
