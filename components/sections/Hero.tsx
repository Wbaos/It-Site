// Server Component (no "use client"): Hero is pure presentational markup
// with no hooks or event handlers, and its only importer (CityTemplate)
// is a Server Component — so the hero renders on the server and never
// ships as client JS or hydrates (CWV lot 20, 16 Nov 2026). Keep it that
// way: do not add hooks/handlers here.
import Image from "next/image";
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
  // so every city page uses this). The bare Sanity asset URL — no ?w=…
  // baked in — so next/image below picks the real width from `sizes`
  // instead of upscaling a 1920px source to 2048px. The raw file is
  // 5712x4284 (5.6 MB); the CDN resize is what keeps it off the LCP
  // budget, same as before, only now the width is chosen per viewport.
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
    <section
      id="hero"
      className="heritage-city-hero"
      role="region"
      aria-labelledby="hero-title"
    >
      <div className="heritage-city-hero-inner">
        {/* Eyebrow */}
        {badgeText && <p className="heritage-city-hero-eyebrow">{badgeText}</p>}

        {/* Title. Line 1 ends with a colon when line 2 exists: the two
            spans used to run together ("Sprinkler Repair in Miramar
            Irrigation • Repairs • New Systems"), so the H1 read as if
            the city were called "Miramar Irrigation". The colon keeps
            line 1 a heading and line 2 its (gold, smaller) subtitle. */}
        <h1 id="hero-title" className="heritage-city-hero-title">
          <span className="heritage-city-hero-title-line1">{titleLine1}{titleLine2 ? ":" : ""}</span>
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
            background with a scrim. next/image (was a plain <img> at a
            fixed w=1920): with `sizes` a phone picks 640/828w (~113 KB
            for this file) instead of the full 949 KB, and `priority`
            keeps the fetchpriority="high" + preload the plain img had.
            The hero inner is max 1100px wide, so 1100px is the desktop
            size. */}
        {imageSrc && (
          <figure className="heritage-city-hero-photo">
            <picture>
              {mobileImageSrc && (
                <source media="(max-width: 760px)" srcSet={mobileImageSrc} />
              )}
              <Image
                src={imageSrc}
                alt={imageAlt}
                className="heritage-city-hero-photo-img"
                width={1600}
                height={1200}
                priority
                sizes="(max-width: 760px) 100vw, 1100px"
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
