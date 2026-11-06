import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// TEMPORARY DIAGNOSTIC ONLY — to be reverted. Reports the error Google
// returns for the Place Details request, plus Find Place candidates for
// the business under three name-only inputs, so I can get the current
// Place ID. It never includes the API key in the response.
export async function GET() {
  const placeId = process.env.GOOGLE_PLACE_ID;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!placeId) {
    return NextResponse.json({ error: "missing env var: GOOGLE_PLACE_ID" });
  }
  if (!apiKey) {
    return NextResponse.json({ error: "missing env var: GOOGLE_MAPS_API_KEY" });
  }

  const detailsUrl =
    `https://maps.googleapis.com/maps/api/place/details/json` +
    `?place_id=${placeId}` +
    `&fields=reviews` +
    `&key=${apiKey}`;

  const inputs = ["CallTechCare Miami", "CallTechCare Miami FL", "CallTechCare"];

  let details: {
    httpStatus: number | null;
    apiStatus: string | null;
    errorMessage: string | null;
    hasResult: boolean;
  } = { httpStatus: null, apiStatus: null, errorMessage: null, hasResult: false };

  try {
    const res = await fetch(detailsUrl, { cache: "no-store" });
    const data = await res.json();
    details = {
      httpStatus: res.status,
      apiStatus: data?.status ?? null,
      errorMessage: data?.error_message ?? null,
      hasResult: Boolean(data?.result),
    };
  } catch {
    details = { httpStatus: null, apiStatus: null, errorMessage: "fetch failed", hasResult: false };
  }

  const finds = await Promise.all(
    inputs.map(async (input) => {
      const findUrl =
        `https://maps.googleapis.com/maps/api/place/findplacefromtext/json` +
        `?input=${encodeURIComponent(input)}` +
        `&inputtype=textquery` +
        `&fields=place_id,name,formatted_address` +
        `&key=${apiKey}`;
      try {
        const res = await fetch(findUrl, { cache: "no-store" });
        const data = await res.json();
        const candidates = Array.isArray(data?.candidates)
          ? data.candidates.map((c: any) => ({
              place_id: c?.place_id ?? null,
              name: c?.name ?? null,
              formatted_address: c?.formatted_address ?? null,
            }))
          : [];
        return { input, findStatus: data?.status ?? null, candidates };
      } catch {
        return { input, findStatus: null, candidates: [], findError: "fetch failed" };
      }
    })
  );

  return NextResponse.json({ details, finds });
}
