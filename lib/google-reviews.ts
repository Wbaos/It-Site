import type { Testimonial } from "@/components/common/TestimonialsList";
import {
  getGoogleReviewsCopy,
  type GoogleReviewsCopy,
} from "@/lib/sanitySettings";

/**
 * Google reviews from the durable Sanity copy.
 *
 * The rating, the review count and the review texts live in the
 * `site-settings` document (fields googleRating, googleReviewCount,
 * googleReviews, googleReviewsUpdatedAt), written once a day by the
 * /api/cron/sync-reviews job from the Google Business Profile Reviews
 * API. The site NEVER calls Google on a visitor's request — no GBP
 * OAuth code lives in this file anymore (it moved to lib/gbp-reviews.ts,
 * used only by the sync job) — so a Google outage or an expired token
 * never empties the reviews on the site: the last good copy keeps
 * showing until the next successful sync.
 *
 * There is deliberately NO hardcoded fallback rating/count anywhere.
 * If Sanity has no copy yet (fields empty), the getters below return
 * null / [] and every consumer HIDES the rating/count instead of
 * showing a stale number.
 *
 * One in-memory cache (1 hour) lets the rating summary and the review
 * list share a single Sanity read per render. Only successful reads are
 * cached — a failed read is never cached. The copy changes at most once
 * a day, and new reviews can take up to a day to appear; the on-demand
 * revalidation webhook refreshes the pages when Sanity content changes.
 */

/** Verified public Maps listing for CallTechCare (from the live profile). */
export const GOOGLE_MAPS_LISTING_URL =
  "https://www.google.com/maps/place/CallTechCare/data=!4m2!3m1!1s0x0:0x9d846b1bde61b324";

/**
 * Link to read all reviews on Google. Points at the verified public
 * Maps listing.
 */
export function getGoogleReviewsUrl(): string {
  return GOOGLE_MAPS_LISTING_URL;
}

/**
 * Link to write a review. The public Maps listing is where visitors
 * can leave a review.
 */
export function getGoogleWriteReviewUrl(): string {
  return GOOGLE_MAPS_LISTING_URL;
}

/**
 * Single shared source for the Google rating summary.
 *
 * Every place on the site that shows the Google rating or the review count
 * reads from here — one Sanity read, shared with the review list below.
 * No component keeps its own copy of the numbers, so when the synced
 * count changes the rating and the total change everywhere at the same time.
 */
export type GoogleRatingSummary = {
  rating: number;
  total: number;
};

/** One decimal, as displayed everywhere on the site. */
export function formatGoogleRating(rating: number): string {
  return rating.toFixed(1);
}

const CACHE_TTL_MS = 3_600_000; // 1 hour
let cachedAt = 0;
let cachedCopy: GoogleReviewsCopy | null = null;

/** The Sanity copy, shared by the summary and the review list. */
async function fetchGoogleReviewsCopy(): Promise<GoogleReviewsCopy | null> {
  if (cachedCopy && Date.now() - cachedAt < CACHE_TTL_MS) {
    return cachedCopy;
  }
  const copy = await getGoogleReviewsCopy();
  if (!copy) return null;
  cachedCopy = copy;
  cachedAt = Date.now();
  return copy;
}

/**
 * Rating summary from the Sanity copy. Returns null when there is no
 * copy yet or when either field is missing — callers must hide the
 * count/rating in that case. It NEVER falls back to a hardcoded number.
 */
export async function getGoogleRatingSummary(): Promise<GoogleRatingSummary | null> {
  const copy = await fetchGoogleReviewsCopy();
  const rating = copy?.rating;
  const total = copy?.total;
  if (typeof rating !== "number" || typeof total !== "number") return null;
  return { rating, total };
}

// Legacy rating/count phrases that still appear in the Sanity contactPage
// FAQ copy (written when the count was 26 — e.g. "we hold a 5.0 rating
// from 26 Google reviews"). They are search patterns only — they are
// never rendered — and are replaced with the synced Google values, or with
// neutral wording when there is no summary (see below). The Sanity
// sentences already carry their own article ("a " / "una ") before the
// phrase, so the legacy replacement carries NO article, while the
// {{googleRatingEn}} / {{googleRatingEs}} placeholders DO ("we hold
// {{googleRatingEn}}" needs its "a"). Without that split the render
// would read "a a 5.0 rating…" — the bridge code had exactly that bug.
// (The homePage whyCards Google card does NOT need these: WhyChooseUs
// replaces that card's text with the synced values at render.)
const LEGACY_RATING_PHRASE_EN = "5.0 rating from 26 Google reviews";
const LEGACY_RATING_PHRASE_ES = "calificación 5.0 con 26 reseñas en Google";

/**
 * Replaces the rating/count phrases inside a text with the synced summary
 * values. Handles both the legacy phrases above (Sanity copy written
 * before the count moved past 26) and the {{googleRatingEn}} /
 * {{googleRatingEs}} placeholders used by the code FAQ defaults.
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
  // No leading article: the Sanity sentences already have one ("we hold
  // a …" / "tenemos una …") before the legacy phrase.
  const phraseEn = summary
    ? `${rating} rating from ${summary.total} Google reviews`
    : "top rating on Google";
  const phraseEs = summary
    ? `calificación ${rating} con ${summary.total} reseñas en Google`
    : "excelente calificación en Google";
  // With a leading article: the {{…}} placeholders sit where the whole
  // phrase, article included, belongs ("we hold {{googleRatingEn}}").
  const placeholderEn = summary ? `a ${phraseEn}` : "a top rating on Google";
  const placeholderEs = summary
    ? `una ${phraseEs}`
    : "una excelente calificación en Google";
  return text
    .replaceAll(LEGACY_RATING_PHRASE_EN, phraseEn)
    .replaceAll(LEGACY_RATING_PHRASE_ES, phraseEs)
    .replaceAll("{{googleRatingEn}}", placeholderEn)
    .replaceAll("{{googleRatingEs}}", placeholderEs);
}

/**
 * The stored createTime is an RFC3339 timestamp; the UI shows relative
 * strings ("a week ago", "3 weeks ago", "2 months ago"), the same style
 * the Business Profile dashboard uses — in Spanish ("hace 1 semana",
 * "hace 3 semanas", "hace 2 meses") when locale is "es". Only the
 * timestamp's own date is used — no calendar date is ever invented.
 * Returns undefined when the timestamp is missing or unparsable, so the
 * review renders without a date instead of with a wrong one. Because
 * the timestamp (not a relative string) is what the sync stores, the
 * shown date stays correct even when the copy is days old.
 */
export function formatRelativeReviewDate(
  createTime: string | undefined,
  locale: "en" | "es" = "en",
): string | undefined {
  if (!createTime) return undefined;
  const then = new Date(createTime).getTime();
  if (Number.isNaN(then)) return undefined;
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (locale === "es") {
    if (days < 1) return "hoy";
    if (days === 1) return "hace 1 día";
    if (days < 7) return `hace ${days} días`;
    const weeks = Math.floor(days / 7);
    if (weeks < 5) return weeks === 1 ? "hace 1 semana" : `hace ${weeks} semanas`;
    const months = Math.floor(days / 30);
    if (months < 12) return months === 1 ? "hace 1 mes" : `hace ${months} meses`;
    const years = Math.floor(days / 365);
    return years <= 1 ? "hace 1 año" : `hace ${years} años`;
  }
  if (days < 1) return "today";
  if (days === 1) return "a day ago";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return weeks === 1 ? "a week ago" : `${weeks} weeks ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return months === 1 ? "a month ago" : `${months} months ago`;
  const years = Math.floor(days / 365);
  return years <= 1 ? "a year ago" : `${years} years ago`;
}

/**
 * Review list from the Sanity copy, mapped to Testimonial. Texts are
 * shown as-is, in the language the reviewer wrote them; only the
 * surrounding chrome is translated. Nothing is invented here: entries
 * with a name but no text still render as name + stars, and name/rating/
 * date pass through only when present. Returns [] when there is no copy
 * yet or the list is empty — callers hide the section in that case.
 * Dates are the relative strings converted from each review's stored
 * createTime (see above) in the caller's locale, and TestimonialsList
 * translates any English relative string it still receives on Spanish
 * pages — never calendar dates, and never invented.
 */
export async function getGoogleReviews(
  locale: "en" | "es" = "en",
): Promise<Testimonial[]> {
  const copy = await fetchGoogleReviewsCopy();
  const reviews = copy?.reviews;
  if (!Array.isArray(reviews)) return [];
  // Include every entry that has a name or text — a real Google review
  // can have a 5-star rating and a name but NO text, and it still
  // renders (name + stars). Nothing is invented: name/rating/date pass
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
      rating: typeof r.rating === "number" ? r.rating : undefined,
      verified: true,
      date: formatRelativeReviewDate(r.createTime, locale),
    }));
}
