import { getGoogleReviewsUrl } from "@/lib/google-reviews";
import SvgIcon from "@/components/common/SvgIcons";

/**
 * Google reviews CTA for the home page.
 * Shows only verified summary data (5.0 rating, 26 Google reviews) and a
 * link to the real Google reviews page. No reviewer names or review texts
 * are rendered here: the live Google reviews feed is empty.
 */
export default function GoogleReviewsCTA() {
  const googleReviewsUrl = getGoogleReviewsUrl();
  if (!googleReviewsUrl) return null;

  return (
    <section className="section testimonials">
      <div className="site-container-testimonials">
        <h2 className="testimonials-heading">5.0 en Google</h2>
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
        <p className="testimonials-sub">26 reseñas de Google</p>
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <a
            href={googleReviewsUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-write-review"
          >
            Ver las 26 reseñas en Google
          </a>
        </div>
      </div>
    </section>
  );
}
