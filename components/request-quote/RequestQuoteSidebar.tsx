"use client";

import SvgIcon from "@/components/common/SvgIcons";
import type { RequestQuoteContent } from "@/lib/request-quote-data";

// Spanish benefits (static translations of the current Sanity values;
// icons, phone number and rating still come from Sanity at render time).
const BENEFITS: Array<{ title: string; desc: string }> = [
  { title: "Sin obligación", desc: "Inspección gratis sin compromiso" },
  { title: "Respuesta rápida", desc: "Recibe tu cotización dentro de 24 horas" },
  { title: "Técnicos expertos", desc: "Técnicos con experiencia, a domicilio en tu casa" },
  { title: "Garantía de 1 año", desc: "1 año de garantía cuando CallTechCare hace el trabajo y provee los materiales" },
    { title: "Horario flexible", desc: "Servicio el mismo día dentro del horario de servicio" },
  { title: "Servicio local", desc: "Atendemos Miami-Dade y Broward" },
];

export default function RequestQuoteSidebar(props: {
  rqContent: RequestQuoteContent | null;
  locale?: "en" | "es";
}) {
  const locale = props.locale ?? "en";
  const rqContent = props.rqContent;

  const defaultSupportEmail = "support@calltechcare.com";
  const defaultEmailHref = `mailto:${defaultSupportEmail}?subject=${encodeURIComponent(
    "Quote Request"
  )}&body=${encodeURIComponent("Hi CallTechCare, I need help with a quote.")}`;

  const chatHref = rqContent?.immediateHelp?.chatUrl || defaultEmailHref;
  const chatIsHttp = /^https?:\/\//i.test(chatHref);

  const socialIconUrl = rqContent?.socialProof?.icon?.asset?.url;
  const socialIconAlt = rqContent?.socialProof?.icon?.alt || "";

  if (locale === "es") {
    return (
      <>
        {/* Benefits card */}
        <div className="rq-sidebar__card">
          <h3 className="rq-sidebar__title">¿Por qué solicitar una cotización?</h3>
          <div className="rq-sidebar__list">
            {BENEFITS.map((item, idx) => {
              const icon = rqContent?.sidebarBenefits?.[idx]?.icon;
              const iconUrl = icon?.asset?.url;
              const alt = icon?.alt || item.title || "";
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
                    <div className="rq-sidebar__benefitTitle">{item.title}</div>
                    <div className="rq-sidebar__benefitDesc">{item.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Social proof card */}
        <div className="rq-sidebar__card rq-sidebar__card--gradient">
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
            <div className="rq-sidebar__muted">+50 cotizaciones este mes</div>
          </div>
          {typeof rqContent?.socialProof?.ratingValue === "number" && (
            <div className="rq-sidebar__ratingRow">
              <div className="rq-sidebar__stars">★★★★★</div>
              <div className="rq-sidebar__ratingValue">
                {rqContent.socialProof.ratingValue}
              </div>
            </div>
          )}
          <div className="rq-sidebar__reviewsText">
            Basado en más de 25 reseñas de clientes
          </div>
        </div>

        {/* Immediate help card (corrected text, in Spanish) */}
        {rqContent?.immediateHelp?.phoneNumber ||
        rqContent?.immediateHelp?.chatLabel ? (
          <div className="rq-sidebar__card">
            <h3 className="rq-sidebar__title rq-sidebar__title--tight">
              ¿Necesitas ayuda inmediata?
            </h3>
            <p className="rq-sidebar__subtitle">
              Nuestro equipo está disponible durante el horario de servicio para
              ayudarte.
            </p>

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
                    <div className="rq-sidebar__actionSublabel">
                      Durante el horario de servicio
                    </div>
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
                      Escríbenos por email
                    </div>
                    <div className="rq-sidebar__actionSublabel">
                      support@calltechcare.com
                    </div>
                  </span>
                </a>
              ) : null}
            </div>
          </div>
        ) : null}
      </>
    );
  }

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
