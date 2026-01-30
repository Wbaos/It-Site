"use client";

export default function Step3Location(props: {
  serviceSummary: string;
  urgencyId: string;
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
      <h2 className="rq-step3__title">Service Location</h2>
      <p className="rq-step3__subtitle">Where should we provide the service?</p>

      <div className="rq-step3__summaryCard">
        <div className="rq-step3__summaryLabel">Summary</div>
        <div className="rq-step3__summaryValue">{props.serviceSummary}</div>
        <div className="rq-step3__summaryMeta">Urgency: {props.urgencyId || "—"}</div>
        <div className="rq-step3__summaryMeta">Contact: {props.contactName || "—"}</div>
      </div>

      <div className="rq-step3__grid">
        <div className="rq-step3__gridFull">
          <label className="rq-step3__label">Street Address *</label>
          <input
            value={props.streetAddress}
            onChange={(e) => props.setStreetAddress(e.target.value)}
            className="rq-step3__input"
            placeholder="123 Main Street"
            autoComplete="street-address"
          />
        </div>

        <div>
          <label className="rq-step3__label">City *</label>
          <input
            value={props.city}
            onChange={(e) => props.setCity(e.target.value)}
            className="rq-step3__input"
            placeholder="Miami"
            autoComplete="address-level2"
          />
        </div>

        <div>
          <label className="rq-step3__label">ZIP Code *</label>
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
          Back
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
          Continue
        </button>
      </div>

      {!props.canContinue ? (
        <div className="rq-step3__hint">Fill in all required fields to continue.</div>
      ) : null}
    </div>
  );
}
