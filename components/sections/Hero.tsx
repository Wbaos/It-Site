"use client";

type Stat = { value: string; label: string };

type Props = {
  imageSrc: string;
  titleLine1: string;
  titleLine2: string;
  subtitle?: string;
  badgeText?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  stats?: Stat[];
};

export default function Hero({
  imageSrc,
  titleLine1,
  titleLine2,
  subtitle,
  badgeText = "24/7 Professional IT Support",
  primaryCtaText = "Get Started",
  primaryCtaHref = "#",
  secondaryCtaText = "View Services",
  secondaryCtaHref = "#",
  stats = [
    { value: "500+", label: "Happy Clients" },
    { value: "99.9%", label: "Uptime Guarantee" },
    { value: "<15min", label: "Response Time" },
  ],
}: Props) {
  return (
    <section id="hero">
      <img
        src={imageSrc}
        alt="Hero background"
        className="hero-img"
        fetchPriority="high"
        decoding="async"
        width={1600}
        height={900}
      />

      <div className="hero-overlay"></div>

      <div className="hero-container">

        {badgeText && <div className="hero-badge">{badgeText}</div>}

        <h1 className="hero-title">
          <span className="hero-title-line1">{titleLine1}</span>
          <span className="hero-title-line2">{titleLine2}</span>
        </h1>

        {subtitle && <p className="hero-sub">{subtitle}</p>}

        <div className="hero-ctas">
          {primaryCtaText && primaryCtaHref && (
            <a href={primaryCtaHref} className="btn-cta btn-primary">
              {primaryCtaText} →
            </a>
          )}

          {secondaryCtaText && secondaryCtaHref && (
            <a href={secondaryCtaHref} className="btn-cta btn-secondary">
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

      </div>
    </section>
  );
}
