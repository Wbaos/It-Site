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
import { resolveSiteSettings, substitutePhonePlaceholders } from "@/lib/sanitySettings";
import {
  getGoogleRatingSummary,
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
    { value: "<2h", label: "Response Time" },
    // Google Rating value is filled from the live summary below; the
    // empty default is dropped when there is no summary, so no stale
    // number ever shows.
    { value: "", label: "Google Rating" },
    { value: "1500+", label: "Happy Customers" },
    { value: "Mon–Sun", label: "Support Availability" },
  ],
  optionsTitle: "How Can We Help You?",
  cards: [
    {
      icon: "phone",
      title: "Call Us",
      text: "Talk to a live technician",
      link: "{{phoneCard}}",
      meta: "Available Mon–Sun",
    },
    {
      icon: "mail",
      title: "Email Support",
      text: "Get a response in less than two hours",
      link: "support@calltechcare.com",
    },
    { icon: "faq", title: "FAQs", text: "Find quick answers" },
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
    { value: "<2h", label: "Tiempo de respuesta" },
    { value: "", label: "Calificación en Google" },
    { value: "1500+", label: "Clientes felices" },
    { value: "Lun–Dom", label: "Disponibilidad de soporte" },
  ],
  optionsTitle: "¿Cómo podemos ayudarte?",
  cards: [
    {
      icon: "phone",
      title: "Llámanos",
      text: "Habla con un técnico en vivo",
      link: "{{phoneCard}}",
      meta: "Disponible lun–dom",
    },
    {
      icon: "mail",
      title: "Soporte por email",
      text: "Recibe respuesta en menos de dos horas",
      link: "support@calltechcare.com",
    },
    { icon: "faq", title: "Preguntas frecuentes", text: "Encuentra respuestas rápidas" },
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
  settings: { phoneTel: string; email: string },
): string {
  if (icon === "phone") return `tel:${settings.phoneTel}`;
  if (icon === "mail") return `mailto:${settings.email}`;
  // The quote card is hidden while the quote flow is hidden (see the
  // filter below), so only the FAQ anchor remains here.
  return "#contact-faq";
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
  // Every Sanity text below goes through the phone-placeholder helper, so
  // {{phone}} / {{phoneTel}} / {{phoneCard}} in contact copy resolves to
  // the single number in site-settings.
  const sub = (s: string | undefined) => substitutePhonePlaceholders(s ?? "", settings);
  // Live Google rating summary, from the single shared source in
  // lib/google-reviews (Sanity site-settings). Used for the Google Rating
  // stat below and passed to the FAQ section, so the numbers change
  // everywhere at the same time. When there is no summary the Google
  // Rating stat is dropped instead of showing a stale number.
  const ratingSummary = await getGoogleRatingSummary();

  const heroTitle = sub((isEs ? doc?.heroTitleEs : doc?.heroTitle) ?? fb.heroTitle);
  const heroSubtitle = sub((isEs ? doc?.heroSubtitleEs : doc?.heroSubtitle) ?? fb.heroSubtitle);
  const stats = (
    doc?.stats && doc.stats.length > 0
      ? doc.stats.map((s, i) => ({
          value: sub((isEs ? s.valueEs : s.value) ?? fb.stats[i]?.value ?? ""),
          label: sub((isEs ? s.labelEs : s.label) ?? fb.stats[i]?.label ?? ""),
        }))
      : fb.stats
  )
    .filter(
      (s) =>
        ratingSummary ||
        (s.label !== "Google Rating" && s.label !== "Calificación en Google")
    )
    .map((s) =>
      ratingSummary &&
      (s.label === "Google Rating" || s.label === "Calificación en Google")
        ? { ...s, value: formatGoogleRating(ratingSummary.rating) }
        : s
    );
  const optionsTitle = sub((isEs ? doc?.optionsTitleEs : doc?.optionsTitle) ?? fb.optionsTitle);
  const cards =
    doc?.cards && doc.cards.length > 0
      ? doc.cards.map((c, i) => ({
          icon: c.icon ?? fb.cards[i]?.icon ?? "faq",
          title: sub((isEs ? c.titleEs : c.title) ?? fb.cards[i]?.title ?? ""),
          text: sub((isEs ? c.textEs : c.text) ?? fb.cards[i]?.text ?? ""),
          // The phone card always shows the number from site-settings,
          // never the structured phone field stored on the Sanity card.
          link:
            (c.icon ?? fb.cards[i]?.icon) === "phone"
              ? settings.phoneCard
              : sub(c.link ?? fb.cards[i]?.link),
          meta: sub((isEs ? c.metaEs : c.meta) ?? fb.cards[i]?.meta),
        }))
      : fb.cards.map((c) => ({
          ...c,
          title: sub(c.title),
          text: sub(c.text),
          link:
            c.icon === "phone"
              ? settings.phoneCard
              : c.icon === "mail"
                ? settings.email
                : sub(c.link),
          meta: sub(c.meta),
        }));
  // The quote card also lives in the Sanity contactPage doc; hide it at
  // render while the quote flow is hidden. The doc itself is untouched,
  // so the card comes back if the flow returns.
  const visibleCards = cards.filter((c) => c.icon !== "quote");
  const faqs = (isEs ? doc?.faqsEs : doc?.faqs)?.map((f) => ({
    q: sub(f.q ?? ""),
    a: sub(f.a ?? ""),
  }));
  const side = {
    sideTitle: sub((isEs ? doc?.sideTitleEs : doc?.sideTitle) ?? fb.sideTitle),
    sideSubtitle: sub((isEs ? doc?.sideSubtitleEs : doc?.sideSubtitle) ?? fb.sideSubtitle),
    hoursTitle: sub((isEs ? doc?.hoursTitleEs : doc?.hoursTitle) ?? fb.hoursTitle),
    dayMonFri: sub((isEs ? doc?.dayMonFriEs : doc?.dayMonFri) ?? fb.dayMonFri),
    daySat: sub((isEs ? doc?.daySatEs : doc?.daySat) ?? fb.daySat),
    daySun: sub((isEs ? doc?.daySunEs : doc?.daySun) ?? fb.daySun),
    emergencyNote: sub((isEs ? doc?.emergencyNoteEs : doc?.emergencyNote) ?? fb.emergencyNote),
    locationTitle: sub((isEs ? doc?.locationTitleEs : doc?.locationTitle) ?? fb.locationTitle),
    locationCity: sub((isEs ? doc?.locationCityEs : doc?.locationCity) ?? fb.locationCity),
    locationMuted: sub((isEs ? doc?.locationMutedEs : doc?.locationMuted) ?? fb.locationMuted),
    locationsLink: sub((isEs ? doc?.locationsLinkEs : doc?.locationsLink) ?? fb.locationsLink),
    emergencyTitle: sub((isEs ? doc?.emergencyTitleEs : doc?.emergencyTitle) ?? fb.emergencyTitle),
    emergencyText: sub((isEs ? doc?.emergencyTextEs : doc?.emergencyText) ?? fb.emergencyText),
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
              {visibleCards.map((card, i) => {
                const Icon = CARD_ICONS[card.icon] ?? HelpCircle;
                const iconClass = CARD_ICON_CLASSES[card.icon] ?? "";
                const href = cardHref(card.icon, settings);
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
                // Phone/mail are plain anchors; faq uses Next Link,
                // exactly as the original template did.
                return card.icon === "faq" ? (
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
          <ContactMessageSection locale={locale} side={side} emergencyPhone={settings.phoneCard} phoneTel={settings.phoneTel} phoneDisplay={settings.phoneDisplay} />
        </div>
      </section>
    </main>
  );
}
