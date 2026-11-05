"use client";

import type { RefObject } from "react";
import SvgIcon from "@/components/common/SvgIcons";
import {
  FALLBACK_GOOGLE_RATING_SUMMARY,
  formatGoogleRating,
  type GoogleRatingSummary,
} from "@/lib/google-reviews";
import { FALLBACK_SETTINGS } from "@/lib/sanitySettings";

export default function RequestQuoteThankYou(props: {
  topRef: RefObject<HTMLDivElement | null>;
  referenceNumber: string;
  wantsTechnicianVisitFirst: boolean;
  contactEmail: string;
  contactPhone: string;
  onBackHome: () => void;
  onBrowseServices: () => void;
  locale?: "en" | "es";
  ratingSummary?: GoogleRatingSummary;
  // Business phone from site-settings (passed by the server page via the
  // quote client); the fallback is the single shared one, never a literal.
  phoneCard?: string;
}) {
  const locale = props.locale ?? "en";
  const phoneCard = props.phoneCard ?? FALLBACK_SETTINGS.phoneCard;
  // Live Google rating, from the single shared source in lib/google-reviews.
  const googleRating = formatGoogleRating(
    (props.ratingSummary ?? FALLBACK_GOOGLE_RATING_SUMMARY).rating
  );
  return (
    <main className="rq-thankyou__page">
      <div ref={props.topRef} />

      <section className="rq-thankyou__container">
        <div className="rq-thankyou__badgeOuter">
          <div className="rq-thankyou__badgeInner">
            <SvgIcon name="verified-check" size={30} color="#10b981" />
          </div>
        </div>

        <h1 className="rq-thankyou__title">
          {locale === "es" ? "¡Gracias!" : "Thank You!"} <span aria-hidden="true">🎉</span>
        </h1>
        <p className="rq-thankyou__subtitle">
          {locale === "es" ? "Tu solicitud de cotización se envió correctamente." : "Your quote request has been submitted successfully."}
        </p>
        <div className="rq-thankyou__refRow">
          {locale === "es" ? "Número de referencia:" : "Reference Number:"}{" "}
          <span className="rq-thankyou__refValue">
            {props.referenceNumber || "QR-________"}
          </span>
        </div>

        {props.wantsTechnicianVisitFirst ? (
          <div className="rq-thankyou__visitRow">
            {locale === "es"
              ? "Visita del técnico solicitada: te llamamos para confirmar el día y la hora."
              : "Technician visit requested — we'll call you to confirm the day and time."}
          </div>
        ) : null}

        <div className="rq-thankyou__card rq-thankyou__card--next">
          <div className="rq-thankyou__cardInner">
            <div className="rq-thankyou__cardTitle">
              {locale === "es" ? "¿Qué pasa ahora?" : "What Happens Next?"}
            </div>

            <div className="rq-thankyou__steps">
              <div className="rq-thankyou__stepRow">
                <div className="rq-thankyou__stepNum">
                  1
                </div>
                <div>
                  <div className="rq-thankyou__stepTitle">{locale === "es" ? "Revisión" : "Review Process"}</div>
                  <div className="rq-thankyou__stepDesc">
                    {locale === "es" ? "Nuestro equipo está revisando tu solicitud ahora mismo." : "Our team is reviewing your request right now."}
                  </div>
                </div>
              </div>

              <div className="rq-thankyou__stepRow">
                <div className="rq-thankyou__stepNum">
                  2
                </div>
                <div>
                  <div className="rq-thankyou__stepTitle">{locale === "es" ? "Entrega de la cotización" : "Quote Delivery"}</div>
                  <div className="rq-thankyou__stepDesc">
                    {locale === "es" ? "Recibirás una cotización detallada en" : "You’ll receive a detailed quote at"}{" "}
                    <span className="rq-thankyou__accent">
                      {props.contactEmail.trim() || (locale === "es" ? "tu correo" : "your email")}
                    </span>{" "}
                    {locale === "es" ? "dentro de 24 horas." : "within 24 hours."}
                  </div>
                </div>
              </div>

              <div className="rq-thankyou__stepRow">
                <div className="rq-thankyou__stepNum">
                  3
                </div>
                <div>
                  <div className="rq-thankyou__stepTitle">{locale === "es" ? "Llamada de confirmación" : "Confirmation Call"}</div>
                  <div className="rq-thankyou__stepDesc">
                    {locale === "es" ? "Un especialista podría llamarte al" : "A specialist may call you at"}{" "}
                    <span className="rq-thankyou__accent">
                      {props.contactPhone.trim() || (locale === "es" ? "tu teléfono" : "your phone")}
                    </span>{" "}
                    {locale === "es" ? "para hablar de lo que necesitas." : "to discuss your needs."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rq-thankyou__card rq-thankyou__card--help">
          <div className="rq-thankyou__cardInner">
            <div className="rq-thankyou__helpTitle">
              {locale === "es" ? "¿Necesitas ayuda inmediata?" : "Need immediate assistance?"}
            </div>
            <div className="rq-thankyou__helpRow">
              <div className="rq-thankyou__helpItem">
                <SvgIcon name="phone" size={16} color="#10b981" />
                <span>{phoneCard}</span>
              </div>
              <div className="rq-thankyou__helpItem">
                <SvgIcon name="mail" size={16} color="#10b981" />
                <span>support@calltechcare.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rq-thankyou__actions">
          <button
            type="button"
            onClick={props.onBackHome}
            className="rq-thankyou__btn rq-thankyou__btn--primary"
          >
            {locale === "es" ? "Volver al inicio" : "Back to Home"}
          </button>
          <button
            type="button"
            onClick={props.onBrowseServices}
            className="rq-thankyou__btn rq-thankyou__btn--secondary"
          >
            {locale === "es" ? "Ver servicios" : "Browse Services"}
          </button>
        </div>

        <div className="rq-thankyou__trustRow">
          <div className="rq-thankyou__trustItem">
            <SvgIcon name="star-outline" size={16} color="#64748b" />
            {locale === "es" ? `Calificación ${googleRating}` : `${googleRating} Rating`}
          </div>
        </div>
      </section>
    </main>
  );
}
