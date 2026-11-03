import Link from "next/link";
import {
  Headphones,
  Phone,
  Mail,
  HelpCircle,
  FileText,
  Clock,
  Users,
  BadgeCheck,
  Zap,
} from "lucide-react";

import ContactFaqSection from "@/app/contact/ContactFaqSection";
import ContactMessageSection from "@/app/contact/ContactMessageSection";

// Single contact template for both languages: the same sections, in the
// same order, with the same components and icons. Only the text changes,
// via `locale`. app/contact/page.tsx renders this with locale="en" and
// app/es/contacto/page.tsx renders this same component with locale="es".
export default function ContactTemplate({
  locale = "en",
}: {
  locale?: "en" | "es";
}) {
  const isEs = locale === "es";

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: isEs ? "Contacta a CallTechCare" : "Contact CallTechCare",
    url: isEs
      ? "https://www.calltechcare.com/es/contacto"
      : "https://www.calltechcare.com/contact",
    about: {
      "@type": "LocalBusiness",
      name: "CallTechCare",
      telephone: "+1-786-366-2729",
      email: "support@calltechcare.com",
      areaServed: "South Florida",
    },
  };

  return (
    <main className="contact-page">
      {/* ContactPage Schema */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactSchema),
        }}
      />

      {/* Hero */}
      <section className="contact-support-section contact-support-heroSection">
        <div className="contact-support-inner">
          <header className="contact-support-hero">
            <div className="contact-support-heroIcon" aria-hidden="true">
              <Headphones size={34} />
            </div>

            <h1 className="contact-support-title">
              {isEs
                ? "Contacta a CallTechCare para reparación de sprinklers"
                : "Contact CallTechCare for Sprinkler Repair"}
            </h1>

            <p className="contact-support-subtitle">
              {isEs
                ? "Estamos aquí para ayudarte. Contacta a CallTechCare para solicitudes de servicio, cotizaciones o preguntas sobre nuestros servicios de sprinklers, irrigación y cámaras de seguridad en Miami y el sur de Florida."
                : "We're here to help. Contact CallTechCare for service requests, quotes, or questions about our sprinkler, irrigation, and security camera services across Miami and South Florida."}
            </p>
          </header>
        </div>
      </section>

      {/* Stats */}
      <section
        className="contact-support-section contact-support-statsSection"
        aria-label={isEs ? "Estadísticas de soporte" : "Support statistics"}
      >
        <div className="contact-support-inner">
          <div className="contact-support-stats">
            <div className="contact-support-stat">
              <div className="contact-support-statTop">
                <Zap
                  size={35}
                  strokeWidth={2.2}
                  className="contact-support-statIcon"
                  aria-hidden="true"
                />
                <div className="contact-support-statValue">24h</div>
              </div>

              <div className="contact-support-statLabel">
                {isEs ? "Tiempo de respuesta" : "Response Time"}
              </div>
            </div>

            <div className="contact-support-stat">
              <div className="contact-support-statTop">
                <BadgeCheck
                  size={35}
                  strokeWidth={2.2}
                  className="contact-support-statIcon"
                  aria-hidden="true"
                />
                <div className="contact-support-statValue">5.0</div>
              </div>

              <div className="contact-support-statLabel">
                {isEs ? "Calificación en Google" : "Google Rating"}
              </div>
            </div>

            <div className="contact-support-stat">
              <div className="contact-support-statTop">
                <Users
                  size={35}
                  strokeWidth={2.2}
                  className="contact-support-statIcon"
                  aria-hidden="true"
                />
                <div className="contact-support-statValue">1500+</div>
              </div>

              <div className="contact-support-statLabel">
                {isEs ? "Clientes felices" : "Happy Customers"}
              </div>
            </div>

            <div className="contact-support-stat">
              <div className="contact-support-statTop">
                <Clock
                  size={35}
                  strokeWidth={2.2}
                  className="contact-support-statIcon"
                  aria-hidden="true"
                />
                <div className="contact-support-statValue">
                  {isEs ? "Lun–Sáb" : "Mon–Sat"}
                </div>
              </div>

              <div className="contact-support-statLabel">
                {isEs ? "Disponibilidad de soporte" : "Support Availability"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section
        className="contact-support-section contact-support-optionsSection"
        aria-label={isEs ? "Opciones de soporte" : "Support options"}
      >
        <div className="contact-support-inner">
          <div className="contact-support-options">
            <h2 className="contact-support-optionsTitle">
              {isEs ? "¿Cómo podemos ayudarte?" : "How Can We Help You?"}
            </h2>

            <div className="contact-support-grid">
              <a className="contact-support-card" href="tel:+17863662729">
                <div
                  className="contact-support-cardIcon contact-support-cardIcon--phone"
                  aria-hidden="true"
                >
                  <Phone size={22} />
                </div>

                <h3 className="contact-support-cardTitle">
                  {isEs ? "Llámanos" : "Call Us"}
                </h3>

                <p className="contact-support-cardText">
                  {isEs
                    ? "Habla con un técnico en vivo"
                    : "Talk to a live technician"}
                </p>

                <div className="contact-support-cardLink">
                  +1 (786) 366-2729
                </div>

                <div className="contact-support-cardMeta">
                  {isEs ? "Disponible lun–sáb" : "Available Mon–Sat"}
                </div>
              </a>

              <a
                className="contact-support-card"
                href="mailto:support@calltechcare.com"
              >
                <div
                  className="contact-support-cardIcon contact-support-cardIcon--mail"
                  aria-hidden="true"
                >
                  <Mail size={22} />
                </div>

                <h3 className="contact-support-cardTitle">
                  {isEs ? "Soporte por email" : "Email Support"}
                </h3>

                <p className="contact-support-cardText">
                  {isEs
                    ? "Recibe respuesta dentro de 24 horas"
                    : "Get a response within 24 hours"}
                </p>

                <div className="contact-support-cardLink">
                  support@calltechcare.com
                </div>
              </a>

              <Link className="contact-support-card" href="#contact-faq">
                <div
                  className="contact-support-cardIcon contact-support-cardIcon--faq"
                  aria-hidden="true"
                >
                  <HelpCircle size={22} />
                </div>

                <h3 className="contact-support-cardTitle">
                  {isEs ? "Preguntas frecuentes" : "FAQs"}
                </h3>

                <p className="contact-support-cardText">
                  {isEs ? "Encuentra respuestas rápidas" : "Find quick answers"}
                </p>
              </Link>

              <Link
                className="contact-support-card"
                href={
                  isEs ? "/es/solicita-una-cotizacion" : "/request-quote"
                }
              >
                <div
                  className="contact-support-cardIcon contact-support-cardIcon--quote"
                  aria-hidden="true"
                >
                  <FileText size={22} />
                </div>

                <h3 className="contact-support-cardTitle">
                  {isEs ? "Solicita una cotización" : "Request a Quote"}
                </h3>

                <p className="contact-support-cardText">
                  {isEs ? "Recibe un estimado gratis" : "Get a free estimate"}
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="contact-faq"
        className="contact-support-section contact-faq-section"
      >
        <div className="contact-support-inner contact-support-inner--narrow">
          <ContactFaqSection locale={locale} />
        </div>
      </section>

      {/* Contact Form */}
      <section className="contact-support-section contact-message-section">
        <div className="contact-support-inner">
          <ContactMessageSection locale={locale} />
        </div>
      </section>
    </main>
  );
}
