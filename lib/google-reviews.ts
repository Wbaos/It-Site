import type { Testimonial } from "@/components/common/TestimonialsList";

export function getGoogleReviewsUrl(): string | null {
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!placeId) return null;
  return `https://search.google.com/local/reviews?placeid=${encodeURIComponent(placeId)}`;
}

export function getGoogleWriteReviewUrl(): string | null {
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!placeId) return null;
  return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`;
}

/**
 * Single shared source for the live Google rating summary.
 *
 * Every place on the site that shows the Google rating or the review count
 * reads from here — one fetch function with its cache, and one fallback
 * constant below. No component keeps its own copy of the numbers, so when
 * a new review arrives on Google the rating and the total change everywhere
 * at the same time (within the 1-hour cache).
 */
export type GoogleRatingSummary = {
  rating: number;
  total: number;
};

/** The only fallback in the codebase: used everywhere the live summary is unavailable. */
export const FALLBACK_GOOGLE_RATING_SUMMARY: GoogleRatingSummary = {
  rating: 5.0,
  total: 26,
};

/** One decimal, as displayed everywhere on the site. */
export function formatGoogleRating(rating: number): string {
  return rating.toFixed(1);
}

export async function getGoogleRatingSummary(): Promise<GoogleRatingSummary | null> {
  const placeId = process.env.GOOGLE_PLACE_ID;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!placeId || !apiKey) return null;

  const url =
    `https://maps.googleapis.com/maps/api/place/details/json` +
    `?place_id=${placeId}` +
    `&fields=rating,user_ratings_total` +
    `&key=${apiKey}`;

  try {
    const res = await fetch(url, { next: { revalidate: 60 * 60 } });
    const data = await res.json();
    const rating = data?.result?.rating;
    const total = data?.result?.user_ratings_total;
    if (typeof rating !== "number" || typeof total !== "number") return null;
    return { rating, total };
  } catch {
    return null;
  }
}

/**
 * Replaces the fallback rating/count phrases inside a text with the live
 * summary values. The phrases are built from the single fallback constant
 * above, so the numbers 5.0/26 appear nowhere else in the codebase.
 * Used for FAQ answers that quote the rating (code defaults and Sanity
 * content alike): when the summary equals the fallback, the text is
 * unchanged.
 */
export function applyGoogleRatingSummaryToText(
  text: string,
  summary: GoogleRatingSummary
): string {
  const fallback = FALLBACK_GOOGLE_RATING_SUMMARY;
  const fallbackRating = formatGoogleRating(fallback.rating);
  const rating = formatGoogleRating(summary.rating);
  return text
    .replaceAll(
      `${fallbackRating} rating from ${fallback.total} Google reviews`,
      `${rating} rating from ${summary.total} Google reviews`
    )
    .replaceAll(
      `calificación ${fallbackRating} con ${fallback.total} reseñas en Google`,
      `calificación ${rating} con ${summary.total} reseñas en Google`
    );
}

export async function getGoogleReviews(): Promise<Testimonial[]> {
  const placeId = process.env.GOOGLE_PLACE_ID;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!placeId || !apiKey) return [];

  const url =
    `https://maps.googleapis.com/maps/api/place/details/json` +
    `?place_id=${placeId}` +
    `&fields=reviews` +
    `&key=${apiKey}`;

  const res = await fetch(url, { next: { revalidate: 60 * 60 } });
  const data = await res.json();

  if (!data?.result?.reviews) return [];

  return data.result.reviews.map((r: any) => ({
    name: r.author_name,
    text: r.text,
    rating: r.rating,
    verified: true,
    date: new Date(r.time * 1000).toISOString(),
  }));
}
