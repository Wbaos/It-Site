"use client";

export default function Step2ContactInfo(props: {
  serviceSummary: string;
  urgencyLabel: string;
  contactFirstName: string;
  setContactFirstName: (v: string) => void;
  contactLastName: string;
  setContactLastName: (v: string) => void;
  contactEmail: string;
  setContactEmail: (v: string) => void;
  emailOk: boolean;
  contactPhone: string;
  setContactPhone: (v: string) => void;
  canContinue: boolean;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="rq-step2">
      <h2 className="rq-step2__title">Tu información de contacto</h2>
      <p className="rq-step2__subtitle">
        La usaremos para enviarte tu cotización y contactarte si es necesario
      </p>

      <div className="rq-step2__summaryCard">
        <div className="rq-step2__summaryLabel">Resumen</div>
        <div className="rq-step2__summaryValue">{props.serviceSummary}</div>
        <div className="rq-step2__summaryMeta">Urgencia: {props.urgencyLabel || "—"}</div>
      </div>

      <div className="rq-step2__grid">
        <div>
          <label className="rq-step2__label">Nombre *</label>
          <input
            value={props.contactFirstName}
            onChange={(e) => props.setContactFirstName(e.target.value)}
            className="rq-step2__input"
            placeholder="Juan"
            autoComplete="given-name"
          />
        </div>

        <div>
          <label className="rq-step2__label">Apellido *</label>
          <input
            value={props.contactLastName}
            onChange={(e) => props.setContactLastName(e.target.value)}
            className="rq-step2__input"
            placeholder="Pérez"
            autoComplete="family-name"
          />
        </div>

        <div>
          <label className="rq-step2__label">Correo electrónico *</label>
          <input
            value={props.contactEmail}
            onChange={(e) => props.setContactEmail(e.target.value)}
            className="rq-step2__input"
            placeholder="juan@ejemplo.com"
            autoComplete="email"
            inputMode="email"
          />
          {props.contactEmail && !props.emailOk ? (
            <div className="rq-step2__fieldError">Escribe un correo electrónico válido.</div>
          ) : null}
        </div>

        <div>
          <label className="rq-step2__label">Teléfono *</label>
          <input
            value={props.contactPhone}
            onChange={(e) => props.setContactPhone(e.target.value)}
            className="rq-step2__input"
            placeholder="(555) 123-4567"
            autoComplete="tel"
            inputMode="tel"
          />
        </div>
      </div>

      <div className="rq-step2__actions">
        <button
          type="button"
          onClick={props.onBack}
          className="rq-step2__btn rq-step2__btn--secondary"
        >
          Atrás
        </button>
        <button
          type="button"
          onClick={props.onContinue}
          disabled={!props.canContinue}
          className={
            props.canContinue
              ? "rq-step2__btn rq-step2__btn--primary"
              : "rq-step2__btn rq-step2__btn--disabled"
          }
        >
          Continuar
        </button>
      </div>

      {!props.canContinue ? (
        <div className="rq-step2__hint">Completa todos los campos requeridos para continuar.</div>
      ) : null}
    </div>
  );
}
