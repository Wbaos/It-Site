import { Fragment } from "react";
import Link from "next/link";
import SvgIcon from "@/components/common/SvgIcons";
import type { LegalPage, LegalBlock } from "@/lib/sanityLegal";

// Single legal template for privacy + terms, EN + ES. Structure, icons
// and classes come from here; all copy comes from the Sanity `legalPage`
// document. `layout` picks the cards layout (privacy) or the numbered
// steps layout (terms).

type Locale = "en" | "es";

function pick(en: string | undefined, es: string | undefined, locale: Locale): string {
  if (locale === "es" && es) return es;
  return en ?? "";
}

function pickList(en: string[] | undefined, es: string[] | undefined, locale: Locale): string[] {
  if (locale === "es" && es) return es;
  return en ?? [];
}

// The terms intro card bolds the brand name, as the original page did.
function IntroText({ text }: { text: string }) {
  const parts = text.split("CallTechCare");
  if (parts.length < 2) return <>{text}</>;
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {i > 0 && <strong>CallTechCare</strong>}
          {part}
        </span>
      ))}
    </>
  );
}

function Blocks({ blocks, locale }: { blocks: LegalBlock[] | undefined; locale: Locale }) {
  return (
    <>
      {(blocks ?? []).map((block, i) => (
        <Fragment key={i}>
          {block.highlight ? (
            <p className="legal-highlight">{pick(block.highlight, block.highlightEs, locale)}</p>
          ) : null}
          {block.text ? <p>{pick(block.text, block.textEs, locale)}</p> : null}
          {block.list && block.list.length > 0 ? (
            <ul>
              {pickList(block.list, block.listEs, locale).map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          ) : null}
          {block.calloutTitle ? (
            <div className="terms-callout">
              <p className="terms-callout-title">
                {pick(block.calloutTitle, block.calloutTitleEs, locale)}
              </p>
              <p className="terms-callout-text">
                {pick(block.calloutText, block.calloutTextEs, locale)}
              </p>
            </div>
          ) : null}
        </Fragment>
      ))}
    </>
  );
}

export default function LegalTemplate({
  doc,
  page,
  locale = "en",
}: {
  doc: LegalPage;
  page: "privacy" | "terms";
  locale?: Locale;
}) {
  const isEs = locale === "es";
  const canonical =
    page === "privacy"
      ? isEs
        ? "https://www.calltechcare.com/es/politica-de-privacidad"
        : "https://www.calltechcare.com/privacy-policy"
      : isEs
        ? "https://www.calltechcare.com/es/terminos-y-condiciones"
        : "https://www.calltechcare.com/terms-and-conditions";
  const homeHref = isEs ? "/es/" : "/";
  const contactHref = isEs ? "/es/#contact" : "/#contact";
  const title = pick(doc.title, doc.titleEs, locale);
  const card = doc.contactCard;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    url: canonical,
    publisher: {
      "@type": "Organization",
      name: "CallTechCare",
      url: "https://www.calltechcare.com",
    },
  };

  if (doc.layout === "steps") {
    return (
      <>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <section className="legal-wrapper terms-wrapper">
          <div className="terms-hero">
            <div className="terms-inner terms-hero-inner">
              <Link href={homeHref} className="legal-back terms-back">
                <SvgIcon name="chevron-left" size={18} color="var(--brand-teal)" />
                {pick(doc.backText, doc.backTextEs, locale)}
              </Link>
              <div className="terms-hero-titleRow">
                <SvgIcon name="document" size={34} className="terms-hero-icon" />
                <div className="terms-hero-titleCol">
                  <h1 className="terms-hero-title">{title}</h1>
                  <p className="terms-hero-updated">{pick(doc.updated, doc.updatedEs, locale)}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="terms-bodySection">
            <div className="terms-inner terms-body">
              <div className="legal-card">
                <p>
                  <IntroText text={pick(doc.intro, doc.introEs, locale)} />
                </p>
              </div>
              <div className="terms-steps">
                {(doc.sections ?? []).map((section, i) => (
                  <div className="terms-step" key={i}>
                    <div className="terms-step-header">
                      <span className="terms-step-badge">{i + 1}</span>
                      <h2>{pick(section.heading, section.headingEs, locale)}</h2>
                    </div>
                    <Blocks blocks={section.blocks} locale={locale} />
                  </div>
                ))}
              </div>
              {card ? (
                <div className="legal-card legal-contact-card legal-contact-layout">
                  <div className="legal-contact-icon-col">
                    <SvgIcon name="mail" size={64} className="legal-card-icon" />
                  </div>
                  <div className="legal-contact-content-col">
                    <h2>{pick(card.title, card.titleEs, locale)}</h2>
                    <p>{pick(card.text, card.textEs, locale)}</p>
                    <p>
                      <strong>{pick(card.emailLabel, card.emailLabelEs, locale)} </strong>
                      <a href="mailto:support@calltechcare.com" className="terms-contact-item-email">
                        support@calltechcare.com
                      </a>
                    </p>
                    <p>
                      <strong>{pick(card.phoneLabel, card.phoneLabelEs, locale)}</strong>
                      <a href="tel:+17863662729" className="terms-contact-item-phone">
                        {" "}
                        (786) 366-2729
                      </a>
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <section className="legal-wrapper">
        <div className="legal-container">
          <Link href={homeHref} className="legal-back">
            <SvgIcon name="chevron-left" size={18} color="var(--brand-teal)" />
            {pick(doc.backText, doc.backTextEs, locale)}
          </Link>
          <div className="legal-header">
            <SvgIcon name={doc.headerIcon ?? "privacy-shield"} size={80} className="legal-header-icon" />
            <h1>{title}</h1>
            <p className="legal-updated">{pick(doc.updated, doc.updatedEs, locale)}</p>
            <p className="legal-intro">{pick(doc.intro, doc.introEs, locale)}</p>
          </div>
          {(doc.sections ?? []).map((section, i) => (
            <div className="legal-card" key={i}>
              <div className="legal-card-header">
                <SvgIcon name={section.icon ?? ""} size={38} className="legal-card-icon" />
                <h2>{pick(section.heading, section.headingEs, locale)}</h2>
              </div>
              <Blocks blocks={section.blocks} locale={locale} />
            </div>
          ))}
          {card ? (
            <div className="legal-card legal-contact-card legal-contact-layout">
              <div className="legal-contact-icon-col">
                <SvgIcon name={card.icon ?? "privacy-questions"} size={80} className="legal-card-icon" />
              </div>
              <div className="legal-contact-content-col">
                <h2>{pick(card.title, card.titleEs, locale)}</h2>
                <p>{pick(card.text, card.textEs, locale)}</p>
                <p>
                  <strong>{pick(card.emailLabel, card.emailLabelEs, locale)}</strong> support@calltechcare.com
                </p>
                <p>
                  <strong>{pick(card.phoneLabel, card.phoneLabelEs, locale)}</strong> (786) 366-2729
                </p>
                {card.mailLabel ? (
                  <p>
                    <strong>{pick(card.mailLabel, card.mailLabelEs, locale)}</strong> Miami, FL
                  </p>
                ) : null}
                {card.buttonText ? (
                  <Link href={contactHref} className="legal-contact-btn">
                    {pick(card.buttonText, card.buttonTextEs, locale)}
                  </Link>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
