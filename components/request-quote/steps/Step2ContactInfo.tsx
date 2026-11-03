"use client";

export default function Step2ContactInfo(props: {
  serviceSummary: string;
  urgencyLabel: string;
  locale?: "en" | "es";
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
  const locale = props.locale ?? "en";
  return (
    <div className="rq-step2">
      <h2 className="rq-step2__title">{locale === "es" ? "Tu información de contacto" : "Your Contact Information"}</h2>
      <p className="rq-step2__subtitle">
        {locale === "es" ? "La usaremos para enviarte tu cotización y contactarte si es necesario" : "We’ll use this to send your quote and reach out if needed"}
      </p>

      <div className="rq-step2__summaryCard">
        <div className="rq-step2__summaryLabel">{locale === "es" ? "Resumen" : "Summary"}</div>
        <div className="rq-step2__summaryValue">{props.serviceSummary}</div>
        <div className="rq-step2__summaryMeta">{locale === "es" ? "Urgencia:" : "Urgency:"} {props.urgencyLabel || "—"}</div>
      </div>

      <div className="rq-step2__grid">
        <div>
          <label className="rq-step2__label">{locale === "es" ? "Nombre *" : "First Name *"}</label>
          <input
            value={props.contactFirstName}
            onChange={(e) => props.setContactFirstName(e.target.value)}
            className="rq-step2__input"
            placeholder={locale === "es" ? "Juan" : "John"}
            autoComplete="given-name"
          />
        </div>

        <div>
          <label className="rq-step2__label">{locale === "es" ? "Apellido *" : "Last Name *"}</label>
          <input
            value={props.contactLastName}
            onChange={(e) => props.setContactLastName(e.target.value)}
            className="rq-step2__input"
            placeholder={locale === "es" ? "Pérez" : "Smith"}
            autoComplete="family-name"
          />
        </div>

        <div>
          <label className="rq-step2__label">{locale === "es" ? "Correo electrónico *" : "Email Address *"}</label>
          <input
            value={props.contactEmail}
            onChange={(e) => props.setContactEmail(e.target.value)}
            className="rq-step2__input"
            placeholder={locale === "es" ? "juan@ejemplo.com" : "john@example.com"}
            autoComplete="email"
            inputMode="email"
          />
          {props.contactEmail && !props.emailOk ? (
            <div className="rq-step2__fieldError">{locale === "es" ? "Escribe un correo electrónico válido." : "Enter a valid email address."}</div>
          ) : null}
        </div>

        <div>
          <label className="rq-step2__label">{locale === "es" ? "Teléfono *" : "Phone Number *"}</label>
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
          {locale === "es" ? "Atrás" : "Back"}
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
          {locale === "es" ? "Continuar" : "Continue"}
        </button>
      </div>

      {!props.canContinue ? (
        <div className="rq-step2__hint">{locale === "es" ? "Completa todos los campos requeridos para continuar." : "Fill in all required fields to continue."}</div>
      ) : null}
    </div>
  );
}
