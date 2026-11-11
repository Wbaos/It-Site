"use client";

import SvgIcon from "@/components/common/SvgIcons";
import { setAdsUserData } from "@/lib/enhancedConversions";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function Step4AdditionalDetails(props: {
  projectDetails: string;
  setProjectDetails: (v: string) => void;
  wantsTechnicianVisitFirst: boolean;
  setWantsTechnicianVisitFirst: (v: boolean) => void;
  heardAbout: string;
  setHeardAbout: (v: string) => void;
  canSubmit: boolean;
  submitting: boolean;
  submitError: string;
  onBack: () => void;
  onSubmit: () => void;
  locale?: "en" | "es";
  // Contact values entered in step 2, passed down only so the manual
  // Enhanced Conversions user_data can be set before the conversion
  // event below. This step's own fields have no email or phone.
  contactEmail?: string;
  contactPhone?: string;
}) {
  const locale = props.locale ?? "en";

  return (
    <div className="rq-step4">
      <h2 className="rq-step4__title">{locale === "es" ? "Detalles adicionales" : "Additional Details"}</h2>
      <p className="rq-step4__subtitle">{locale === "es" ? "Ayúdanos a entender mejor lo que necesitas" : "Help us understand your needs better"}</p>

      <div className="rq-step4__section">
        <label className="rq-step4__label">
          {locale === "es" ? "Describe tu proyecto" : "Describe Your Project"}
        </label>
        <textarea
          value={props.projectDetails}
          onChange={(e) => props.setProjectDetails(e.target.value)}
          className="rq-step4__textarea"
          placeholder={locale === "es" ? "Por favor, incluye detalles de tu proyecto, requisitos específicos o preguntas que tengas..." : "Please provide any details about your project, specific requirements, or questions you have..."}
        />
      </div>

      {/* Checkbox card */}
      <div className="rq-step4__card">
        <button
          type="button"
          onClick={() =>
            props.setWantsTechnicianVisitFirst(!props.wantsTechnicianVisitFirst)
          }
          className="rq-step4__cardButton"
        >
          <div className="rq-step4__cardTopRow">
            <input
              type="checkbox"
              checked={props.wantsTechnicianVisitFirst}
              onChange={(e) =>
                props.setWantsTechnicianVisitFirst(e.target.checked)
              }
              className="rq-step4__checkbox"
              aria-label={locale === "es" ? "Me gustaría que un técnico visite primero" : "I'd like a technician to visit first"}
            />
            <div className="rq-step4__cardContent">
              <div className="rq-step4__cardTitleRow">
                <div className="rq-step4__cardTitleIcon">
                  <SvgIcon name="calendar" size={22} color="#10b981" />
                </div>
                <div className="rq-step4__cardTitle">
                  {locale === "es" ? "Me gustaría que un técnico visite primero" : "I’d like a technician to visit first"}
                </div>
                <span className="rq-step4__badge">{locale === "es" ? "GRATIS" : "FREE"}</span>
              </div>

              <div className="rq-step4__cardDescription">
                {locale === "es" ? "¿No estás seguro del trabajo exacto que se necesita? Enviaremos un técnico a tu ubicación para:" : "Not sure about the exact work needed? We’ll send a technician to your location to:"}
              </div>

              <ul className="rq-step4__benefits">
                <li className="rq-step4__benefit">
                  <span className="rq-step4__benefitCheck">✓</span>
                  {locale === "es" ? "Inspeccionar y evaluar el trabajo en persona" : "Inspect and assess the job in person"}
                </li>

                <li className="rq-step4__benefit">
                  <span className="rq-step4__benefitCheck">✓</span>
                  {locale === "es" ? "Darte un precio exacto (sin sorpresas)" : "Give you an exact price (no surprises)"}
                </li>

                <li className="rq-step4__benefit">
                  <span className="rq-step4__benefitCheck">✓</span>
                  {locale === "es" ? "Responder tus preguntas en persona" : "Answer any questions face-to-face"}
                </li>
              </ul>

              <div className="rq-step4__cardNote">
                {locale === "es" ? "Sin compromiso: tú decides después de la visita." : "No commitment required — you decide after the visit."}
              </div>
            </div>
          </div>
        </button>

        {props.wantsTechnicianVisitFirst ? (
          <>
            <div className="rq-step4__divider" />

            <div className="rq-step4__cardNote">
              {locale === "es" ? "Te llamamos para confirmar el día y la hora de la visita." : "We'll call you to confirm the day and time of the visit."}
            </div>
          </>
        ) : null}
      </div>

      <div className="rq-step4__section">
        <label className="rq-step4__label">
          {locale === "es" ? "¿Cómo supiste de nosotros?" : "How did you hear about us?"}
        </label>
        <div className="rq-step4__selectWrap">
          <select
            value={props.heardAbout}
            onChange={(e) => props.setHeardAbout(e.target.value)}
            className="rq-step4__select"
          >
            <option value="">{locale === "es" ? "Selecciona una opción" : "Select an option"}</option>
            <option value="google">Google</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="friend">{locale === "es" ? "Amigo / Referido" : "Friend / Referral"}</option>
            <option value="other">{locale === "es" ? "Otro" : "Other"}</option>
          </select>
          <span className="rq-step4__selectIcon" aria-hidden="true">
            <SvgIcon name="chevron-down" size={18} color="currentColor" />
          </span>
        </div>
      </div>

    <div className="rq-step4__actions">
      <button
        type="button"
        onClick={props.onBack}
        className="rq-step4__btn rq-step4__btn--secondary"
      >
        {locale === "es" ? "Atrás" : "Back"}
      </button>

      <button
        type="button"
        onClick={() => {
          props.onSubmit();

          // Google Ads conversion tracking
          // Manual Enhanced Conversions: pass the email and phone from
          // step 2 before the conversion event.
          if (typeof window !== "undefined" && window.gtag) {
            setAdsUserData({
              email: props.contactEmail,
              phone: props.contactPhone,
            });
            window.gtag("event", "conversion", {
              send_to: "AW-17496959572/UHy5CJ-MkbEdENTUmZdB",
            });
          }
        }}
        disabled={!props.canSubmit || props.submitting}
        className={
          props.canSubmit && !props.submitting
            ? "rq-step4__btn rq-step4__btn--primary"
            : "rq-step4__btn rq-step4__btn--disabled"
        }
      >
        <SvgIcon
          name="paper-plane"
          size={18}
          color={props.canSubmit && !props.submitting ? "#fff" : "#64748b"}
        />
        <span>
          {props.submitting ? (locale === "es" ? "Enviando..." : "Submitting...") : (locale === "es" ? "Enviar solicitud de cotización" : "Submit Quote Request")}
        </span>
      </button>
    </div>
      {props.submitError ? (
        <div className="rq-step4__error">{props.submitError}</div>
      ) : null}
    </div>
  );
}
