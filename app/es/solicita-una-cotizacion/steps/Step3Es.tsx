"use client";

export default function Step3Location(props: {
  serviceSummary: string;
  urgencyLabel: string;
  contactName: string;
  streetAddress: string;
  setStreetAddress: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  zipCode: string;
  setZipCode: (v: string) => void;
  canContinue: boolean;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="rq-step3">
      <h2 className="rq-step3__title">Ubicación del servicio</h2>
      <p className="rq-step3__subtitle">¿Dónde debemos prestar el servicio?</p>

      <div className="rq-step3__summaryCard">
        <div className="rq-step3__summaryLabel">Resumen</div>
        <div className="rq-step3__summaryValue">{props.serviceSummary}</div>
        <div className="rq-step3__summaryMeta">Urgencia: {props.urgencyLabel || "—"}</div>
        <div className="rq-step3__summaryMeta">Contacto: {props.contactName || "—"}</div>
      </div>

      <div className="rq-step3__grid">
        <div className="rq-step3__gridFull">
          <label className="rq-step3__label">Dirección *</label>
          <input
            value={props.streetAddress}
            onChange={(e) => props.setStreetAddress(e.target.value)}
            className="rq-step3__input"
            placeholder="123 Calle Principal"
            autoComplete="street-address"
          />
        </div>

        <div>
          <label className="rq-step3__label">Ciudad *</label>
          <input
            value={props.city}
            onChange={(e) => props.setCity(e.target.value)}
            className="rq-step3__input"
            placeholder="Miami"
            autoComplete="address-level2"
          />
        </div>

        <div>
          <label className="rq-step3__label">Código postal *</label>
          <input
            value={props.zipCode}
            onChange={(e) => props.setZipCode(e.target.value)}
            className="rq-step3__input"
            placeholder="33101"
            autoComplete="postal-code"
            inputMode="numeric"
          />
        </div>
      </div>

      <div className="rq-step3__actions">
        <button
          type="button"
          onClick={props.onBack}
          className="rq-step3__btn rq-step3__btn--secondary"
        >
          Atrás
        </button>
        <button
          type="button"
          onClick={props.onContinue}
          disabled={!props.canContinue}
          className={
            props.canContinue
              ? "rq-step3__btn rq-step3__btn--primary"
              : "rq-step3__btn rq-step3__btn--disabled"
          }
        >
          Continuar
        </button>
      </div>

      {!props.canContinue ? (
        <div className="rq-step3__hint">Completa todos los campos requeridos para continuar.</div>
      ) : null}
    </div>
  );
}
