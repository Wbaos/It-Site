"use client";
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
  phoneNumber = FALLBACK_SETTINGS.phoneTel,
  showCallButton = true,
  imageSrc = "https://cdn.sanity.io/images/celkrwoq/production/5deeea70b525963987af93601f412cebdbede547-5712x4284.webp",
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
    <section id="hero" role="region" aria-labelledby="hero-title">
      {imageSrc && (
        <picture className="hero-bg">
          {mobileImageSrc && (
            <source media="(max-width: 760px)" srcSet={mobileImageSrc} />
          )}
          <img
            src={imageSrc}
            alt=""
            aria-hidden="true"
            className="hero-bg-img"
            width={1600}
            height={1200}
            loading="eager"
            fetchPriority="high"
          />
        </picture>
      )}
      <div className="hero-scrim" aria-hidden="true" />

      {/* Badge */}
      {badgeText && <div className="hero-badge">{badgeText}</div>}

      {/* Title */}
      <h1 id="hero-title" className="hero-title">
        <span className="hero-title-line1">{titleLine1}</span>
        {titleLine2 && (
          <span className="hero-title-line2">{titleLine2}</span>
        )}
      </h1>

      {/* Subtitle */}
      {subtitle && <p className="hero-sub">{subtitle}</p>}

      {/* CTAs */}
      <div className="hero-ctas">
        {primaryCtaText && primaryCtaHref && (
          isPrimaryPhoneLink ? (
            <a
              href={primaryCtaHref}
              className="btn-cta btn-primary"
              aria-label="Call CallTechCare for sprinkler repair in Miami and Broward"
            >
              {primaryCtaText}
            </a>
          ) : (
            <Link
              href={primaryCtaHref}
              className="btn-cta btn-primary"
              aria-label="Get sprinkler repair and irrigation service in Miami and Broward"
            >
              {primaryCtaText}
            </Link>
          )
        )}

        {secondaryCtaText && secondaryCtaHref && (
          <Link
            href={secondaryCtaHref}
            className="btn-cta btn-secondary flex items-center gap-2"
            aria-label="Send us a quick message for sprinkler repair in Miami and Broward"
          >
            <SvgIcon name="document" size={20} />
            {secondaryCtaText}
          </Link>
        )}
        {showCallButton && !isPrimaryPhoneLink && (
        <a
          href={`tel:${phoneNumber}`}
          className="btn-cta btn-cta btn-primary flex items-center gap-2"
          aria-label="Call CallTechCare for sprinkler repair in Miami and Broward"
        >
          <SvgIcon name="phone" size={20} />
          Call Now
        </a>
      )}
      </div>

      <div className="hero-stats">
        {visibleStats.map((s, i) => (
          <div className="hero-stat-card" key={i}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

    </section>
  );
}
