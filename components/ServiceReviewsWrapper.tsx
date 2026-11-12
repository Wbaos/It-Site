import { getGoogleReviews, getGoogleReviewsUrl, getGoogleWriteReviewUrl } from "@/lib/google-reviews";
import ServiceReviews from "./ServiceReviews";

// Live Google reviews on every service page, from the same API source as
// the home page (lib/google-reviews). Same as the home page (12 Nov 2026):
// ALL reviews with text — a stars-only review rendered as an empty card.
// With more reviews than the 3 visible columns, the carousel shows the
// prev/next arrows. When the API fails or returns nothing, renders
// nothing — the count and the review text are never hardcoded. The "Write
// a Review" button lives here too, so it only shows when reviews exist.

export default async function ServiceReviewsWrapper({
  slug,
  locale = "en",
}: {
  slug: string;
  locale?: "en" | "es";
}) {
  const reviews = await getGoogleReviews(locale);
  // Only reviews with text (12 Nov 2026, same as the home page): a
  // stars-only review rendered as an empty card (Juan Figueroa first).
  // No limit — all of them, like the home page, so the carousel arrows
  // show and visitors can browse every review.
  const initialReviews = (reviews ?? []).filter(
    (r) => (r.text ?? "").trim().length > 0
  );
  if (initialReviews.length === 0) return null;
  const googleReviewsUrl = getGoogleReviewsUrl();
  const googleWriteReviewUrl = getGoogleWriteReviewUrl();
  return (
    <div className="site-container-testimonials">
      <ServiceReviews
        slug={slug}
        initialReviews={initialReviews}
        locale={locale}
        googleReviewsUrl={googleReviewsUrl}
      />
      <div className="reviews-section">
        <div className="review-action-footer">
          {googleWriteReviewUrl && (
            <a
              href={googleWriteReviewUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-write-review"
            >
              {locale === "es" ? "Escribe una reseña" : "Write a Review"}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
