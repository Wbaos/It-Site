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
          Thank You! <span aria-hidden="true">🎉</span>
        </h1>
        <p className="rq-thankyou__subtitle">
          Your quote request has been submitted successfully.
        </p>
        <div className="rq-thankyou__refRow">
          Reference Number:{" "}
          <span className="rq-thankyou__refValue">
            {props.referenceNumber || "QR-________"}
          </span>
        </div>

        {props.wantsTechnicianVisitFirst ? (
          <div className="rq-thankyou__visitRow">
            Technician visit requested:{" "}
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
              What Happens Next?
            </div>

            <div className="rq-thankyou__steps">
              <div className="rq-thankyou__stepRow">
                <div className="rq-thankyou__stepNum">
                  1
                </div>
                <div>
                  <div className="rq-thankyou__stepTitle">Review Process</div>
                  <div className="rq-thankyou__stepDesc">
                    Our team is reviewing your request right now.
                  </div>
                </div>
              </div>

              <div className="rq-thankyou__stepRow">
                <div className="rq-thankyou__stepNum">
                  2
                </div>
                <div>
                  <div className="rq-thankyou__stepTitle">Quote Delivery</div>
                  <div className="rq-thankyou__stepDesc">
                    You’ll receive a detailed quote at{" "}
                    <span className="rq-thankyou__accent">
                      {props.contactEmail.trim() || "your email"}
                    </span>{" "}
                    within 2-4 hours.
                  </div>
                </div>
              </div>

              <div className="rq-thankyou__stepRow">
                <div className="rq-thankyou__stepNum">
                  3
                </div>
                <div>
                  <div className="rq-thankyou__stepTitle">Confirmation Call</div>
                  <div className="rq-thankyou__stepDesc">
                    A specialist may call you at{" "}
                    <span className="rq-thankyou__accent">
                      {props.contactPhone.trim() || "your phone"}
                    </span>{" "}
                    to discuss your needs.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rq-thankyou__card rq-thankyou__card--help">
          <div className="rq-thankyou__cardInner">
            <div className="rq-thankyou__helpTitle">
              Need immediate assistance?
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
            Back to Home
          </button>
          <button
            type="button"
            onClick={props.onBrowseServices}
            className="rq-thankyou__btn rq-thankyou__btn--secondary"
          >
            Browse Services
          </button>
        </div>

        <div className="rq-thankyou__trustRow">
          <div className="rq-thankyou__trustItem">
            <SvgIcon name="shield" size={16} color="#64748b" />
            Insured
          </div>
          <div className="rq-thankyou__trustItem">
            <SvgIcon name="blog-author" size={16} color="#64748b" />
            Certified
          </div>
          <div className="rq-thankyou__trustItem">
            <SvgIcon name="star-outline" size={16} color="#64748b" />
            4.9 Rating
          </div>
        </div>
      </section>
    </main>
  );
}
