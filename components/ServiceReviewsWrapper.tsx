import { getGoogleReviews, getGoogleReviewsUrl, getGoogleWriteReviewUrl } from "@/lib/google-reviews";
import ServiceReviews from "./ServiceReviews";

// Live Google reviews on every service page, from the same API source as
// the home page (lib/google-reviews). Limited to the 3 most recent reviews
// with text (12 Nov 2026, same as the home page — a stars-only review
// rendered as an empty card). When the API fails or returns nothing,
// renders nothing — the count and the review text are never hardcoded.
// The "Write a Review" button lives here too, so it only shows when
// reviews exist.
const MAX_SERVICE_REVIEWS = 3;

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
  const initialReviews = (reviews ?? [])
    .filter((r) => (r.text ?? "").trim().length > 0)
    .slice(0, MAX_SERVICE_REVIEWS);
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
