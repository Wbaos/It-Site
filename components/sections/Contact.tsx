"use client";
import { useState } from "react";

export default function Contact({
  headline = "Get In Touch",
  subtitle = "Have a question? We're here to help.",
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
        setStatus("Thanks! We'll reply shortly.");
        form.reset();
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("Network error. Try again.");
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
              <label className="label">Name</label>
              <input
                name="name"
                className="input"
                placeholder="John Doe"
                required
              />
            </div>

            <div className="field">
              <label className="label">Email</label>
              <input
                name="email"
                className="input"
                type="email"
                placeholder="john@company.com"
                required
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Company</label>
            <input name="company" className="input" placeholder="Your Company" />
          </div>

          <div className="field">
            <label className="label">Message</label>
            <textarea
              name="message"
              className="textarea"
              placeholder="Tell us about your IT needs..."
            />
          </div>

          <button type="submit" className="btn-submit">
            Send Message
          </button>

          {status && <p className="form-status">{status}</p>}
        </form>
      </div>
    </section>
  );
}
