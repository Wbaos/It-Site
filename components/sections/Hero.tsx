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
  titleLine1 = "Local Home, Outdoor & Tech Services",
  titleLine2 = "for Homes & Small Businesses in South Florida",
  subtitle =
    "Serving Miami, Pembroke Pines, Broward County, and Homestead with professional home, outdoor, and tech services including security camera installation, TV mounting, Wi-Fi & internet troubleshooting, computer and printer support, phone & tablet help, senior-friendly in-home tech support, sprinkler & irrigation service, and tree trimming.",
  badgeText = "Trusted Local Services in South Florida",
  primaryCtaText = "Contact Us",
  primaryCtaHref = "#contact",
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
          <Link
            href={primaryCtaHref}
            className="btn-cta btn-primary"
            aria-label="Contact CallTechCare for home, outdoor, or tech services"
          >
            {primaryCtaText}
          </Link>
        )}

        {secondaryCtaText && secondaryCtaHref && (
          <Link
            href={secondaryCtaHref}
            className="btn-cta btn-secondary flex items-center gap-2"
            aria-label="Request a service quote from CallTechCare"
          >
            <SvgIcon name="document" size={20} />
            {secondaryCtaText}
          </Link>
        )}
        {showCallButton && (
        <a
          href={`tel:${phoneNumber}`}
          className="btn-cta btn-cta btn-primary flex items-center gap-2"
          aria-label="Call CallTechCare now"
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
