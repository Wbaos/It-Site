import type { Testimonial } from "@/components/common/TestimonialsList";
import { getSiteSettings } from "@/lib/sanitySettings";

/**
 * INTERIM BRIDGE — Google reviews via Sanity, not via the Places API.
 *
 * The saved Places Place ID is dead and no Google search API returns this
 * service-area business, so the rating, the review count and the review
 * texts live in the Sanity `siteSettings` document (fields googleRating,
 * googleReviewCount, googleReviews) until the Business Profile Reviews API
 * access is approved. When that happens, REMOVE this whole bridge and
 * point these functions at Google directly: this file is the only place
 * that knows where the numbers come from, so no other file has to change
 * except dropping the Sanity fields.
 *
 * There is deliberately NO hardcoded fallback rating/count anywhere in
 * this file or in any display path. If Sanity cannot be read, or the
 * fields are missing, the getters below return null / [] and every
 * consumer HIDES the rating/count instead of showing a stale number.
 */

/** Verified public Maps listing for CallTechCare (from the live profile). */
export const GOOGLE_MAPS_LISTING_URL =
  "https://www.google.com/maps/place/CallTechCare/data=!4m2!3m1!1s0x0:0x9d846b1bde61b324";

/**
 * Link to read all reviews on Google. It used to be built from the
 * GOOGLE_PLACE_ID, which is dead, so it now points at the verified public
 * Maps listing instead.
 */
export function getGoogleReviewsUrl(): string {
  return GOOGLE_MAPS_LISTING_URL;
}

/**
 * Link to write a review. The old search.google.com writereview URL also
 * depended on the dead Place ID; the public Maps listing is where
 * visitors can leave a review.
 */
export function getGoogleWriteReviewUrl(): string {
  return GOOGLE_MAPS_LISTING_URL;
}

/**
 * Single shared source for the live Google rating summary.
 *
 * Every place on the site that shows the Google rating or the review count
 * reads from here — one fetch of the Sanity site-settings document. No
 * component keeps its own copy of the numbers, so when the count is
 * updated in Sanity the rating and the total change everywhere at the
 * same time.
 */
export type GoogleRatingSummary = {
  rating: number;
  total: number;
};

/** One decimal, as displayed everywhere on the site. */
export function formatGoogleRating(rating: number): string {
  return rating.toFixed(1);
}

/**
 * Rating summary from Sanity site-settings. Returns null when Sanity
 * cannot be read or when either field is missing — callers must hide the
 * count/rating in that case. It NEVER calls the Places API (the saved
 * Place ID is dead) and never falls back to a hardcoded number.
 */
export async function getGoogleRatingSummary(): Promise<GoogleRatingSummary | null> {
  let settings;
  try {
    settings = await getSiteSettings();
  } catch {
    return null;
  }
  const rating = settings?.googleRating;
  const total = settings?.googleReviewCount;
  if (typeof rating !== "number" || typeof total !== "number") return null;
  return { rating, total };
}

// Legacy rating/count phrases that may still appear in Sanity/FAQ copy
// (written when the count was 26). They are search patterns only — they
// are never rendered — and are replaced with the live Sanity values, or
// with neutral wording when there is no summary (see below).
const LEGACY_RATING_PHRASE_EN = "5.0 rating from 26 Google reviews";
const LEGACY_RATING_PHRASE_ES = "calificación 5.0 con 26 reseñas en Google";

/**
 * Replaces the rating/count phrases inside a text with the live summary
 * values. Handles both the legacy phrases above (Sanity copy written
 * before the bridge) and the {{googleRatingEn}} / {{googleRatingEs}}
 * placeholders used by the code FAQ defaults.
 *
 * Null-summary case (documented choice): when there is no summary, the
 * phrases are replaced with neutral wording that carries NO numbers
 * ("a top rating on Google" / "una excelente calificación en Google")
 * instead of leaving the stale 5.0/26 in place. The sentence stays
 * grammatical, and no stale number is ever rendered. The FAQ section
 * stays visible with that wording; the stat cards and CTAs that show
 * only the numbers hide themselves instead (see their components).
 */
export function applyGoogleRatingSummaryToText(
  text: string,
  summary: GoogleRatingSummary | null
): string {
  const rating = summary ? formatGoogleRating(summary.rating) : null;
  const phraseEn = summary
    ? `a ${rating} rating from ${summary.total} Google reviews`
    : "a top rating on Google";
  const phraseEs = summary
    ? `una calificación ${rating} con ${summary.total} reseñas en Google`
    : "una excelente calificación en Google";
  return text
    .replaceAll(LEGACY_RATING_PHRASE_EN, phraseEn)
    .replaceAll(LEGACY_RATING_PHRASE_ES, phraseEs)
    .replaceAll("{{googleRatingEn}}", phraseEn)
    .replaceAll("{{googleRatingEs}}", phraseEs);
}

/**
 * Review list from the Sanity site-settings googleReviews array, mapped
 * to Testimonial. Texts are shown as-is, in the language the reviewer
 * wrote them; only the surrounding chrome is translated. Nothing is
 * invented here: entries with a name but no text (three real 5-star
 * reviews have no text) still render as name + stars, and name/rating/
 * date pass through only when present. Returns [] when Sanity cannot be
 * read or the array is empty — callers hide the section in that case.
 * Dates are the relative strings from the Business Profile dashboard
 * ("a week ago", "10 weeks ago", "a year ago") — never calendar dates,
 * and never invented; TestimonialsList shows the raw string when it
 * cannot be parsed as a date.
 */
export async function getGoogleReviews(): Promise<Testimonial[]> {
  let settings;
  try {
    settings = await getSiteSettings();
  } catch {
    return [];
  }
  const reviews = settings?.googleReviews;
  if (!Array.isArray(reviews)) return [];
  // Include every entry that has a name or text — three real Google
  // reviews have a 5-star rating and a name but NO text, and they still
  // render (name + stars). Nothing is invented: name/rating/date pass
  // through only when present, and text stays exactly as entered.
  return reviews
    .filter(
      (r) =>
        (typeof r?.name === "string" && r.name.trim().length > 0) ||
        (typeof r?.text === "string" && r.text.trim().length > 0)
    )
    .map((r) => ({
      name: r.name,
      text: r.text ?? "",
      rating: r.rating,
      verified: Boolean(r.verified),
      date: r.date,
    }));
}
