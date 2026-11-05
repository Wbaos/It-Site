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
import { getContactPage } from "@/lib/sanityContact";
import { resolveSiteSettings } from "@/lib/sanitySettings";
import {
  getGoogleRatingSummary,
  FALLBACK_GOOGLE_RATING_SUMMARY,
  formatGoogleRating,
} from "@/lib/google-reviews";

// Single contact template for both languages: the same sections, in the
// same order, with the same components and icons. Copy comes from the
// Sanity `contactPage` document; the fallbacks below are the exact
// pre-migration texts, used only if the document is missing a field.

type Locale = "en" | "es";

const STAT_ICONS = [Zap, BadgeCheck, Users, Clock];

const FALLBACK_EN = {
  heroTitle: "Contact CallTechCare for Sprinkler Repair",
  heroSubtitle:
    "We're here to help. Contact CallTechCare for service requests, quotes, or questions about our sprinkler, irrigation, and security camera services across Miami and South Florida.",
  stats: [
    { value: "24h", label: "Response Time" },
    { value: formatGoogleRating(FALLBACK_GOOGLE_RATING_SUMMARY.rating), label: "Google Rating" },
    { value: "1500+", label: "Happy Customers" },
    { value: "Mon–Sun", label: "Support Availability" },
  ],
  optionsTitle: "How Can We Help You?",
  cards: [
    {
      icon: "phone",
      title: "Call Us",
      text: "Talk to a live technician",
      link: "+1 (786) 366-2729",
      meta: "Available Mon–Sun",
    },
    {
      icon: "mail",
      title: "Email Support",
      text: "Get a response within 24 hours",
      link: "support@calltechcare.com",
    },
    { icon: "faq", title: "FAQs", text: "Find quick answers" },
    { icon: "quote", title: "Request a Quote", text: "Get a free inspection" },
  ],
  sideTitle: "Other Ways to Reach Us",
  sideSubtitle: "Choose the method that works best for you.",
  hoursTitle: "Service Hours",
  dayMonFri: "Monday – Friday",
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

const FALLBACK_ES = {
  heroTitle: "Contacta a CallTechCare para reparación de sprinklers",
  heroSubtitle:
    "Estamos aquí para ayudarte. Contacta a CallTechCare para solicitudes de servicio, cotizaciones o preguntas sobre nuestros servicios de sprinklers, irrigación y cámaras de seguridad en Miami y el sur de Florida.",
  stats: [
    { value: "24h", label: "Tiempo de respuesta" },
    { value: formatGoogleRating(FALLBACK_GOOGLE_RATING_SUMMARY.rating), label: "Calificación en Google" },
    { value: "1500+", label: "Clientes felices" },
    { value: "Lun–Dom", label: "Disponibilidad de soporte" },
  ],
  optionsTitle: "¿Cómo podemos ayudarte?",
  cards: [
    {
      icon: "phone",
      title: "Llámanos",
      text: "Habla con un técnico en vivo",
      link: "+1 (786) 366-2729",
      meta: "Disponible lun–dom",
    },
    {
      icon: "mail",
      title: "Soporte por email",
      text: "Recibe respuesta dentro de 24 horas",
      link: "support@calltechcare.com",
    },
    { icon: "faq", title: "Preguntas frecuentes", text: "Encuentra respuestas rápidas" },
    { icon: "quote", title: "Solicita una cotización", text: "Recibe una inspección gratis" },
  ],
  sideTitle: "Otras formas de contactarnos",
  sideSubtitle: "Elige el método que mejor te funcione.",
  hoursTitle: "Horario de servicio",
  dayMonFri: "Lunes – Viernes",
  daySat: "Sábado",
  daySun: "Domingo",
  emergencyNote: "Servicio de emergencia durante el horario de servicio",
  locationTitle: "Área de servicio",
  locationCity: "Sur de Florida",
  locationMuted: "Atendemos Miami, Broward y áreas cercanas",
  locationsLink: "Ver todas las ubicaciones",
  emergencyTitle: "Soporte de emergencia",
  emergencyText: "Para problemas urgentes de sprinklers, llámanos para prioridad el mismo día.",
};

const CARD_ICONS: Record<string, typeof Phone> = {
  phone: Phone,
  mail: Mail,
  faq: HelpCircle,
  quote: FileText,
};

const CARD_ICON_CLASSES: Record<string, string> = {
  phone: "contact-support-cardIcon--phone",
  mail: "contact-support-cardIcon--mail",
  faq: "contact-support-cardIcon--faq",
  quote: "contact-support-cardIcon--quote",
};

function cardHref(
  icon: string,
  locale: Locale,
  settings: { phoneTel: string; email: string },
): string {
  if (icon === "phone") return `tel:${settings.phoneTel}`;
  if (icon === "mail") return `mailto:${settings.email}`;
  if (icon === "faq") return "#contact-faq";
  return locale === "es" ? "/es/solicita-una-cotizacion" : "/request-quote";
}

export default async function ContactTemplate({
  locale = "en",
}: {
  locale?: Locale;
}) {
  const doc = await getContactPage();
  const settings = await resolveSiteSettings();
  const isEs = locale === "es";
  const fb = isEs ? FALLBACK_ES : FALLBACK_EN;
  // Live Google rating summary, from the single shared source in
  // lib/google-reviews. Used for the Google Rating stat below and passed to
  // the FAQ section, so the numbers change everywhere at the same time.
  const ratingSummary =
    (await getGoogleRatingSummary()) ?? FALLBACK_GOOGLE_RATING_SUMMARY;

  const heroTitle = (isEs ? doc?.heroTitleEs : doc?.heroTitle) ?? fb.heroTitle;
  const heroSubtitle = (isEs ? doc?.heroSubtitleEs : doc?.heroSubtitle) ?? fb.heroSubtitle;
  const stats = (
    doc?.stats && doc.stats.length > 0
      ? doc.stats.map((s, i) => ({
          value: (isEs ? s.valueEs : s.value) ?? fb.stats[i]?.value ?? "",
          label: (isEs ? s.labelEs : s.label) ?? fb.stats[i]?.label ?? "",
        }))
      : fb.stats
  ).map((s) =>
    s.label === "Google Rating" || s.label === "Calificación en Google"
      ? { ...s, value: formatGoogleRating(ratingSummary.rating) }
      : s
  );
  const optionsTitle = (isEs ? doc?.optionsTitleEs : doc?.optionsTitle) ?? fb.optionsTitle;
  const cards =
    doc?.cards && doc.cards.length > 0
      ? doc.cards.map((c, i) => ({
          icon: c.icon ?? fb.cards[i]?.icon ?? "faq",
          title: (isEs ? c.titleEs : c.title) ?? fb.cards[i]?.title ?? "",
          text: (isEs ? c.textEs : c.text) ?? fb.cards[i]?.text ?? "",
          link: c.link ?? fb.cards[i]?.link,
          meta: (isEs ? c.metaEs : c.meta) ?? fb.cards[i]?.meta,
        }))
      : fb.cards.map((c) => ({
          ...c,
          link:
            c.icon === "phone"
              ? settings.phoneCard
              : c.icon === "mail"
                ? settings.email
                : c.link,
        }));
  const faqs = (isEs ? doc?.faqsEs : doc?.faqs)?.map((f) => ({
    q: f.q ?? "",
    a: f.a ?? "",
  }));
  const side = {
    sideTitle: (isEs ? doc?.sideTitleEs : doc?.sideTitle) ?? fb.sideTitle,
    sideSubtitle: (isEs ? doc?.sideSubtitleEs : doc?.sideSubtitle) ?? fb.sideSubtitle,
    hoursTitle: (isEs ? doc?.hoursTitleEs : doc?.hoursTitle) ?? fb.hoursTitle,
    dayMonFri: (isEs ? doc?.dayMonFriEs : doc?.dayMonFri) ?? fb.dayMonFri,
    daySat: (isEs ? doc?.daySatEs : doc?.daySat) ?? fb.daySat,
    daySun: (isEs ? doc?.daySunEs : doc?.daySun) ?? fb.daySun,
    emergencyNote: (isEs ? doc?.emergencyNoteEs : doc?.emergencyNote) ?? fb.emergencyNote,
    locationTitle: (isEs ? doc?.locationTitleEs : doc?.locationTitle) ?? fb.locationTitle,
    locationCity: (isEs ? doc?.locationCityEs : doc?.locationCity) ?? fb.locationCity,
    locationMuted: (isEs ? doc?.locationMutedEs : doc?.locationMuted) ?? fb.locationMuted,
    locationsLink: (isEs ? doc?.locationsLinkEs : doc?.locationsLink) ?? fb.locationsLink,
    emergencyTitle: (isEs ? doc?.emergencyTitleEs : doc?.emergencyTitle) ?? fb.emergencyTitle,
    emergencyText: (isEs ? doc?.emergencyTextEs : doc?.emergencyText) ?? fb.emergencyText,
  };

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
      telephone: settings.phoneIntl,
      email: settings.email,
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

            <h1 className="contact-support-title">{heroTitle}</h1>

            <p className="contact-support-subtitle">{heroSubtitle}</p>
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
            {stats.map((stat, i) => {
              const Icon = STAT_ICONS[i] ?? Zap;
              return (
                <div className="contact-support-stat" key={i}>
                  <div className="contact-support-statTop">
                    <Icon
                      size={35}
                      strokeWidth={2.2}
                      className="contact-support-statIcon"
                      aria-hidden="true"
                    />
                    <div className="contact-support-statValue">{stat.value}</div>
                  </div>

                  <div className="contact-support-statLabel">{stat.label}</div>
                </div>
              );
            })}
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
            <h2 className="contact-support-optionsTitle">{optionsTitle}</h2>

            <div className="contact-support-grid">
              {cards.map((card, i) => {
                const Icon = CARD_ICONS[card.icon] ?? HelpCircle;
                const iconClass = CARD_ICON_CLASSES[card.icon] ?? "";
                const href = cardHref(card.icon, locale, settings);
                const inner = (
                  <>
                    <div
                      className={`contact-support-cardIcon ${iconClass}`}
                      aria-hidden="true"
                    >
                      <Icon size={22} />
                    </div>

                    <h3 className="contact-support-cardTitle">{card.title}</h3>

                    <p className="contact-support-cardText">{card.text}</p>

                    {card.link ? (
                      <div className="contact-support-cardLink">{card.link}</div>
                    ) : null}

                    {card.meta ? (
                      <div className="contact-support-cardMeta">{card.meta}</div>
                    ) : null}
                  </>
                );
                // Phone/mail are plain anchors; faq/quote use Next Link,
                // exactly as the original template did.
                return card.icon === "faq" || card.icon === "quote" ? (
                  <Link className="contact-support-card" href={href} key={i}>
                    {inner}
                  </Link>
                ) : (
                  <a className="contact-support-card" href={href} key={i}>
                    {inner}
                  </a>
                );
              })}
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
          <ContactFaqSection locale={locale} faqs={faqs && faqs.length > 0 ? faqs : undefined} ratingSummary={ratingSummary} />
        </div>
      </section>

      {/* Contact Form */}
      <section className="contact-support-section contact-message-section">
        <div className="contact-support-inner">
          <ContactMessageSection locale={locale} side={side} emergencyPhone={settings.phoneCard} />
        </div>
      </section>
    </main>
  );
}
