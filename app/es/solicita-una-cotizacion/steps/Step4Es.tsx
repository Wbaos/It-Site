"use client";

import { useEffect, useRef } from "react";
import SvgIcon from "@/components/common/SvgIcons";
import { isTimeSlotAvailableForDate, STANDARD_TIME_SLOTS } from "@/lib/time-slots";

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
  preferredDate: string;
  setPreferredDate: (v: string) => void;
  preferredTime: string;
  setPreferredTime: (v: string) => void;
  heardAbout: string;
  setHeardAbout: (v: string) => void;
  canSubmit: boolean;
  submitting: boolean;
  submitError: string;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const preferredDateInputRef = useRef<HTMLInputElement | null>(null);

  const todayIso = new Date(Date.now() - new Date().getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 10);

  useEffect(() => {
    if (!props.wantsTechnicianVisitFirst) return;
    if (!props.preferredDate || !props.preferredTime) return;

    const selected = STANDARD_TIME_SLOTS.find((t) => t.value === props.preferredTime);
    if (!selected) return;
    if (
      !isTimeSlotAvailableForDate({
        dateIso: props.preferredDate,
        startHour: selected.startHour,
      })
    ) {
      props.setPreferredTime("");
    }
  }, [props.wantsTechnicianVisitFirst, props.preferredDate]);

  return (
    <div className="rq-step4">
      <h2 className="rq-step4__title">Detalles adicionales</h2>
      <p className="rq-step4__subtitle">Ayúdanos a entender mejor lo que necesitas</p>

      <div className="rq-step4__section">
        <label className="rq-step4__label">
          Describe tu proyecto
        </label>
        <textarea
          value={props.projectDetails}
          onChange={(e) => props.setProjectDetails(e.target.value)}
          className="rq-step4__textarea"
          placeholder="Por favor, incluye detalles de tu proyecto, requisitos específicos o preguntas que tengas..."
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
              aria-label="Me gustaría que un técnico visite primero"
            />
            <div className="rq-step4__cardContent">
              <div className="rq-step4__cardTitleRow">
                <div className="rq-step4__cardTitleIcon">
                  <SvgIcon name="calendar" size={22} color="#10b981" />
                </div>
                <div className="rq-step4__cardTitle">
                  Me gustaría que un técnico visite primero
                </div>
                <span className="rq-step4__badge">GRATIS</span>
              </div>

              <div className="rq-step4__cardDescription">
                ¿No estás seguro del trabajo exacto que se necesita? Enviaremos un técnico a tu ubicación para:
              </div>

              <ul className="rq-step4__benefits">
                <li className="rq-step4__benefit">
                  <span className="rq-step4__benefitCheck">✓</span>
                  Inspeccionar y evaluar el trabajo en persona
                </li>

                <li className="rq-step4__benefit">
                  <span className="rq-step4__benefitCheck">✓</span>
                  Darte un precio exacto (sin sorpresas)
                </li>

                <li className="rq-step4__benefit">
                  <span className="rq-step4__benefitCheck">✓</span>
                  Responder tus preguntas en persona
                </li>
              </ul>

              <div className="rq-step4__cardNote">
                Sin compromiso: tú decides después de la visita.
              </div>
            </div>
          </div>
        </button>

        {props.wantsTechnicianVisitFirst ? (
          <>
            <div className="rq-step4__divider" />

            <div className="rq-step4__subheading">
              ¿Cuándo te conviene más?
            </div>

            <div className="rq-step4__twoCol">
              <div>
                <label className="rq-step4__label">
                  Fecha preferida
                </label>

                <div className="rq-step4__dateWrap">
                  <input
                    type="date"
                    ref={preferredDateInputRef}
                    value={props.preferredDate}
                    min={todayIso}
                    onPointerDown={(e) => {
                      const el = preferredDateInputRef.current;
                      if (!el) return;

                      if (document.activeElement === el) {
                        e.preventDefault();
                        el.blur();
                        return;
                      }

                      try {
                        el.showPicker?.();
                      } catch {}
                    }}
                    onChange={(e) => {
                      const next = e.target.value;
                      props.setPreferredDate(
                        next && next < todayIso ? todayIso : next
                      );
                    }}
                    className="rq-date-input rq-step4__input rq-step4__input--date"
                  />

                  <span
                    className="rq-step4__dateIcon"
                    aria-hidden="true"
                  >
                    <SvgIcon
                      name="calendar"
                      size={18}
                      color="currentColor"
                    />
                  </span>
                </div>
              </div>

              <div>
                <label className="rq-step4__label">
                  Hora preferida
                </label>

                <div className="rq-step4__selectWrap">
                  <select
                    value={props.preferredTime}
                    onChange={(e) =>
                      props.setPreferredTime(e.target.value)
                    }
                    className="rq-step4__select"
                  >
                    <option value="">
                      Selecciona una hora
                    </option>

                    {STANDARD_TIME_SLOTS.map((slot) => (
                      <option
                        key={slot.value}
                        value={slot.value}
                        disabled={
                          !isTimeSlotAvailableForDate({
                            dateIso: props.preferredDate,
                            startHour: slot.startHour,
                          })
                        }
                      >
                        {slot.label}
                      </option>
                    ))}
                  </select>

                  <span
                    className="rq-step4__selectIcon"
                    aria-hidden="true"
                  >
                    <SvgIcon
                      name="chevron-down"
                      size={18}
                      color="currentColor"
                    />
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>

      <div className="rq-step4__section">
        <label className="rq-step4__label">
          ¿Cómo supiste de nosotros?
        </label>
        <div className="rq-step4__selectWrap">
          <select
            value={props.heardAbout}
            onChange={(e) => props.setHeardAbout(e.target.value)}
            className="rq-step4__select"
          >
            <option value="">Selecciona una opción</option>
            <option value="google">Google</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="friend">Amigo / Referido</option>
            <option value="other">Otro</option>
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
        Atrás
      </button>

      <button
        type="button"
        onClick={() => {
          props.onSubmit();

          // Google Ads conversion tracking
          if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "conversion", {
              send_to: "AW-17496959572/O9vCKjXw4QcENtUmZdB",
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
          {props.submitting ? "Enviando..." : "Enviar solicitud de cotización"}
        </span>
      </button>
    </div>
      {props.submitError ? (
        <div className="rq-step4__error">{props.submitError}</div>
      ) : null}

      {!props.canSubmit ? (
        <div className="rq-step4__hint">
          {props.wantsTechnicianVisitFirst
            ? "Selecciona una fecha y hora preferidas para continuar."
            : "Puedes enviar ahora o seleccionar la opción de visita del técnico."}
        </div>
      ) : null}
    </div>
  );
}
