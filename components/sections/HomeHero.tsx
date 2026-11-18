import QuickLeadForm from "@/components/QuickLeadForm";
import HeroVideo from "@/components/sections/HeroVideo";
import SvgIcon from "@/components/common/SvgIcons";

// Editorial home hero (design A "Patrimonio"): ivory field, serif
// headline with a gold second line, a single promise, the phone in the
// open, and the QuickLeadForm sitting inside the hero itself — no longer
// a separate section below the fold. The wide media band in an arched
// frame sits between the copy and the form, so it is visible at the top
// of the page on mobile too (before the form it used to sit below it,
// far down the first screens). The band plays the home video muted on
// loop inside the arch, with the hero photo as poster/fallback (and
// instead of the video when the visitor prefers reduced motion). Then a
// single trust strip (the stats are shown here only, not repeated down
// the page).
// Server Component: same props and same text as the old Hero; no hooks.
type HeroStat = { value: string; label: string };

type HomeHeroProps = {
  locale?: "en" | "es";
  titleLine1: string;
  titleLine2?: string;
  subtitle?: string;
  badgeText?: string;
  stats?: HeroStat[];
  googleRating?: string;
  phoneNumber: string;
  phoneTel?: string;
  phoneDisplay?: string;
  imageSrc?: string;
  mobileImageSrc?: string;
  imageAlt?: string;
};

export default function HomeHero({
  locale = "en",
  titleLine1,
  titleLine2,
  subtitle,
  badgeText,
  stats = [],
  googleRating,
  phoneNumber,
  phoneTel,
  phoneDisplay,
  imageSrc,
  mobileImageSrc,
  imageAlt,
}: HomeHeroProps) {
  const isSpanish = locale === "es";
  const tel = phoneTel || phoneNumber;
  const display = phoneDisplay || phoneNumber;

  // The one promise the mock asks for: free inspection + same day,
  // inside business hours. Both strings already exist in the codebase
  // (city chips and the form's trust line); nothing new is claimed.
  const promise = isSpanish
    ? ["Inspección gratis", "Mismo día dentro del horario"]
    : ["Free inspection", "Same-day within business hours"];

  // Trust strip: the Sanity hero stats (Google value filled from the
  // live rating, as the old Hero did) plus the one-year workmanship
  // warranty — the four items are shown here only.
  const trustItems: HeroStat[] = [
    ...stats.map((item) => ({
      value:
        item.label.trim().toLowerCase().includes("google") ||
        item.label.trim().toLowerCase().includes("calificaci")
          ? googleRating ?? item.value
          : item.value,
      label: item.label,
    })),
    isSpanish
      ? { value: "1 Año", label: "Garantía de Mano de Obra" }
      : { value: "1-Year", label: "Workmanship Warranty" },
  ].filter((item) => item.value || item.label);

  return (
    <section
      id="hero"
      className="heritage-hero"
      aria-labelledby="heritage-hero-title"
    >
      <div className="heritage-hero-inner">
        <div className="heritage-hero-grid">
          <div className="heritage-hero-copy">
            {badgeText ? (
              <p className="heritage-hero-eyebrow">{badgeText}</p>
            ) : null}
            <h1 id="heritage-hero-title" className="heritage-hero-title">
              {titleLine1}{" "}
              {titleLine2 ? (
                <span className="heritage-hero-title-gold">{titleLine2}</span>
              ) : null}
            </h1>
            {subtitle ? (
              <p className="heritage-hero-subtitle">{subtitle}</p>
            ) : null}

            <ul className="heritage-hero-promise">
              {promise.map((item) => (
                <li key={item}>
                  <SvgIcon name="checkmark-circle" size={20} color="#c9a227" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="heritage-hero-ctas">
              <a
                href={`tel:${tel}`}
                className="heritage-hero-call"
              >
                <SvgIcon name="phone" size={18} />
                <span>
                  {isSpanish
                    ? `Llámanos al ${display}`
                    : `Call us at ${display}`}
                </span>
              </a>
              <a href="#quick-lead" className="heritage-hero-reserve">
                {isSpanish
                  ? "Reserva tu inspección gratis"
                  : "Reserve your free inspection"}
              </a>
            </div>
          </div>

          {imageSrc ? (
            <figure className="heritage-hero-photo">
              <HeroVideo
                imageSrc={imageSrc}
                mobileImageSrc={mobileImageSrc}
                imageAlt={imageAlt}
              />
            </figure>
          ) : null}

          <div className="heritage-hero-form">
            <QuickLeadForm
              locale={locale}
              phoneTel={tel}
              phoneDisplay={display}
            />
          </div>
        </div>

        {trustItems.length > 0 ? (
          <ul className="heritage-hero-trust" aria-label="Trust">
            {trustItems.map((item, i) => (
              <li key={`${item.label}-${i}`}>
                {item.value ? (
                  <span className="heritage-hero-trust-value">
                    {item.value}
                  </span>
                ) : null}
                <span className="heritage-hero-trust-label">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
