import { NextResponse } from "next/server";
import { getGoogleRatingSummary, getGoogleReviews } from "@/lib/google-reviews";

export const revalidate = 3600;

// Live Google reviews from the Google Business Profile Reviews API (v4).
// This replaced the temporary diagnostic endpoint from PR #382 (which
// probed the dead Places Place ID) once Business Profile API access was
// approved: it now serves the live rating, review count and review texts
// from Google, in the same shape the site's Testimonial components use.
// Used by the client-side ServiceReviews fallback on the TV-mounting
// service pages; server components call lib/google-reviews directly.
// When Google cannot be read it returns nulls and an empty list, so
// callers hide the review sections instead of showing a stale number.
// It never exposes credentials — the OAuth tokens live only in env vars
// read server-side by lib/google-reviews.
export async function GET(request: Request) {
  const locale =
    new URL(request.url).searchParams.get("locale") === "es" ? "es" : "en";
  const [summary, reviews] = await Promise.all([
    getGoogleRatingSummary(),
    getGoogleReviews(locale),
  ]);
  return NextResponse.json({
    rating: summary?.rating ?? null,
    total: summary?.total ?? null,
    reviews,
  });
}
