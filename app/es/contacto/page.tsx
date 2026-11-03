import type { Metadata } from "next";
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
  Zap
} from "lucide-react";

import ContactFaqSectionEs from "./ContactFaqSectionEs";
import ContactMessageSectionEs from "./ContactMessageSectionEs";

/* =========================
   PAGE METADATA
========================= */

export const metadata: Metadata = {
  title: "Contacta a CallTechCare | Reparación de Sprinklers Miami y Broward",

  description: "Contacta a CallTechCare para reparación de sprinklers e irrigación en Miami y Broward. Llama al (786) 366-2729 o envía un mensaje — respondemos dentro de 24 horas.",

  alternates: {
    canonical: "https://www.calltechcare.com/es/contacto",
    languages: {
      es: "https://www.calltechcare.com/es/contacto",
      en: "https://www.calltechcare.com/contact",
      "x-default": "https://www.calltechcare.com/contact",
    },
  },
};

/* =========================
   PAGE COMPONENT
========================= */

export default function ContactoPage() {

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contacta a CallTechCare",
    url: "https://www.calltechcare.com/es/contacto",
    about: {
      "@type": "LocalBusiness",
      name: "CallTechCare",
      telephone: "+1-786-366-2729",
      email: "support@calltechcare.com",
      areaServed: "South Florida"
    }
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

            <div
              className="contact-support-heroIcon"
              aria-hidden="true"
            >
              <Headphones size={34} />
            </div>

            <h1 className="contact-support-title">
              Contacta a CallTechCare para reparación de sprinklers
            </h1>

            <p className="contact-support-subtitle">
              Estamos aquí para ayudarte. Contacta a CallTechCare para
              solicitudes de servicio, cotizaciones o preguntas sobre nuestros
              servicios de sprinklers, irrigación y cámaras de seguridad
              en Miami y el sur de Florida.
            </p>

          </header>
        </div>
      </section>

      {/* Stats */}
      <section
        className="contact-support-section contact-support-statsSection"
        aria-label="Estadísticas de soporte"
      >
        <div className="contact-support-inner">
          <div className="contact-support-stats">

            <div className="contact-support-stat">
              <div className="contact-support-statTop">
                <Zap size={35} strokeWidth={2.2}
                  className="contact-support-statIcon"
                  aria-hidden="true"
                />
                <div className="contact-support-statValue">
                  &lt; 15min
                </div>
              </div>

              <div className="contact-support-statLabel">
                Tiempo promedio de respuesta
              </div>
            </div>

            <div className="contact-support-stat">
              <div className="contact-support-statTop">
                <BadgeCheck size={35} strokeWidth={2.2}
                  className="contact-support-statIcon"
                  aria-hidden="true"
                />
                <div className="contact-support-statValue">
                  98%
                </div>
              </div>

              <div className="contact-support-statLabel">
                Tasa de resolución
              </div>
            </div>

            <div className="contact-support-stat">
              <div className="contact-support-statTop">
                <Users size={35} strokeWidth={2.2}
                  className="contact-support-statIcon"
                  aria-hidden="true"
                />
                <div className="contact-support-statValue">
                  50K+
                </div>
              </div>

              <div className="contact-support-statLabel">
                Clientes felices
              </div>
            </div>

            <div className="contact-support-stat">
              <div className="contact-support-statTop">
                <Clock size={35} strokeWidth={2.2}
                  className="contact-support-statIcon"
                  aria-hidden="true"
                />
                <div className="contact-support-statValue">
                  Lun–Sáb
                </div>
              </div>

              <div className="contact-support-statLabel">
                Disponibilidad de soporte
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Support Options */}
      <section
        className="contact-support-section contact-support-optionsSection"
        aria-label="Opciones de soporte"
      >
        <div className="contact-support-inner">

          <div className="contact-support-options">

            <h2 className="contact-support-optionsTitle">
              ¿Cómo podemos ayudarte?
            </h2>

            <div className="contact-support-grid">

              <a
                className="contact-support-card"
                href="tel:+17863662729"
              >
                <div
                  className="contact-support-cardIcon contact-support-cardIcon--phone"
                  aria-hidden="true"
                >
                  <Phone size={22} />
                </div>

                <h3 className="contact-support-cardTitle">
                  Llámanos
                </h3>

                <p className="contact-support-cardText">
                  Habla con un técnico en vivo
                </p>

                <div className="contact-support-cardLink">
                  +1 (786) 366-2729
                </div>

                <div className="contact-support-cardMeta">
                  Disponible lun–sáb
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
                  Soporte por email
                </h3>

                <p className="contact-support-cardText">
                  Recibe respuesta dentro de 24 horas
                </p>

                <div className="contact-support-cardLink">
                  support@calltechcare.com
                </div>
              </a>

              <Link
                className="contact-support-card"
                href="#contact-faq"
              >
                <div
                  className="contact-support-cardIcon contact-support-cardIcon--faq"
                  aria-hidden="true"
                >
                  <HelpCircle size={22} />
                </div>

                <h3 className="contact-support-cardTitle">
                  Preguntas frecuentes
                </h3>

                <p className="contact-support-cardText">
                  Encuentra respuestas rápidas
                </p>
              </Link>

              <Link
                className="contact-support-card"
                href="/es/solicita-una-cotizacion"
              >
                <div
                  className="contact-support-cardIcon contact-support-cardIcon--quote"
                  aria-hidden="true"
                >
                  <FileText size={22} />
                </div>

                <h3 className="contact-support-cardTitle">
                  Solicita una cotización
                </h3>

                <p className="contact-support-cardText">
                  Recibe un estimado gratis
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
          <ContactFaqSectionEs />
        </div>
      </section>

      {/* Contact Form */}
      <section
        className="contact-support-section contact-message-section"
      >
        <div className="contact-support-inner">
          <ContactMessageSectionEs />
        </div>
      </section>

    </main>
  );
}
