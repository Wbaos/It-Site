"use client";

import { Clock, MapPin, PhoneCall } from "lucide-react";
import Link from "next/link";
import QuickLeadForm from "@/components/QuickLeadForm";
import { FALLBACK_SETTINGS } from "@/lib/sanitySettings";

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

// Side-section copy comes from Sanity when provided; the form itself is
// the shared QuickLeadForm (name + phone + optional message, same as the
// rest of the site), so a contact here follows the same path as everywhere
// else: same /api/quote-request endpoint, same Ads conversion. The old
// long email form (name/email/subject/message) is gone.
export default function ContactMessageSection({
  locale = "en",
  side,
  emergencyPhone = FALLBACK_SETTINGS.phoneCard,
  phoneTel = FALLBACK_SETTINGS.phoneTel,
  phoneDisplay = FALLBACK_SETTINGS.phoneDisplay,
}: {
  locale?: "en" | "es";
  side?: ContactSideTexts;
  emergencyPhone?: string;
  phoneTel?: string;
  phoneDisplay?: string;
}) {
  const T =
    locale === "es"
      ? {
          paymentLine:
            "Pagas en persona al final: efectivo, cheque, tarjeta o Zelle.",
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
          paymentLine:
            "You pay in person at the end of your appointment: cash, check, card, or Zelle.",
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

  return (
    <div className="contact-message">
      <div className="contact-message-grid">
        {/* Left: short lead form (same as the rest of the site) + how
            payment works, in one line next to the form. */}
        <div>
          <QuickLeadForm
            locale={locale}
            phoneTel={phoneTel}
            phoneDisplay={phoneDisplay}
          />
          <p className="contact-payment-line">{T.paymentLine}</p>
        </div>

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

              <Link className="contact-message-sideLink" href={locale === "es" ? "/es/areas-de-servicio" : "/locations"}>
                {S.locationsLink}
              </Link>
            </div>

            <a className="contact-message-sideCard contact-message-sideCard--emergency" href={`tel:+${emergencyPhone.replace(/\D/g, "")}`}>
              <div className="contact-message-sideCardTitle">
                <PhoneCall size={18} className="contact-message-sideIcon" aria-hidden="true" />
                {S.emergencyTitle}
              </div>

              <div className="contact-message-emergencyText">
                {S.emergencyText}
              </div>
              <div className="contact-message-emergencyNumber">{emergencyPhone}</div>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
