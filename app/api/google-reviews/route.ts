import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// TEMPORARY DIAGNOSTIC ONLY — to be reverted. Reports the error Google
// returns for the Place Details request, plus Find Place candidates for
// the business under three name-only inputs, plus new Places API Text
// Search (v1) candidates, plus location-biased Text Search (v1)
// candidates for the same queries, so I can get the current Place ID.
// It never includes the API key in the response.
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

  const textQueries = ["CallTechCare Miami", "CallTechCare"];

  const textSearch = await Promise.all(
    textQueries.map(async (query) => {
      try {
        const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress",
          },
          body: JSON.stringify({ textQuery: query, maxResultCount: 5 }),
          cache: "no-store",
        });
        const data = await res.json().catch(() => null);
        const candidates = Array.isArray(data?.places)
          ? data.places.map((p: any) => ({
              placeId: p?.id ?? null,
              name: p?.displayName?.text ?? null,
              address: p?.formattedAddress ?? null,
            }))
          : [];
        return {
          query,
          httpStatus: res.status,
          status: data?.error?.status ?? null,
          errorMessage: data?.error?.message ?? null,
          candidates,
        };
      } catch {
        return { query, httpStatus: null, status: null, errorMessage: "fetch failed", candidates: [] };
      }
    })
  );

  // Location-biased Text Search (v1): a service-area business may only
  // surface when the search is biased to its area. The third query is a
  // control — a generic query that should return results in this area.
  const locationBias = {
    circle: { center: { latitude: 25.7617, longitude: -80.1918 }, radius: 50000.0 },
  };
  const biasedQueries = ["CallTechCare", "CallTechCare Miami", "sprinkler repair Miami"];

  const textSearchBiased = await Promise.all(
    biasedQueries.map(async (query) => {
      try {
        const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress",
          },
          body: JSON.stringify({ textQuery: query, maxResultCount: 5, locationBias }),
          cache: "no-store",
        });
        const data = await res.json().catch(() => null);
        const candidates = Array.isArray(data?.places)
          ? data.places.map((p: any) => ({
              placeId: p?.id ?? null,
              name: p?.displayName?.text ?? null,
              address: p?.formattedAddress ?? null,
            }))
          : [];
        return {
          query,
          httpStatus: res.status,
          status: data?.error?.status ?? null,
          errorMessage: data?.error?.message ?? null,
          candidates,
        };
      } catch {
        return { query, httpStatus: null, status: null, errorMessage: "fetch failed", candidates: [] };
      }
    })
  );

  return NextResponse.json({ details, finds, textSearch, textSearchBiased });
}
