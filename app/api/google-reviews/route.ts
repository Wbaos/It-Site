import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// TEMPORARY DIAGNOSTIC ONLY — to be reverted. Reports the error Google
// returns for the Place Details request, plus Find Place candidates for
// the business under three name-only inputs, plus new Places API Text
// Search (v1) candidates, plus location-biased Text Search (v1)
// candidates for the same queries, plus phone-number / address Text
// Search (v1) candidates and a geocode check of the listing's pin
// address, plus Nearby Search (v1 and legacy) around the business's
// own Maps pin and a location-restricted Text Search, so I can get
// the current Place ID.
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

  // Phone-number / address Text Search (v1): a business that never
  // surfaces by name may surface by its phone number or by the address
  // shown on its Maps pin. Same location bias as above.
  const phoneQueries = [
    "(786) 366-2729",
    "CallTechCare 7863662729",
    "14125 SW 142nd Ave Miami",
  ];

  const textSearchPhone = await Promise.all(
    phoneQueries.map(async (query) => {
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

  // Geocode check: geocode the address shown on the Maps pin, then run
  // Place Details on the geocoded place_id to see whether it resolves
  // to the business or just to the street address.
  const geocodeAddress = "14125 SW 142nd Ave, Miami, FL 33186";
  const geocodeCheck: {
    geocodeHttpStatus: number | null;
    geocodeStatus: string | null;
    geocodeErrorMessage: string | null;
    placeId: string | null;
    formattedAddress: string | null;
    detailsHttpStatus: number | null;
    detailsStatus: string | null;
    detailsErrorMessage: string | null;
    detailsName: string | null;
    detailsRating: number | null;
    detailsUserRatingsTotal: number | null;
  } = {
    geocodeHttpStatus: null,
    geocodeStatus: null,
    geocodeErrorMessage: null,
    placeId: null,
    formattedAddress: null,
    detailsHttpStatus: null,
    detailsStatus: null,
    detailsErrorMessage: null,
    detailsName: null,
    detailsRating: null,
    detailsUserRatingsTotal: null,
  };

  try {
    const geoRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json` +
        `?address=${encodeURIComponent(geocodeAddress)}` +
        `&key=${apiKey}`,
      { cache: "no-store" }
    );
    const geoData = await geoRes.json().catch(() => null);
    geocodeCheck.geocodeHttpStatus = geoRes.status;
    geocodeCheck.geocodeStatus = geoData?.status ?? null;
    geocodeCheck.geocodeErrorMessage = geoData?.error_message ?? null;
    const top = Array.isArray(geoData?.results) ? geoData.results[0] : null;
    geocodeCheck.placeId = top?.place_id ?? null;
    geocodeCheck.formattedAddress = top?.formatted_address ?? null;

    if (geocodeCheck.placeId) {
      try {
        const detRes = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json` +
            `?place_id=${geocodeCheck.placeId}` +
            `&fields=name,rating,user_ratings_total` +
            `&key=${apiKey}`,
          { cache: "no-store" }
        );
        const detData = await detRes.json().catch(() => null);
        geocodeCheck.detailsHttpStatus = detRes.status;
        geocodeCheck.detailsStatus = detData?.status ?? null;
        geocodeCheck.detailsErrorMessage = detData?.error_message ?? null;
        geocodeCheck.detailsName = detData?.result?.name ?? null;
        geocodeCheck.detailsRating = detData?.result?.rating ?? null;
        geocodeCheck.detailsUserRatingsTotal = detData?.result?.user_ratings_total ?? null;
      } catch {
        geocodeCheck.detailsErrorMessage = "fetch failed";
      }
    }
  } catch {
    geocodeCheck.geocodeErrorMessage = "fetch failed";
  }

  // Nearby Search around the business's own Maps pin: it does not
  // depend on name matching at all — it returns whatever places exist
  // at that location, so the business should appear if Google indexes
  // it there. Pin coordinates from the public Maps listing.
  const pin = { latitude: 25.8818525, longitude: -80.272828 };

  const nearbySearch = await Promise.all([
    // (a) Places API (New) Nearby Search, 500 m circle.
    (async () => {
      try {
        const res = await fetch("https://places.googleapis.com/v1/places:searchNearby", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.types",
          },
          body: JSON.stringify({
            locationRestriction: { circle: { center: pin, radius: 500.0 } },
            maxResultCount: 20,
          }),
          cache: "no-store",
        });
        const data = await res.json().catch(() => null);
        const candidates = Array.isArray(data?.places)
          ? data.places.map((p: any) => ({
              placeId: p?.id ?? null,
              name: p?.displayName?.text ?? null,
              address: p?.formattedAddress ?? null,
              types: p?.types ?? null,
            }))
          : [];
        return {
          method: "v1 searchNearby",
          radius: 500,
          httpStatus: res.status,
          status: data?.error?.status ?? null,
          errorMessage: data?.error?.message ?? null,
          candidates,
        };
      } catch {
        return { method: "v1 searchNearby", radius: 500, httpStatus: null, status: null, errorMessage: "fetch failed", candidates: [] };
      }
    })(),
    // (b) Same v1 Nearby Search, tighter 100 m circle around the pin.
    (async () => {
      try {
        const res = await fetch("https://places.googleapis.com/v1/places:searchNearby", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.types",
          },
          body: JSON.stringify({
            locationRestriction: { circle: { center: pin, radius: 100.0 } },
            maxResultCount: 20,
          }),
          cache: "no-store",
        });
        const data = await res.json().catch(() => null);
        const candidates = Array.isArray(data?.places)
          ? data.places.map((p: any) => ({
              placeId: p?.id ?? null,
              name: p?.displayName?.text ?? null,
              address: p?.formattedAddress ?? null,
              types: p?.types ?? null,
            }))
          : [];
        return {
          method: "v1 searchNearby",
          radius: 100,
          httpStatus: res.status,
          status: data?.error?.status ?? null,
          errorMessage: data?.error?.message ?? null,
          candidates,
        };
      } catch {
        return { method: "v1 searchNearby", radius: 100, httpStatus: null, status: null, errorMessage: "fetch failed", candidates: [] };
      }
    })(),
    // (c) Legacy Nearby Search, 500 m circle.
    (async () => {
      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json` +
            `?location=${pin.latitude},${pin.longitude}` +
            `&radius=500` +
            `&key=${apiKey}`,
          { cache: "no-store" }
        );
        const data = await res.json().catch(() => null);
        const candidates = Array.isArray(data?.results)
          ? data.results.map((r: any) => ({
              placeId: r?.place_id ?? null,
              name: r?.name ?? null,
              address: r?.vicinity ?? null,
            }))
          : [];
        return {
          method: "legacy nearbysearch",
          radius: 500,
          httpStatus: res.status,
          status: data?.status ?? null,
          errorMessage: data?.error_message ?? null,
          candidates,
        };
      } catch {
        return { method: "legacy nearbysearch", radius: 500, httpStatus: null, status: null, errorMessage: "fetch failed", candidates: [] };
      }
    })(),
  ]);

  // Location-restricted Text Search (v1): a hard restriction (not a
  // bias) to a small circle around the pin — a generic "sprinkler"
  // query should return nearby sprinkler businesses, including this
  // one if Google indexes it at the pin.
  let textSearchRestricted: {
    query: string;
    httpStatus: number | null;
    status: string | null;
    errorMessage: string | null;
    candidates: { placeId: string | null; name: string | null; address: string | null }[];
  } = { query: "sprinkler", httpStatus: null, status: null, errorMessage: null, candidates: [] };

  try {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress",
      },
      body: JSON.stringify({
        textQuery: "sprinkler",
        maxResultCount: 10,
        locationRestriction: { circle: { center: pin, radius: 1000.0 } },
      }),
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
    textSearchRestricted = {
      query: "sprinkler",
      httpStatus: res.status,
      status: data?.error?.status ?? null,
      errorMessage: data?.error?.message ?? null,
      candidates,
    };
  } catch {
    textSearchRestricted = { query: "sprinkler", httpStatus: null, status: null, errorMessage: "fetch failed", candidates: [] };
  }

  return NextResponse.json({ details, finds, textSearch, textSearchBiased, textSearchPhone, geocodeCheck, nearbySearch, textSearchRestricted });
}
