import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { sanity } from "@/lib/sanity";
import { fetchGoogleReviewsData } from "@/lib/gbp-reviews";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Daily sync of the Google reviews into Sanity (the durable copy the
// site reads). Runs once a day on Vercel Cron (see vercel.json) and can
// also be triggered by hand with ?secret=, the same revalidate secret
// used by /api/revalidate.
//
// Flow: exchange the GBP refresh token for an access token, fetch the
// rating, the review count and the review texts from the Business
// Profile Reviews API (v4), and write them to the `site-settings`
// document (googleRating, googleReviewCount, googleReviews,
// googleReviewsUpdatedAt). The site then reads ONLY from Sanity, so a
// Google outage or an expired token never empties the reviews on the
// site — the last good copy keeps showing.
//
// Auth: Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` when
// CRON_SECRET is set in the project env vars. The manual trigger uses
// the SANITY_REVALIDATE_SECRET query param instead. Either one works.
//
// Failure behavior (deliberate): on ANY failure the route returns a
// 500, logs a clear [sync-reviews] line for the Vercel function logs,
// and does NOT touch Sanity — googleReviewsUpdatedAt keeps its old
// value, so the daily website check (which reads /api/google-reviews)
// can see the copy going stale. No secret is ever logged or returned.
//
// Env vars needed in Vercel (Production):
//   GBP_OAUTH_CLIENT_ID, GBP_OAUTH_CLIENT_SECRET, GBP_REFRESH_TOKEN,
//   GBP_ACCOUNT_ID, GBP_LOCATION_ID (Google side, already there),
//   SANITY_WRITE_TOKEN (a Sanity API token with write access to the
//   production dataset — lib/sanity.ts already reads it),
//   CRON_SECRET (any random secret; Vercel Cron sends it as the Bearer
//   token), SANITY_REVALIDATE_SECRET (already there, manual trigger).

const STAR_RATINGS: Record<string, number> = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
};

/** Stable Sanity _key from the review's Google resource name. */
function reviewKey(name: string | undefined, index: number): string {
  const id = (name ?? "").split("/").filter(Boolean).pop() ?? "";
  const clean = id.replace(/[^a-zA-Z0-9_-]/g, "");
  return clean.length > 0 ? clean : `review-${index}`;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const cronSecret = process.env.CRON_SECRET;
  const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET;
  const bearer = request.headers.get("authorization") ?? "";
  const authorized =
    (cronSecret && bearer === `Bearer ${cronSecret}`) ||
    (revalidateSecret && url.searchParams.get("secret") === revalidateSecret);
  if (!authorized) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data = await fetchGoogleReviewsData();
  if (!data) {
    // fetchGoogleReviewsData already logged the stage that failed.
    return NextResponse.json(
      { ok: false, error: "google_fetch_failed" },
      { status: 500 }
    );
  }
  const rating = data.averageRating;
  const total = data.totalReviewCount;
  if (typeof rating !== "number" || typeof total !== "number") {
    console.error("[sync-reviews] google response missing rating/total");
    return NextResponse.json(
      { ok: false, error: "google_response_incomplete" },
      { status: 500 }
    );
  }

  const reviews = (Array.isArray(data.reviews) ? data.reviews : [])
    .filter(
      (r) =>
        (typeof r?.reviewer?.displayName === "string" &&
          r.reviewer.displayName.trim().length > 0) ||
        (typeof r?.comment === "string" && r.comment.trim().length > 0)
    )
    .map((r, index) => ({
      _key: reviewKey(r.name, index),
      name: r.reviewer?.displayName,
      rating: r.starRating ? STAR_RATINGS[r.starRating] : undefined,
      text: r.comment ?? "",
      createTime: r.createTime,
      verified: true,
    }));

  const syncedAt = new Date().toISOString();
  try {
    await sanity
      .patch("site-settings")
      .set({
        googleRating: rating,
        googleReviewCount: total,
        googleReviews: reviews,
        googleReviewsUpdatedAt: syncedAt,
      })
      .commit();
  } catch (err) {
    // Log only the error message — never any token or credential.
    console.error(
      "[sync-reviews] sanity patch failed",
      err instanceof Error ? err.message : "unknown error"
    );
    return NextResponse.json(
      { ok: false, error: "sanity_write_failed" },
      { status: 500 }
    );
  }

  // New copy is live in Sanity; refresh the two pages that render the
  // review sections so visitors see it without waiting for ISR. A
  // revalidate failure must not fail the sync itself.
  try {
    revalidatePath("/", "page");
    revalidatePath("/es/", "page");
  } catch (err) {
    console.error(
      "[sync-reviews] revalidate failed",
      err instanceof Error ? err.message : "unknown error"
    );
  }

  console.error(
    `[sync-reviews] ok rating=${rating} total=${total} reviews=${reviews.length} at=${syncedAt}`
  );
  return NextResponse.json({
    ok: true,
    rating,
    total,
    reviews: reviews.length,
    updatedAt: syncedAt,
  });
}
