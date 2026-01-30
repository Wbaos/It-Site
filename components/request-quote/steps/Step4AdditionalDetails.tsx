"use client";

import { useRef } from "react";
import SvgIcon from "@/components/common/SvgIcons";

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

  return (
    <div className="rq-step4">
      <h2 className="rq-step4__title">Additional Details</h2>
      <p className="rq-step4__subtitle">Help us understand your needs better</p>

      <div className="rq-step4__section">
        <label className="rq-step4__label">
          Describe Your Project
        </label>
        <textarea
          value={props.projectDetails}
          onChange={(e) => props.setProjectDetails(e.target.value)}
          className="rq-step4__textarea"
          placeholder="Please provide any details about your project, specific requirements, or questions you have..."
        />
      </div>

      {/* Checkbox card */}
      <div className="rq-step4__card">
        <button
          type="button"
          onClick={() => props.setWantsTechnicianVisitFirst(!props.wantsTechnicianVisitFirst)}
          className="rq-step4__cardButton"
        >
          <div className="rq-step4__cardTopRow">
            <input
              type="checkbox"
              checked={props.wantsTechnicianVisitFirst}
              onChange={(e) => props.setWantsTechnicianVisitFirst(e.target.checked)}
              className="rq-step4__checkbox"
              aria-label="I'd like a technician to visit first"
            />
            <div className="rq-step4__cardContent">
              <div className="rq-step4__cardTitleRow">
                <div className="rq-step4__cardTitleIcon">
                  <SvgIcon name="calendar" size={18} color="#10b981" />
                </div>
                <div className="rq-step4__cardTitle">I’d like a technician to visit first</div>
                <span className="rq-step4__badge">FREE</span>
              </div>

              <div className="rq-step4__cardDescription">
                Not sure about the exact work needed? We’ll send a technician to your location to:
              </div>
              <ul className="rq-step4__benefits">
                <li className="rq-step4__benefit">
                  <span className="rq-step4__benefitCheck">✓</span> Inspect and assess the job in person
                </li>
                <li className="rq-step4__benefit">
                  <span className="rq-step4__benefitCheck">✓</span> Give you an exact price (no surprises)
                </li>
                <li className="rq-step4__benefit">
                  <span className="rq-step4__benefitCheck">✓</span> Answer any questions face-to-face
                </li>
              </ul>
              <div className="rq-step4__cardNote">
                No commitment required — you decide after the visit.
              </div>
            </div>
          </div>
        </button>

        {props.wantsTechnicianVisitFirst ? (
          <>
            <div className="rq-step4__divider" />
            <div className="rq-step4__subheading">When works best for you?</div>
            <div className="rq-step4__twoCol">
              <div>
                <label className="rq-step4__label">
                  Preferred Date
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
                      } catch {
                      }
                    }}
                    onChange={(e) => {
                      const next = e.target.value;
                      props.setPreferredDate(next && next < todayIso ? todayIso : next);
                    }}
                    className="rq-date-input rq-step4__input rq-step4__input--date"
                  />
                  <span className="rq-step4__dateIcon" aria-hidden="true">
                    <SvgIcon name="calendar" size={18} color="currentColor" />
                  </span>
                </div>
              </div>
              <div>
                <label className="rq-step4__label">
                  Preferred Time
                </label>
                <div className="rq-step4__selectWrap">
                  <select
                    value={props.preferredTime}
                    onChange={(e) => props.setPreferredTime(e.target.value)}
                    className="rq-step4__select"
                  >
                    <option value="">Select a time</option>
                    <option value="8AM - 12PM">Morning (8AM - 12PM)</option>
                    <option value="12PM - 5PM">Afternoon (12PM - 5PM)</option>
                    <option value="5PM - 8PM">Evening (5PM - 8PM)</option>
                  </select>
                  <span className="rq-step4__selectIcon" aria-hidden="true">
                    <SvgIcon name="chevron-down" size={18} color="currentColor" />
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>

      <div className="rq-step4__section">
        <label className="rq-step4__label">
          How did you hear about us?
        </label>
        <div className="rq-step4__selectWrap">
          <select
            value={props.heardAbout}
            onChange={(e) => props.setHeardAbout(e.target.value)}
            className="rq-step4__select"
          >
            <option value="">Select an option</option>
            <option value="google">Google</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="friend">Friend / Referral</option>
            <option value="other">Other</option>
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
          Back
        </button>
        <button
          type="button"
          onClick={props.onSubmit}
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
          <span>{props.submitting ? "Submitting..." : "Submit Quote Request"}</span>
        </button>
      </div>

      {props.submitError ? (
        <div className="rq-step4__error">{props.submitError}</div>
      ) : null}

      {!props.canSubmit ? (
        <div className="rq-step4__hint">
          {props.wantsTechnicianVisitFirst
            ? "Select a preferred date and time to continue."
            : "You can submit now, or select the technician visit option."}
        </div>
      ) : null}
    </div>
  );
}
