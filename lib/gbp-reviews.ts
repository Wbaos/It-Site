/**
 * Google Business Profile Reviews API (v4) — fetch side only.
 *
 * Used ONLY by the daily sync job (app/api/cron/sync-reviews/route.ts),
 * which copies the rating, the review count and the review texts into
 * Sanity. Nothing on a visitor's request path imports this file: the
 * site reads the reviews from the Sanity copy (see lib/google-reviews.ts),
 * so a Google outage or an expired token never empties the reviews on
 * the site.
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
 * The response carries reviews[] (name, reviewer.displayName, starRating,
 * comment, createTime) plus averageRating and totalReviewCount.
 *
 * Diagnostic logging: the console.error calls below log only HTTP
 * statuses, Google's error fields and env-var presence booleans — never
 * any values or tokens — so a failing token exchange can be seen in the
 * Vercel function logs under the [sync-reviews] prefix.
 */

export type GbpReview = {
  /** Resource name, e.g. accounts/…/locations/…/reviews/<reviewId>. */
  name?: string;
  reviewer?: { displayName?: string };
  starRating?: string;
  comment?: string;
  createTime?: string;
};

export type GbpReviewsResponse = {
  reviews?: GbpReview[];
  averageRating?: number;
  totalReviewCount?: number;
};

/** Exchanges the refresh token for a short-lived access token. */
export async function fetchAccessToken(): Promise<string | null> {
  const clientId = process.env.GBP_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GBP_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GBP_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    // Diagnostic logging: booleans only, never any values.
    console.error("[sync-reviews] missing OAuth env vars", {
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
      // Diagnostic logging: status + Google's error fields.
      const errBody = await res.json().catch(() => null);
      console.error(
        "[sync-reviews] token exchange failed",
        res.status,
        errBody?.error,
        errBody?.error_description
      );
      return null;
    }
    const data = await res.json().catch(() => null);
    if (typeof data?.access_token !== "string") {
      console.error("[sync-reviews] token response has no access_token");
      return null;
    }
    return data.access_token;
  } catch {
    return null;
  }
}

/** One live call to the Business Profile Reviews API (v4). */
export async function fetchGoogleReviewsData(): Promise<GbpReviewsResponse | null> {
  const accountId = process.env.GBP_ACCOUNT_ID;
  const locationId = process.env.GBP_LOCATION_ID;
  if (!accountId || !locationId) {
    // Diagnostic logging: booleans only, never any values.
    console.error("[sync-reviews] missing GBP ids", {
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
      // Diagnostic logging: status + Google's error message.
      const errBody = await res.json().catch(() => null);
      const message =
        typeof errBody?.error === "string"
          ? errBody.error
          : errBody?.error?.message;
      console.error("[sync-reviews] reviews API failed", res.status, message);
      return null;
    }
    const data = (await res.json().catch(() => null)) as GbpReviewsResponse | null;
    if (!data || typeof data !== "object") return null;
    return data;
  } catch {
    return null;
  }
}
