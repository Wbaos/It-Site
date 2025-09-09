// components/sections/Hero.tsx
type Props = {
  imageSrc?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
};

export default function Hero({
  imageSrc = "/helping2.jpg",
  title = "Patient, friendly tech help—right at home.",
  subtitle = "We set up phones, Wi-Fi, TVs, and protect against scams.",
  ctaText = "Book a Visit",
  ctaHref = "#contact",
}: Props) {
  return (
    <section id="hero">
      <img
        src={imageSrc}
        alt="Senior receiving tech help"
        className="hero-img"
      />
      <div className="hero-overlay">
        <div className="hero-content">
          <h1 className="hero-title">{title}</h1>
          {subtitle && <p className="hero-sub">{subtitle}</p>}
          {ctaText && ctaHref && (
            <a href={ctaHref} className="btn-cta">
              {ctaText}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
