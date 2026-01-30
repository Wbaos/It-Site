"use client";

export default function Step2ContactInfo(props: {
  serviceSummary: string;
  urgencyId: string;
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
      <h2 className="rq-step2__title">Your Contact Information</h2>
      <p className="rq-step2__subtitle">
        We’ll use this to send your quote and reach out if needed
      </p>

      <div className="rq-step2__summaryCard">
        <div className="rq-step2__summaryLabel">Summary</div>
        <div className="rq-step2__summaryValue">{props.serviceSummary}</div>
        <div className="rq-step2__summaryMeta">Urgency: {props.urgencyId || "—"}</div>
      </div>

      <div className="rq-step2__grid">
        <div>
          <label className="rq-step2__label">First Name *</label>
          <input
            value={props.contactFirstName}
            onChange={(e) => props.setContactFirstName(e.target.value)}
            className="rq-step2__input"
            placeholder="John"
            autoComplete="given-name"
          />
        </div>

        <div>
          <label className="rq-step2__label">Last Name *</label>
          <input
            value={props.contactLastName}
            onChange={(e) => props.setContactLastName(e.target.value)}
            className="rq-step2__input"
            placeholder="Smith"
            autoComplete="family-name"
          />
        </div>

        <div>
          <label className="rq-step2__label">Email Address *</label>
          <input
            value={props.contactEmail}
            onChange={(e) => props.setContactEmail(e.target.value)}
            className="rq-step2__input"
            placeholder="john@example.com"
            autoComplete="email"
            inputMode="email"
          />
          {props.contactEmail && !props.emailOk ? (
            <div className="rq-step2__fieldError">Enter a valid email address.</div>
          ) : null}
        </div>

        <div>
          <label className="rq-step2__label">Phone Number *</label>
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
          Back
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
          Continue
        </button>
      </div>

      {!props.canContinue ? (
        <div className="rq-step2__hint">Fill in all required fields to continue.</div>
      ) : null}
    </div>
  );
}
