"use client";
import SvgIcon from "@/components/common/SvgIcons";

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
  stats?: Stat[];
};

export default function Hero({
  titleLine1 = "Friendly Tech Support",
  titleLine2 = "for Homes & Seniors",
  subtitle = "Serving Miami, Pembroke Pines, Broward & Homestead with fast WiFi fixes, computer help, smart-home setups, and patient device support.",
  badgeText = "Trusted In-Home Tech Support Across South Florida",
  primaryCtaText = "Contact Us",
  primaryCtaHref = "#contact",
  secondaryCtaText = "Request a Quote",
  secondaryCtaHref = "/request-quote",
  stats = [
    { value: "500+", label: "Local Clients Helped" },
    { value: "4.9/5", label: "Customer Satisfaction" },
    { value: "Same-Day", label: "Appointments Available" },
  ],
}: Props) {
  return (
    <section id="hero">

      {/* Badge */}
      {badgeText && <div className="hero-badge">{badgeText}</div>}

      {/* Title */}
      <h1 className="hero-title">
        <span className="hero-title-line1">{titleLine1}</span>
        <span className="hero-title-line2">{titleLine2}</span>
      </h1>

      {/* Subtitle */}
      {subtitle && <p className="hero-sub">{subtitle}</p>}

      {/* CTAs */}
      <div className="hero-ctas">
        {primaryCtaText && primaryCtaHref && (
          <a href={primaryCtaHref} className="btn-cta btn-primary">
            {primaryCtaText}
          </a>
        )}

        {secondaryCtaText && secondaryCtaHref && (
          <a href={secondaryCtaHref} className="btn-cta btn-secondary flex items-center gap-2">
            {/* Show document icon only for 'Request a Quote' */}
            <SvgIcon name="document" size={20} />
            {secondaryCtaText}
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
