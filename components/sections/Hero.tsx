// Server Component (no "use client"): Hero is pure presentational markup
// with no hooks or event handlers, and its only importer (CityTemplate)
// is a Server Component — so the hero renders on the server and never
// ships as client JS or hydrates (CWV lot 20, 16 Nov 2026). Keep it that
// way: do not add hooks/handlers here.
import SvgIcon from "@/components/common/SvgIcons";
import Link from "next/link";
import { FALLBACK_SETTINGS } from "@/lib/sanitySettings";

type Stat = { value: string; label: string };

type Props = {
  titleLine1?: string;
  titleLine2?: string;
  subtitle?: string;
  badgeText?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  /**
   * Accessible label for the secondary CTA. City pages pass their own
   * label naming the city (audit fix 2026-11-10); the home hero keeps
   * the generic label below.
   */
  secondaryCtaAriaLabel?: string;
  phoneNumber?: string;
  showCallButton?: boolean;
  imageSrc?: string;
  mobileImageSrc?: string;
  imageAlt?: string;
  stats?: Stat[];
  /**
   * Live Google rating, already formatted to one decimal, from the single shared
   * source in lib/google-reviews. Passed by the server parent; when present
   * it replaces the Google Rating stat value, so the hero updates everywhere
   * at the same time as the rest of the site.
   */
  googleRating?: string;
};

export default function Hero({
  titleLine1 = "Sprinkler Repair Miami",
  titleLine2 = "Irrigation • Repairs • New Systems",
  subtitle = "Professional sprinkler repair and irrigation services in Miami and Broward. We also install security cameras.",
  badgeText = "Sprinkler Repair & Irrigation in Miami & Broward",
  primaryCtaText = "Call Now",
  primaryCtaHref = `tel:${FALLBACK_SETTINGS.phoneTel}`,
  // No secondary CTA by default: the quote flow is hidden for now.
  // Callers must pass secondaryCtaText + secondaryCtaHref explicitly.
  secondaryCtaText,
  secondaryCtaHref,
  secondaryCtaAriaLabel = "Send us a quick message for sprinkler repair in Miami and Broward",
  phoneNumber = FALLBACK_SETTINGS.phoneTel,
  showCallButton = true,
  // Default hero image (city pages: CityTemplate does not pass imageSrc,
  // so every city page uses this). Served through the Sanity CDN at 1920w
  // instead of the raw 5712x4284 original: same image, same on-screen
  // size (the hero never displays wider than a desktop viewport), but
  // 949 KB instead of 5.6 MB. The raw file was the LCP element on all
  // 32 city pages (SEMrush CWV: Miami LCP 6.23s, 16 Nov 2026) and decoding
  // a 24 MP image also cost main-thread time (TBT 420ms). No visible
  // quality change — CDN resize only, q=80 like the home hero.
  imageSrc = "https://cdn.sanity.io/images/celkrwoq/production/5deeea70b525963987af93601f412cebdbede547-5712x4284.webp?w=1920&auto=format&q=80",
  mobileImageSrc,
  imageAlt = "Sprinkler system working",
  stats = [
    { value: "1500+", label: "Local Clients Helped" },
    // Google Rating value comes from the `googleRating` prop (live Sanity
    // value, passed by the server parent). The empty default is filtered
    // out at render below, so no stale number ever shows.
    { value: "", label: "Google Rating" },
    { value: "Same-Day", label: "Appointments Available" },
  ],
  googleRating,
}: Props) {
  const isPrimaryPhoneLink = typeof primaryCtaHref === "string" && primaryCtaHref.startsWith("tel:");
  const effectiveStats = googleRating
    ? stats.map((s) =>
        s.label === "Google Rating" || s.label === "Calificación en Google"
          ? { ...s, value: googleRating }
          : s
      )
    : stats;
  // Stats with no value (e.g. the Google Rating stat when no live rating
  // was passed) are hidden instead of rendering an empty or stale number.
  const visibleStats = effectiveStats.filter((s) => s.value);

  return (
    <section
      id="hero"
      className="heritage-city-hero"
      role="region"
      aria-labelledby="hero-title"
    >
      <div className="heritage-city-hero-inner">
        {/* Eyebrow */}
        {badgeText && <p className="heritage-city-hero-eyebrow">{badgeText}</p>}

        {/* Title */}
        <h1 id="hero-title" className="heritage-city-hero-title">
          <span className="heritage-city-hero-title-line1">{titleLine1}</span>
          {titleLine2 && (
            <span className="heritage-city-hero-title-line2">{titleLine2}</span>
          )}
        </h1>

        {/* Subtitle */}
        {subtitle && <p className="heritage-city-hero-sub">{subtitle}</p>}

        {/* CTAs */}
        <div className="heritage-city-hero-ctas">
          {primaryCtaText && primaryCtaHref && (
            isPrimaryPhoneLink ? (
              <a
                href={primaryCtaHref}
                className="heritage-city-hero-call"
                aria-label="Call CallTechCare for sprinkler repair in Miami and Broward"
              >
                <SvgIcon name="phone" size={18} />
                {primaryCtaText}
              </a>
            ) : (
              <Link
                href={primaryCtaHref}
                className="heritage-city-hero-call"
                aria-label="Get sprinkler repair and irrigation service in Miami and Broward"
              >
                {primaryCtaText}
              </Link>
            )
          )}

          {secondaryCtaText && secondaryCtaHref && (
            <Link
              href={secondaryCtaHref}
              className="heritage-city-hero-reserve"
              aria-label={secondaryCtaAriaLabel}
            >
              <SvgIcon name="document" size={20} />
              {secondaryCtaText}
            </Link>
          )}
          {showCallButton && !isPrimaryPhoneLink && (
            <a
              href={`tel:${phoneNumber}`}
              className="heritage-city-hero-call"
              aria-label="Call CallTechCare for sprinkler repair in Miami and Broward"
            >
              <SvgIcon name="phone" size={20} />
              Call Now
            </a>
          )}
        </div>

        {/* Real photo band in an arched frame — same image, same
            LCP-critical attributes as before, no longer a full-bleed
            background with a scrim. */}
        {imageSrc && (
          <figure className="heritage-city-hero-photo">
            <picture>
              {mobileImageSrc && (
                <source media="(max-width: 760px)" srcSet={mobileImageSrc} />
              )}
              <img
                src={imageSrc}
                alt={imageAlt}
                className="heritage-city-hero-photo-img"
                width={1600}
                height={1200}
                loading="eager"
                fetchPriority="high"
              />
            </picture>
          </figure>
        )}

        <ul className="heritage-city-hero-trust" aria-label="Trust">
          {visibleStats.map((s, i) => (
            <li key={i}>
              <span className="heritage-city-hero-trust-value">{s.value}</span>
              <span className="heritage-city-hero-trust-label">{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
