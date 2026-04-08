"use client";
import SvgIcon from "@/components/common/SvgIcons";
import Link from "next/link";

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
  stats?: Stat[];
};

export default function Hero({
  titleLine1 = "Sprinkler Repair Miami",
  titleLine2 = "Irrigation • Cameras • Tech Services",
  subtitle = "Professional sprinkler repair and irrigation services in Miami and Broward. We also install security cameras and provide expert tech support for homes and businesses.",
  badgeText = "Sprinkler Repair & Irrigation in Miami & Broward",
  primaryCtaText = "Call Now",
  primaryCtaHref = "tel:+17863662729",
  secondaryCtaText = "Request a Quote",
  secondaryCtaHref = "/request-quote",
  phoneNumber = "+17863662729",
  showCallButton = true,
  stats = [
    { value: "500+", label: "Local Clients Helped" },
    { value: "4.9/5", label: "Customer Satisfaction" },
    { value: "Same-Day", label: "Appointments Available" },
  ],
}: Props) {
  const isPrimaryPhoneLink = typeof primaryCtaHref === "string" && primaryCtaHref.startsWith("tel:");

  return (
    <section id="hero" role="region" aria-labelledby="hero-title">

      {/* Badge */}
      {badgeText && <div className="hero-badge">{badgeText}</div>}

      {/* Title */}
      <h1 id="hero-title" className="hero-title">
        <span className="hero-title-line1">{titleLine1}</span>
        <span className="hero-title-line2">{titleLine2}</span>
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
            aria-label="Request a quote for sprinkler repair in Miami and Broward"
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
        {stats.map((s, i) => (
          <div className="hero-stat-card" key={i}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

    </section>
  );
}
