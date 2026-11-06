import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// TEMPORARY DIAGNOSTIC ONLY — to be reverted. Reports only the error
// Google returns for the Place Details request. It never includes the
// API key or the place ID in the response.
export async function GET() {
  const placeId = process.env.GOOGLE_PLACE_ID;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!placeId) {
    return NextResponse.json({ error: "missing env var: GOOGLE_PLACE_ID" });
  }
  if (!apiKey) {
    return NextResponse.json({ error: "missing env var: GOOGLE_MAPS_API_KEY" });
  }

  const url =
    `https://maps.googleapis.com/maps/api/place/details/json` +
    `?place_id=${placeId}` +
    `&fields=reviews` +
    `&key=${apiKey}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json({
      httpStatus: res.status,
      apiStatus: data?.status ?? null,
      errorMessage: data?.error_message ?? null,
      hasResult: Boolean(data?.result),
    });
  } catch {
    return NextResponse.json({ error: "fetch failed" });
  }
}
