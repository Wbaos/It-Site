"use client";

import SvgIcon from "@/components/common/SvgIcons";
import type { RequestQuoteContent } from "@/lib/request-quote-data";

export default function RequestQuoteSidebar(props: {
  rqContent: RequestQuoteContent | null;
}) {
  const rqContent = props.rqContent;

  const defaultSupportEmail = "support@calltechcare.com";
  const defaultEmailHref = `mailto:${defaultSupportEmail}?subject=${encodeURIComponent(
    "Quote Request"
  )}&body=${encodeURIComponent("Hi CallTechCare, I need help with a quote.")}`;

  const chatHref = rqContent?.immediateHelp?.chatUrl || defaultEmailHref;
  const chatIsHttp = /^https?:\/\//i.test(chatHref);

  const socialIconUrl = rqContent?.socialProof?.icon?.asset?.url;
  const socialIconAlt = rqContent?.socialProof?.icon?.alt || "";

  return (
    <>
      {/* Benefits card (Sanity-controlled) */}
      {rqContent?.sidebarBenefits?.length ? (
        <div className="rq-sidebar__card">
          {rqContent.sidebarBenefitsTitle && (
            <h3 className="rq-sidebar__title">
              {rqContent.sidebarBenefitsTitle}
            </h3>
          )}
          <div className="rq-sidebar__list">
            {rqContent.sidebarBenefits
              .filter((b) => b?.title && b?.desc)
              .map((item, idx) => {
                const iconUrl = item.icon?.asset?.url;
                const alt = item.icon?.alt || item.title || "";
                return (
                  <div key={`${item.title}-${idx}`} className="rq-sidebar__benefitRow">
                    <div className="rq-sidebar__benefitIconWrap">
                      {iconUrl ? (
                        <img
                          src={iconUrl}
                          alt={alt}
                          className="rq-sidebar__benefitIcon"
                        />
                      ) : null}
                    </div>
                    <div>
                      <div className="rq-sidebar__benefitTitle">
                        {item.title}
                      </div>
                      <div className="rq-sidebar__benefitDesc">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <div className="rq-sidebar__card">
          <div className="rq-sidebar__muted">Sidebar content not available.</div>
        </div>
      )}

      {/* Social proof card (Sanity-controlled) */}
      {rqContent?.socialProof?.quotesThisMonthText ||
      typeof rqContent?.socialProof?.ratingValue === "number" ||
      rqContent?.socialProof?.reviewsText ? (
        <div className="rq-sidebar__card rq-sidebar__card--gradient">
          {(socialIconUrl || rqContent?.socialProof?.quotesThisMonthText) && (
            <div className="rq-sidebar__socialTop">
              {socialIconUrl ? (
                <div className="rq-sidebar__avatarRow">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className={
                        i === 0
                          ? "rq-sidebar__avatar"
                          : "rq-sidebar__avatar rq-sidebar__avatar--overlap"
                      }
                    >
                      <img
                        src={socialIconUrl}
                        alt={socialIconAlt}
                        className="rq-sidebar__avatarImg"
                      />
                    </div>
                  ))}
                </div>
              ) : null}
              {rqContent?.socialProof?.quotesThisMonthText ? (
                <div className="rq-sidebar__muted">
                  {rqContent.socialProof.quotesThisMonthText}
                </div>
              ) : null}
            </div>
          )}
          {typeof rqContent?.socialProof?.ratingValue === "number" && (
            <div className="rq-sidebar__ratingRow">
              <div className="rq-sidebar__stars">★★★★★</div>
              <div className="rq-sidebar__ratingValue">
                {rqContent.socialProof.ratingValue}
              </div>
            </div>
          )}
          {rqContent?.socialProof?.reviewsText && (
            <div className="rq-sidebar__reviewsText">
              {rqContent.socialProof.reviewsText}
            </div>
          )}
        </div>
      ) : null}

      {/* Immediate help card (Sanity-controlled) */}
      {rqContent?.immediateHelp?.title || rqContent?.immediateHelp?.subtitle ? (
        <div className="rq-sidebar__card">
          {rqContent.immediateHelp.title && (
            <h3 className="rq-sidebar__title rq-sidebar__title--tight">
              {rqContent.immediateHelp.title}
            </h3>
          )}
          {rqContent.immediateHelp.subtitle && (
            <p className="rq-sidebar__subtitle">
              {rqContent.immediateHelp.subtitle}
            </p>
          )}

          <div className="rq-sidebar__actions">
            {rqContent.immediateHelp.phoneNumber ? (
              <a
                href={`tel:${rqContent.immediateHelp.phoneNumber}`}
                className="rq-sidebar__action"
              >
                <span className="rq-sidebar__actionIcon">
                  {rqContent.immediateHelp.phoneIcon?.asset?.url ? (
                    <img
                      src={rqContent.immediateHelp.phoneIcon.asset.url}
                      alt={rqContent.immediateHelp.phoneIcon.alt || "Phone"}
                      className="rq-sidebar__actionIconImg"
                    />
                  ) : (
                    <SvgIcon name="phone" size={20} color="#10b981" />
                  )}
                </span>

                <span className="rq-sidebar__actionText">
                  <div className="rq-sidebar__actionLabel">
                    {rqContent.immediateHelp.phoneLabel ||
                      rqContent.immediateHelp.phoneNumber}
                  </div>
                  {rqContent.immediateHelp.phoneSubLabel ? (
                    <div className="rq-sidebar__actionSublabel">
                      {rqContent.immediateHelp.phoneSubLabel}
                    </div>
                  ) : null}
                </span>
              </a>
            ) : null}

            {rqContent.immediateHelp.chatLabel ? (
              <a
                href={chatHref}
                target={chatIsHttp ? "_blank" : undefined}
                rel={chatIsHttp ? "noreferrer" : undefined}
                className="rq-sidebar__action"
              >
                <span className="rq-sidebar__actionIcon">
                  {rqContent.immediateHelp.chatIcon?.asset?.url ? (
                    <img
                      src={rqContent.immediateHelp.chatIcon.asset.url}
                      alt={rqContent.immediateHelp.chatIcon.alt || "Chat"}
                      className="rq-sidebar__actionIconImg"
                    />
                  ) : (
                    <SvgIcon name="mail" size={20} color="#10b981" />
                  )}
                </span>

                <span className="rq-sidebar__actionText">
                  <div className="rq-sidebar__actionLabel">
                    {rqContent.immediateHelp.chatLabel}
                  </div>
                  {rqContent.immediateHelp.chatSubLabel ? (
                    <div className="rq-sidebar__actionSublabel">
                      {rqContent.immediateHelp.chatSubLabel}
                    </div>
                  ) : null}
                </span>
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
