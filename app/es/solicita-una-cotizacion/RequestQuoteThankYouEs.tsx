"use client";

import type { RefObject } from "react";
import SvgIcon from "@/components/common/SvgIcons";

export default function RequestQuoteThankYou(props: {
  topRef: RefObject<HTMLDivElement | null>;
  referenceNumber: string;
  wantsTechnicianVisitFirst: boolean;
  preferredDate: string;
  preferredTime: string;
  contactEmail: string;
  contactPhone: string;
  onBackHome: () => void;
  onBrowseServices: () => void;
}) {
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
          ¡Gracias! <span aria-hidden="true">🎉</span>
        </h1>
        <p className="rq-thankyou__subtitle">
          Tu solicitud de cotización se envió correctamente.
        </p>
        <div className="rq-thankyou__refRow">
          Número de referencia:{" "}
          <span className="rq-thankyou__refValue">
            {props.referenceNumber || "QR-________"}
          </span>
        </div>

        {props.wantsTechnicianVisitFirst ? (
          <div className="rq-thankyou__visitRow">
            Visita del técnico solicitada:{" "}
            <span className="rq-thankyou__refValue">
              {props.preferredDate || "____-__-__"}
            </span>
            {props.preferredTime ? (
              <>
                {" "}•{" "}
                <span className="rq-thankyou__refValue">
                  {props.preferredTime}
                </span>
              </>
            ) : null}
          </div>
        ) : null}

        <div className="rq-thankyou__card rq-thankyou__card--next">
          <div className="rq-thankyou__cardInner">
            <div className="rq-thankyou__cardTitle">
              ¿Qué pasa ahora?
            </div>

            <div className="rq-thankyou__steps">
              <div className="rq-thankyou__stepRow">
                <div className="rq-thankyou__stepNum">
                  1
                </div>
                <div>
                  <div className="rq-thankyou__stepTitle">Revisión</div>
                  <div className="rq-thankyou__stepDesc">
                    Nuestro equipo está revisando tu solicitud ahora mismo.
                  </div>
                </div>
              </div>

              <div className="rq-thankyou__stepRow">
                <div className="rq-thankyou__stepNum">
                  2
                </div>
                <div>
                  <div className="rq-thankyou__stepTitle">Entrega de la cotización</div>
                  <div className="rq-thankyou__stepDesc">
                    Recibirás una cotización detallada en{" "}
                    <span className="rq-thankyou__accent">
                      {props.contactEmail.trim() || "tu correo"}
                    </span>{" "}
                    dentro de 24 horas.
                  </div>
                </div>
              </div>

              <div className="rq-thankyou__stepRow">
                <div className="rq-thankyou__stepNum">
                  3
                </div>
                <div>
                  <div className="rq-thankyou__stepTitle">Llamada de confirmación</div>
                  <div className="rq-thankyou__stepDesc">
                    Un especialista podría llamarte al{" "}
                    <span className="rq-thankyou__accent">
                      {props.contactPhone.trim() || "tu teléfono"}
                    </span>{" "}
                    para hablar de lo que necesitas.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rq-thankyou__card rq-thankyou__card--help">
          <div className="rq-thankyou__cardInner">
            <div className="rq-thankyou__helpTitle">
              ¿Necesitas ayuda inmediata?
            </div>
            <div className="rq-thankyou__helpRow">
              <div className="rq-thankyou__helpItem">
                <SvgIcon name="phone" size={16} color="#10b981" />
                <span>+1 (786) 3662729</span>
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
            Volver al inicio
          </button>
          <button
            type="button"
            onClick={props.onBrowseServices}
            className="rq-thankyou__btn rq-thankyou__btn--secondary"
          >
            Ver servicios
          </button>
        </div>

        <div className="rq-thankyou__trustRow">
          <div className="rq-thankyou__trustItem">
            <SvgIcon name="shield" size={16} color="#64748b" />
            Asegurado
          </div>
          <div className="rq-thankyou__trustItem">
            <SvgIcon name="blog-author" size={16} color="#64748b" />
            Certificado
          </div>
          <div className="rq-thankyou__trustItem">
            <SvgIcon name="star-outline" size={16} color="#64748b" />
            Calificación 4.9
          </div>
        </div>
      </section>
    </main>
  );
}
