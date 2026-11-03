// Spanish twin paths for city landing pages, keyed by English city slug.
// Mirrors lib/serviceTwins.ts: the language switcher map, the sitemap and
// the footer use these so Spanish navigation lands on the Spanish twin
// whenever one exists. English slugs keep their /sprinkler-repair-<slug>
// URL when no twin exists.
export const CITY_ES_PATHS: Record<string, string> = {
  "sunrise": "/es/reparacion-de-sprinklers-sunrise",
  "fort-lauderdale": "/es/reparacion-de-sprinklers-fort-lauderdale",
  "dania-beach": "/es/reparacion-de-sprinklers-dania-beach",
  "weston": "/es/reparacion-de-sprinklers-weston",
  "davie": "/es/reparacion-de-sprinklers-davie",
  "southwest-ranches": "/es/reparacion-de-sprinklers-southwest-ranches",
  "hollywood": "/es/reparacion-de-sprinklers-hollywood",
  "west-park": "/es/reparacion-de-sprinklers-west-park",
  "pembroke-pines": "/es/reparacion-de-sprinklers-pembroke-pines",
  "miramar": "/es/reparacion-de-sprinklers-miramar",
  "miami-gardens": "/es/reparacion-de-sprinklers-miami-gardens",
  "miami-lakes": "/es/reparacion-de-sprinklers-miami-lakes",
  "country-club": "/es/reparacion-de-sprinklers-country-club",
  "aventura": "/es/reparacion-de-sprinklers-aventura",
  "sunny-isles-beach": "/es/reparacion-de-sprinklers-sunny-isles-beach",
  "north-miami": "/es/reparacion-de-sprinklers-north-miami",
  "surfside": "/es/reparacion-de-sprinklers-surfside",
  "north-bay-village": "/es/reparacion-de-sprinklers-north-bay-village",
  "miami-beach": "/es/reparacion-de-sprinklers-miami-beach",
  "hialeah": "/es/reparacion-de-sprinklers-hialeah",
  "doral": "/es/reparacion-de-sprinklers-doral",
  "fontainebleau": "/es/reparacion-de-sprinklers-fontainebleau",
  "tamiami": "/es/reparacion-de-sprinklers-tamiami",
  "miami": "/es/reparacion-de-sprinklers-miami",
  "coral-gables": "/es/reparacion-de-sprinklers-coral-gables",
  "key-biscayne": "/es/reparacion-de-sprinklers-key-biscayne",
  "kendall": "/es/reparacion-de-sprinklers-kendall",
  "kendale-lakes": "/es/reparacion-de-sprinklers-kendale-lakes",
  "country-walk": "/es/reparacion-de-sprinklers-country-walk",
  "cutler-bay": "/es/reparacion-de-sprinklers-cutler-bay",
};

export function cityHref(slug: string, locale: "en" | "es"): string {
  if (locale === "es") return CITY_ES_PATHS[slug] ?? `/sprinkler-repair-${slug}`;
  return `/sprinkler-repair-${slug}`;
}
