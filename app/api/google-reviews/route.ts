import { NextResponse } from "next/server";
import { getGoogleRatingSummary, getGoogleReviews } from "@/lib/google-reviews";
import { getGoogleReviewsCopy } from "@/lib/sanitySettings";

export const revalidate = 3600;

// Google reviews from the durable Sanity copy (see lib/google-reviews.ts),
// synced once a day from the Google Business Profile Reviews API by
// /api/cron/sync-reviews. Serves the rating, the review count, the review
// texts and the time of the last successful sync, in the same shape the
// site's Testimonial components use. Used by the client-side ServiceReviews
// fallback on the TV-mounting service pages and by the daily website
// check, which reads `updatedAt` to catch a failed sync (older than
// ~48 hours means the sync has not run); server components call
// lib/google-reviews directly. When Sanity has no copy yet it returns
// nulls and an empty list, so callers hide the review sections instead
// of showing a stale number. It never exposes credentials — the OAuth
// tokens live only in env vars read server-side by the sync job.
export async function GET(request: Request) {
  const locale =
    new URL(request.url).searchParams.get("locale") === "es" ? "es" : "en";
  const [summary, reviews, copy] = await Promise.all([
    getGoogleRatingSummary(),
    getGoogleReviews(locale),
    getGoogleReviewsCopy(),
  ]);
  return NextResponse.json({
    rating: summary?.rating ?? null,
    total: summary?.total ?? null,
    reviews,
    updatedAt: copy?.updatedAt ?? null,
  });
}
