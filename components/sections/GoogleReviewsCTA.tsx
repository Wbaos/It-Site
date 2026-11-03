import { getGoogleReviewsUrl } from "@/lib/google-reviews";
import SvgIcon from "@/components/common/SvgIcons";

/**
 * Google reviews CTA for the home page.
 * Shows only verified summary data (5.0 rating, 26 Google reviews) and a
 * link to the real Google reviews page. No reviewer names or review texts
 * are rendered here: the live Google reviews feed is empty.
 * Locale-aware: English on "/" and Spanish on "/es/*".
 */
export default function GoogleReviewsCTA({ locale = "en" }: { locale?: "en" | "es" }) {
  const isSpanish = locale === "es";
  const googleReviewsUrl = getGoogleReviewsUrl();
  if (!googleReviewsUrl) return null;

  return (
    <section className="section testimonials">
      <div className="site-container-testimonials">
        <h2 className="testimonials-heading">{isSpanish ? "5.0 en Google" : "5.0 on Google"}</h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "4px",
            marginBottom: "0.5rem",
          }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <SvgIcon
              key={i}
              name="star"
              size={22}
              color="#facc15"
              className="star-filled"
            />
          ))}
        </div>
        <p className="testimonials-sub">{isSpanish ? "26 reseñas de Google" : "26 Google reviews"}</p>
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <a
            href={googleReviewsUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-write-review"
          >
            {isSpanish ? "Ver las 26 reseñas en Google" : "See all 26 reviews on Google"}
          </a>
        </div>
      </div>
    </section>
  );
}
