import {
  getGoogleReviewsUrl,
  getGoogleRatingSummary,
  formatGoogleRating,
  type GoogleRatingSummary,
} from "@/lib/google-reviews";
import SvgIcon from "@/components/common/SvgIcons";

/**
 * Google reviews CTA for the home page.
 * Shows the live Google rating summary (rating + review count) from the
 * single shared source in lib/google-reviews (Sanity site-settings), and
 * a link to the real Google reviews page. No reviewer names or review
 * texts are rendered here.
 * Locale-aware: English on "/" and Spanish on "/es/*".
 * When Sanity cannot be read (no summary), the whole section hides
 * instead of showing a stale number.
 */
export default async function GoogleReviewsCTA({
  locale = "en",
  ratingSummary,
}: {
  locale?: "en" | "es";
  ratingSummary?: GoogleRatingSummary | null;
}) {
  const isSpanish = locale === "es";
  const googleReviewsUrl = getGoogleReviewsUrl();
  const summary = ratingSummary ?? (await getGoogleRatingSummary());
  if (!summary) return null;
  const rating = formatGoogleRating(summary.rating);
  const total = summary.total;

  return (
    <section className="section testimonials">
      <div className="site-container-testimonials google-cta-card">
        <div className="google-cta-photo">
          <img
            src="https://cdn.sanity.io/images/celkrwoq/production/7b390027ba801d9cd8d1b588194d1787b25004f8-1024x768.jpg?w=800&auto=format&q=80"
            alt={isSpanish ? "Sprinklers regando un jardín con piedras negras y palmera" : "Sprinklers watering a garden with black stones and a palm tree"}
            width={600}
            height={400}
            loading="lazy"
          />
        </div>
        <div className="google-cta-content">
        <h2 className="testimonials-heading">{isSpanish ? `${rating} en Google` : `${rating} on Google`}</h2>
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
              size={28}
              color="#facc15"
              className="star-filled"
            />
          ))}
        </div>
        <p className="testimonials-sub">{isSpanish ? `${total} reseñas de Google` : `${total} Google reviews`}</p>
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <a
            href={googleReviewsUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-write-review"
          >
            {isSpanish ? `Ver las ${total} reseñas en Google` : `See all ${total} reviews on Google`}
          </a>
        </div>
        </div>
      </div>
    </section>
  );
}
