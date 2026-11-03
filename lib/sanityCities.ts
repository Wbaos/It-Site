import { sanity } from "@/lib/sanity";

// Sanity fetchers for the `city` documents (Lote 2 migration).
// Every city page (EN + ES) renders from a single template + one document.

export type CityAreaSegment = {
  text?: string;
  linkText?: string;
  linkHref?: string;
};

export type CityFaq = { q?: string; a?: string };

export type CityFaqOverride = { index?: number; q?: string; a?: string };

export type CityGalleryImage = {
  asset?: { _ref?: string; _type?: string };
  alt?: string;
  altEs?: string;
  caption?: string;
  captionEs?: string;
};

export type City = {
  name?: string;
  slug?: { current?: string };
  esSlug?: string;
  isHub?: boolean;
  order?: number;
  county?: string;
  hubSlug?: string;
  hubLabel?: string;
  zipCodes?: string[];
  sisters?: { name?: string; slug?: string }[];
  heroTitle1?: string;
  heroTitle2?: string;
  heroSubtitle?: string;
  heroBadge?: string;
  seoIntroTitle?: string;
  introP1?: string;
  areaSegments?: CityAreaSegment[];
  localFaqs?: CityFaq[];
  faqOverrides?: CityFaqOverride[];
  faqsOverride?: CityFaq[];
  highlightsVariant?: string;
  gallery?: CityGalleryImage[];
  metaTitle?: string;
  metaDescription?: string;
  heroTitle1Es?: string;
  heroTitle2Es?: string;
  heroSubtitleEs?: string;
  heroBadgeEs?: string;
  seoIntroTitleEs?: string;
  introP1Es?: string;
  areaSegmentsEs?: CityAreaSegment[];
  localFaqsEs?: CityFaq[];
  faqOverridesEs?: CityFaqOverride[];
  faqsOverrideEs?: CityFaq[];
  metaTitleEs?: string;
  metaDescriptionEs?: string;
  _updatedAt?: string;
};

const CITY_FIELDS = `name, slug, esSlug, isHub, order, county, hubSlug, hubLabel,
  zipCodes, sisters[]{name, slug}, heroTitle1, heroTitle2, heroSubtitle,
  heroBadge, seoIntroTitle, introP1, areaSegments[]{text, linkText, linkHref},
  localFaqs[]{q, a}, faqOverrides[]{index, q, a}, faqsOverride[]{q, a},
  highlightsVariant, gallery[]{asset, alt, altEs, caption, captionEs},
  metaTitle, metaDescription, heroTitle1Es, heroTitle2Es, heroSubtitleEs,
  heroBadgeEs, seoIntroTitleEs, introP1Es,
  areaSegmentsEs[]{text, linkText, linkHref}, localFaqsEs[]{q, a},
  faqOverridesEs[]{index, q, a}, faqsOverrideEs[]{q, a}, metaTitleEs,
  metaDescriptionEs, _updatedAt`;

export async function getCityBySlug(slug: string): Promise<City | null> {
  return sanity.fetch<City | null>(
    `*[_type == "city" && slug.current == $slug][0]{${CITY_FIELDS}}`,
    { slug },
  );
}

export type CityListItem = {
  name?: string;
  slug?: { current?: string };
  esSlug?: string;
  isHub?: boolean;
  order?: number;
  _updatedAt?: string;
};

// Canonical order (0 = Sunrise … 29 = Cutler Bay). Used only as a fallback
// when the Sanity fetch comes back empty, so pages never 404 on a blip.
export const FALLBACK_CITIES: { name: string; slug: string; esSlug: string }[] = [
  { name: "Sunrise", slug: "sunrise", esSlug: "reparacion-de-sprinklers-sunrise" },
  { name: "Fort Lauderdale", slug: "fort-lauderdale", esSlug: "reparacion-de-sprinklers-fort-lauderdale" },
  { name: "Dania Beach", slug: "dania-beach", esSlug: "reparacion-de-sprinklers-dania-beach" },
  { name: "Weston", slug: "weston", esSlug: "reparacion-de-sprinklers-weston" },
  { name: "Davie", slug: "davie", esSlug: "reparacion-de-sprinklers-davie" },
  { name: "Southwest Ranches", slug: "southwest-ranches", esSlug: "reparacion-de-sprinklers-southwest-ranches" },
  { name: "Hollywood", slug: "hollywood", esSlug: "reparacion-de-sprinklers-hollywood" },
  { name: "West Park", slug: "west-park", esSlug: "reparacion-de-sprinklers-west-park" },
  { name: "Pembroke Pines", slug: "pembroke-pines", esSlug: "reparacion-de-sprinklers-pembroke-pines" },
  { name: "Miramar", slug: "miramar", esSlug: "reparacion-de-sprinklers-miramar" },
  { name: "Miami Gardens", slug: "miami-gardens", esSlug: "reparacion-de-sprinklers-miami-gardens" },
  { name: "Miami Lakes", slug: "miami-lakes", esSlug: "reparacion-de-sprinklers-miami-lakes" },
  { name: "Country Club", slug: "country-club", esSlug: "reparacion-de-sprinklers-country-club" },
  { name: "Aventura", slug: "aventura", esSlug: "reparacion-de-sprinklers-aventura" },
  { name: "Sunny Isles Beach", slug: "sunny-isles-beach", esSlug: "reparacion-de-sprinklers-sunny-isles-beach" },
  { name: "North Miami", slug: "north-miami", esSlug: "reparacion-de-sprinklers-north-miami" },
  { name: "Surfside", slug: "surfside", esSlug: "reparacion-de-sprinklers-surfside" },
  { name: "North Bay Village", slug: "north-bay-village", esSlug: "reparacion-de-sprinklers-north-bay-village" },
  { name: "Miami Beach", slug: "miami-beach", esSlug: "reparacion-de-sprinklers-miami-beach" },
  { name: "Hialeah", slug: "hialeah", esSlug: "reparacion-de-sprinklers-hialeah" },
  { name: "Doral", slug: "doral", esSlug: "reparacion-de-sprinklers-doral" },
  { name: "Fontainebleau", slug: "fontainebleau", esSlug: "reparacion-de-sprinklers-fontainebleau" },
  { name: "Tamiami", slug: "tamiami", esSlug: "reparacion-de-sprinklers-tamiami" },
  { name: "Miami", slug: "miami", esSlug: "reparacion-de-sprinklers-miami" },
  { name: "Coral Gables", slug: "coral-gables", esSlug: "reparacion-de-sprinklers-coral-gables" },
  { name: "Key Biscayne", slug: "key-biscayne", esSlug: "reparacion-de-sprinklers-key-biscayne" },
  { name: "Kendall", slug: "kendall", esSlug: "reparacion-de-sprinklers-kendall" },
  { name: "Kendale Lakes", slug: "kendale-lakes", esSlug: "reparacion-de-sprinklers-kendale-lakes" },
  { name: "Country Walk", slug: "country-walk", esSlug: "reparacion-de-sprinklers-country-walk" },
  { name: "Cutler Bay", slug: "cutler-bay", esSlug: "reparacion-de-sprinklers-cutler-bay" },
];

export async function getAllCities(): Promise<CityListItem[]> {
  const items = await sanity.fetch<CityListItem[]>(
    `*[_type == "city" && defined(slug.current)] | order(order asc)
    { name, slug, esSlug, isHub, order, _updatedAt }`,
  );
  return items?.length ? items : [];
}

// Sanity image asset ref ("image-<hash>-<WxH>-jpg") -> CDN URL, exactly as
// the old city files referenced their gallery images.
export function sanityImageUrl(ref: string | undefined): string {
  if (!ref) return "";
  const m = ref.match(/^image-(.+)-([a-z0-9]+)$/);
  if (!m) return "";
  return `https://cdn.sanity.io/images/celkrwoq/production/${m[1]}.${m[2]}`;
}
