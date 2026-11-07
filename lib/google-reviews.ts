import type { Testimonial } from "@/components/common/TestimonialsList";

/**
 * Live Google reviews via the Google Business Profile Reviews API (v4).
 *
 * The rating, the review count and the review texts come straight from
 * Google — no Sanity bridge, no Places API (the saved Place ID is dead),
 * and no hardcoded numbers anywhere in this file or in any display path.
 *
 * Auth is the OAuth refresh-token flow, with credentials read only from
 * environment variables (set in Vercel, never committed):
 *   GBP_OAUTH_CLIENT_ID, GBP_OAUTH_CLIENT_SECRET, GBP_REFRESH_TOKEN,
 *   GBP_ACCOUNT_ID, GBP_LOCATION_ID
 * The refresh token is exchanged for a short-lived access token
 * (scope https://www.googleapis.com/auth/business.manage), which is
 * then sent as a Bearer token to:
 *   GET https://mybusiness.googleapis.com/v4/accounts/{accountId}/
 *       locations/{locationId}/reviews
 * The response carries reviews[] (reviewer.displayName, starRating,
 * comment, createTime) plus averageRating and totalReviewCount.
 *
 * There is deliberately NO hardcoded fallback rating/count anywhere.
 * If Google cannot be read (missing env vars, token failure, API
 * error), the getters below return null / [] and every consumer HIDES
 * the rating/count instead of showing a stale number.
 *
 * TEMPORARY diagnostic logging: the console.error calls in
 * fetchAccessToken / fetchGoogleReviewsData log only HTTP statuses,
 * Google's error fields and env-var presence booleans — never any
 * values or tokens — so a failing token exchange can be seen in the
 * Vercel function logs. Remove them once the failure is diagnosed.
 *
 * One short in-memory cache (60 s) lets the rating summary and the
 * review list share a single Google call per render. Only successful
 * responses are cached — a failed call is never cached, so a transient
 * error does not keep the sections hidden.
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
 * Single shared source for the live Google rating summary.
 *
 * Every place on the site that shows the Google rating or the review count
 * reads from here — one Google call, shared with the review list below.
 * No component keeps its own copy of the numbers, so when Google's count
 * changes the rating and the total change everywhere at the same time.
 */
export type GoogleRatingSummary = {
  rating: number;
  total: number;
};

/** One decimal, as displayed everywhere on the site. */
export function formatGoogleRating(rating: number): string {
  return rating.toFixed(1);
}

type GbpReview = {
  reviewer?: { displayName?: string };
  starRating?: string;
  comment?: string;
  createTime?: string;
};

type GbpReviewsResponse = {
  reviews?: GbpReview[];
  averageRating?: number;
  totalReviewCount?: number;
};

const STAR_RATINGS: Record<string, number> = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
};

const CACHE_TTL_MS = 60_000;
let cachedAt = 0;
let cachedResponse: GbpReviewsResponse | null = null;

/** Exchanges the refresh token for a short-lived access token. */
async function fetchAccessToken(): Promise<string | null> {
  const clientId = process.env.GBP_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GBP_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GBP_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    // TEMPORARY diagnostic logging: booleans only, never any values.
    console.error("[google-reviews] missing OAuth env vars", {
      clientId: Boolean(clientId),
      clientSecret: Boolean(clientSecret),
      refreshToken: Boolean(refreshToken),
    });
    return null;
  }
  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
      }),
      cache: "no-store",
    });
    if (!res.ok) {
      // TEMPORARY diagnostic logging: status + Google's error fields.
      const errBody = await res.json().catch(() => null);
      console.error(
        "[google-reviews] token exchange failed",
        res.status,
        errBody?.error,
        errBody?.error_description
      );
      return null;
    }
    const data = await res.json().catch(() => null);
    if (typeof data?.access_token !== "string") {
      // TEMPORARY diagnostic logging.
      console.error("[google-reviews] token response has no access_token");
      return null;
    }
    return data.access_token;
  } catch {
    return null;
  }
}

/** One live call to the Business Profile Reviews API (v4). */
async function fetchGoogleReviewsData(): Promise<GbpReviewsResponse | null> {
  if (cachedResponse && Date.now() - cachedAt < CACHE_TTL_MS) {
    return cachedResponse;
  }
  const accountId = process.env.GBP_ACCOUNT_ID;
  const locationId = process.env.GBP_LOCATION_ID;
  if (!accountId || !locationId) {
    // TEMPORARY diagnostic logging: booleans only, never any values.
    console.error("[google-reviews] missing GBP ids", {
      accountId: Boolean(accountId),
      locationId: Boolean(locationId),
    });
    return null;
  }
  const accessToken = await fetchAccessToken();
  if (!accessToken) return null;
  try {
    const res = await fetch(
      `https://mybusiness.googleapis.com/v4/accounts/${encodeURIComponent(accountId)}/locations/${encodeURIComponent(locationId)}/reviews?pageSize=50`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      }
    );
    if (!res.ok) {
      // TEMPORARY diagnostic logging: status + Google's error message.
      const errBody = await res.json().catch(() => null);
      const message =
        typeof errBody?.error === "string"
          ? errBody.error
          : errBody?.error?.message;
      console.error("[google-reviews] reviews API failed", res.status, message);
      return null;
    }
    const data = (await res.json().catch(() => null)) as GbpReviewsResponse | null;
    if (!data || typeof data !== "object") return null;
    cachedResponse = data;
    cachedAt = Date.now();
    return data;
  } catch {
    return null;
  }
}

/**
 * Rating summary from the Google Business Profile API. Returns null
 * when Google cannot be read or when either field is missing — callers
 * must hide the count/rating in that case. It NEVER falls back to a
 * hardcoded number.
 */
export async function getGoogleRatingSummary(): Promise<GoogleRatingSummary | null> {
  const data = await fetchGoogleReviewsData();
  const rating = data?.averageRating;
  const total = data?.totalReviewCount;
  if (typeof rating !== "number" || typeof total !== "number") return null;
  return { rating, total };
}

// Legacy rating/count phrases that still appear in the Sanity contactPage
// FAQ copy (written when the count was 26 — e.g. "we hold a 5.0 rating
// from 26 Google reviews"). They are search patterns only — they are
// never rendered — and are replaced with the live Google values, or with
// neutral wording when there is no summary (see below). The Sanity
// sentences already carry their own article ("a " / "una ") before the
// phrase, so the legacy replacement carries NO article, while the
// {{googleRatingEn}} / {{googleRatingEs}} placeholders DO ("we hold
// {{googleRatingEn}}" needs its "a"). Without that split the render
// would read "a a 5.0 rating…" — the bridge code had exactly that bug.
// (The homePage whyCards Google card does NOT need these: WhyChooseUs
// replaces that card's text with the live values at render.)
const LEGACY_RATING_PHRASE_EN = "5.0 rating from 26 Google reviews";
const LEGACY_RATING_PHRASE_ES = "calificación 5.0 con 26 reseñas en Google";

/**
 * Replaces the rating/count phrases inside a text with the live summary
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
 * The API's createTime is an RFC3339 timestamp; the UI shows relative
 * strings ("a week ago", "3 weeks ago", "2 months ago"), the same style
 * the Business Profile dashboard uses. Only the timestamp's own date is
 * used — no calendar date is ever invented. Returns undefined when the
 * timestamp is missing or unparsable, so the review renders without a
 * date instead of with a wrong one.
 */
export function formatRelativeReviewDate(createTime: string | undefined): string | undefined {
  if (!createTime) return undefined;
  const then = new Date(createTime).getTime();
  if (Number.isNaN(then)) return undefined;
  const days = Math.floor((Date.now() - then) / 86_400_000);
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
 * Review list from the Google Business Profile API, mapped to
 * Testimonial. Texts are shown as-is, in the language the reviewer
 * wrote them; only the surrounding chrome is translated. Nothing is
 * invented here: entries with a name but no text still render as name +
 * stars, and name/rating/date pass through only when present. Returns
 * [] when Google cannot be read or the list is empty — callers hide the
 * section in that case. Dates are the relative strings converted from
 * each review's createTime (see above) — never calendar dates, and
 * never invented; TestimonialsList shows the raw string when it cannot
 * be parsed as a date.
 */
export async function getGoogleReviews(): Promise<Testimonial[]> {
  const data = await fetchGoogleReviewsData();
  const reviews = data?.reviews;
  if (!Array.isArray(reviews)) return [];
  // Include every entry that has a name or text — a real Google review
  // can have a 5-star rating and a name but NO text, and it still
  // renders (name + stars). Nothing is invented: name/rating/date pass
  // through only when present, and text stays exactly as entered.
  return reviews
    .filter(
      (r) =>
        (typeof r?.reviewer?.displayName === "string" &&
          r.reviewer.displayName.trim().length > 0) ||
        (typeof r?.comment === "string" && r.comment.trim().length > 0)
    )
    .map((r) => ({
      name: r.reviewer?.displayName,
      text: r.comment ?? "",
      rating: r.starRating ? STAR_RATINGS[r.starRating] : undefined,
      verified: true,
      date: formatRelativeReviewDate(r.createTime),
    }));
}
