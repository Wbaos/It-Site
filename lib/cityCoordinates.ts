// City-center coordinates for the 33 service cities, for the interactive
// service-area map (Leaflet + OpenStreetMap). These are public geographic
// facts (approximate downtown centers, good to ~1-2 km) — pins on a
// county-level map do not need street precision. Order matches
// FALLBACK_CITIES in lib/sanityCities.ts (0 = Sunrise … 31 = Coral
// Springs, 32 = Cooper City); `county` matches the `county` field on the Sanity `city`
// docs, verified 18 Nov 2026. Miami is "both": its Sanity doc carries
// county "both" because it is the hub for both counties, so it shows
// under either county filter.
export type MapCounty = "Broward" | "Miami-Dade" | "both";

export type MapCity = {
  slug: string;
  name: string;
  county: MapCounty;
  lat: number;
  lng: number;
};

export const MAP_CITIES: MapCity[] = [
  { slug: "sunrise", name: "Sunrise", county: "Broward", lat: 26.1667, lng: -80.2563 },
  { slug: "fort-lauderdale", name: "Fort Lauderdale", county: "Broward", lat: 26.1224, lng: -80.1373 },
  { slug: "dania-beach", name: "Dania Beach", county: "Broward", lat: 26.0531, lng: -80.1495 },
  { slug: "weston", name: "Weston", county: "Broward", lat: 26.1004, lng: -80.3998 },
  { slug: "davie", name: "Davie", county: "Broward", lat: 26.0765, lng: -80.2528 },
  { slug: "southwest-ranches", name: "Southwest Ranches", county: "Broward", lat: 26.0583, lng: -80.3724 },
  { slug: "hollywood", name: "Hollywood", county: "Broward", lat: 26.0112, lng: -80.1495 },
  { slug: "west-park", name: "West Park", county: "Broward", lat: 25.9828, lng: -80.1961 },
  { slug: "pembroke-pines", name: "Pembroke Pines", county: "Broward", lat: 26.0031, lng: -80.2239 },
  { slug: "miramar", name: "Miramar", county: "Broward", lat: 25.986, lng: -80.2323 },
  { slug: "miami-gardens", name: "Miami Gardens", county: "Miami-Dade", lat: 25.942, lng: -80.2456 },
  { slug: "miami-lakes", name: "Miami Lakes", county: "Miami-Dade", lat: 25.9086, lng: -80.1779 },
  { slug: "country-club", name: "Country Club", county: "Miami-Dade", lat: 25.9409, lng: -80.3067 },
  { slug: "aventura", name: "Aventura", county: "Miami-Dade", lat: 25.9565, lng: -80.1392 },
  { slug: "sunny-isles-beach", name: "Sunny Isles Beach", county: "Miami-Dade", lat: 25.9429, lng: -80.1208 },
  { slug: "north-miami", name: "North Miami", county: "Miami-Dade", lat: 25.89, lng: -80.1867 },
  { slug: "surfside", name: "Surfside", county: "Miami-Dade", lat: 25.8794, lng: -80.1247 },
  { slug: "north-bay-village", name: "North Bay Village", county: "Miami-Dade", lat: 25.8539, lng: -80.1539 },
  { slug: "miami-beach", name: "Miami Beach", county: "Miami-Dade", lat: 25.7907, lng: -80.13 },
  { slug: "hialeah", name: "Hialeah", county: "Miami-Dade", lat: 25.8576, lng: -80.2781 },
  { slug: "doral", name: "Doral", county: "Miami-Dade", lat: 25.8195, lng: -80.3553 },
  { slug: "fontainebleau", name: "Fontainebleau", county: "Miami-Dade", lat: 25.7678, lng: -80.3194 },
  { slug: "tamiami", name: "Tamiami", county: "Miami-Dade", lat: 25.7678, lng: -80.4028 },
  { slug: "miami", name: "Miami", county: "both", lat: 25.7617, lng: -80.1918 },
  { slug: "coral-gables", name: "Coral Gables", county: "Miami-Dade", lat: 25.7215, lng: -80.2684 },
  { slug: "key-biscayne", name: "Key Biscayne", county: "Miami-Dade", lat: 25.6937, lng: -80.1557 },
  { slug: "kendall", name: "Kendall", county: "Miami-Dade", lat: 25.6501, lng: -80.3564 },
  { slug: "kendale-lakes", name: "Kendale Lakes", county: "Miami-Dade", lat: 25.6528, lng: -80.405 },
  { slug: "country-walk", name: "Country Walk", county: "Miami-Dade", lat: 25.6327, lng: -80.435 },
  { slug: "cutler-bay", name: "Cutler Bay", county: "Miami-Dade", lat: 25.589, lng: -80.3364 },
  { slug: "plantation", name: "Plantation", county: "Broward", lat: 26.1279, lng: -80.251 },
  { slug: "coral-springs", name: "Coral Springs", county: "Broward", lat: 26.2712, lng: -80.2706 },
  // Cooper City (33rd city, added 22 Nov 2026): city center verified
  // by geocoding (Cooper City Hall, 9090 SW 50th Pl, 33328).
  { slug: "cooper-city", name: "Cooper City", county: "Broward", lat: 26.0584, lng: -80.2723 },
];
