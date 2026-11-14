import { sanity } from "@/lib/sanity";
import type { PortableTextBlock, PortableTextSpan } from "@portabletext/types";

// Sanity fetchers for the `siteSettings` document (business data shown
// across the site). One document, id `site-settings`.

export type SiteSettings = {
  businessName?: string;
  phoneDisplay?: string;
  phoneTel?: string;
  phoneIntl?: string;
  phoneCard?: string;
  email?: string;
  streetAddress?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  geoLat?: number;
  geoLng?: number;
  hoursWeekdayLabel?: string;
  hoursWeekdayLabelEs?: string;
  hoursWeekdayTime?: string;
  hoursWeekendLabel?: string;
  hoursWeekendLabelEs?: string;
  hoursWeekendTime?: string;
  hoursWeekdayOpens?: string;
  hoursWeekdayCloses?: string;
  hoursWeekendOpens?: string;
  hoursWeekendCloses?: string;
  serviceAreaLine?: string;
  serviceAreaLineEs?: string;
};

export type SanityGoogleReview = {
  _key: string;
  name?: string;
  rating?: number;
  text?: string;
  createTime?: string;
  verified?: boolean;
};

// Durable copy of the Google reviews, synced once a day from the
// Business Profile Reviews API by /api/cron/sync-reviews. The site reads
// ONLY from here — never from Google on a visitor's request — so a Google
// outage or an expired token never empties the reviews on the site.
export type GoogleReviewsCopy = {
  rating?: number;
  total?: number;
  reviews?: SanityGoogleReview[];
  updatedAt?: string;
};

const REVIEWS_COPY_FIELDS = `googleRating, googleReviewCount,
  googleReviews, googleReviewsUpdatedAt`;

export async function getGoogleReviewsCopy(): Promise<GoogleReviewsCopy | null> {
  try {
    const doc = await sanity.fetch<{
      googleRating?: number;
      googleReviewCount?: number;
      googleReviews?: SanityGoogleReview[];
      googleReviewsUpdatedAt?: string;
    } | null>(
      `*[_type == "siteSettings" && _id == "site-settings"][0]{${REVIEWS_COPY_FIELDS}}`,
    );
    if (!doc) return null;
    return {
      rating: doc.googleRating,
      total: doc.googleReviewCount,
      reviews: doc.googleReviews,
      updatedAt: doc.googleReviewsUpdatedAt,
    };
  } catch {
    return null;
  }
}

// Exact values shown today; used when the document (or a field) is
// missing, so a Sanity blip never changes what visitors see.
export const FALLBACK_SETTINGS: Required<SiteSettings> = {
  businessName: "CallTechCare",
  phoneDisplay: "(786) 366-2729",
  phoneTel: "+17863662729",
  phoneIntl: "+1-786-366-2729",
  phoneCard: "+1 (786) 366-2729",
  email: "support@calltechcare.com",
  streetAddress: "18730 SW 122nd Ave",
  city: "Miami",
  region: "FL",
  postalCode: "33177",
  country: "US",
  geoLat: 25.59392,
  geoLng: -80.38922,
  hoursWeekdayLabel: "Mon–Sat",
  hoursWeekdayLabelEs: "Lun–Sáb",
  hoursWeekdayTime: "8 AM – 7 PM",
  hoursWeekendLabel: "Sun",
  hoursWeekendLabelEs: "Dom",
  hoursWeekendTime: "9 AM – 6 PM",
  hoursWeekdayOpens: "08:00",
  hoursWeekdayCloses: "19:00",
  hoursWeekendOpens: "09:00",
  hoursWeekendCloses: "18:00",
  serviceAreaLine: "Serving South Florida — from Sunrise to Cutler Bay",
  serviceAreaLineEs: "Sirviendo al sur de Florida — desde Sunrise hasta Cutler Bay",
};

const SETTINGS_FIELDS = `businessName, phoneDisplay, phoneTel, phoneIntl,
  phoneCard, email, streetAddress, city, region, postalCode, country,
  geoLat, geoLng, hoursWeekdayLabel, hoursWeekdayLabelEs, hoursWeekdayTime,
  hoursWeekendLabel, hoursWeekendLabelEs, hoursWeekendTime,
  hoursWeekdayOpens, hoursWeekdayCloses, hoursWeekendOpens,
  hoursWeekendCloses, serviceAreaLine, serviceAreaLineEs`;

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return sanity.fetch<SiteSettings | null>(
    `*[_type == "siteSettings" && _id == "site-settings"][0]{${SETTINGS_FIELDS}}`,
  );
}

export async function resolveSiteSettings(): Promise<Required<SiteSettings>> {
  let doc: SiteSettings | null = null;
  try {
    doc = await getSiteSettings();
  } catch {
    doc = null;
  }
  return { ...FALLBACK_SETTINGS, ...(doc ?? {}) } as Required<SiteSettings>;
}

// Phone fields of the resolved site settings, used by the placeholder helper.
export type PhoneSettings = Pick<
  Required<SiteSettings>,
  "phoneDisplay" | "phoneTel" | "phoneIntl" | "phoneCard"
>;

// Replaces phone placeholders in Sanity copy with the values from
// site-settings, so the number lives in exactly one place. Text that has
// no placeholders comes back unchanged (a no-op until the Sanity text
// carries a marker). Markers:
//   {{phone}}     -> phoneDisplay (e.g. "Call {{phone}}")
//   {{phoneTel}}  -> phoneTel     (tel: link form)
//   {{phoneIntl}} -> phoneIntl    (schema form)
//   {{phoneCard}} -> phoneCard    (contact-card form)
export function substitutePhonePlaceholders(text: string, settings: PhoneSettings): string {
  if (!text) return text;
  return text
    .replaceAll("{{phone}}", settings.phoneDisplay)
    .replaceAll("{{phoneTel}}", settings.phoneTel)
    .replaceAll("{{phoneIntl}}", settings.phoneIntl)
    .replaceAll("{{phoneCard}}", settings.phoneCard);
}

// Same phone substitution, applied inside PortableText blocks (blog body,
// service "about" text): every span child's text goes through
// substitutePhonePlaceholders. Returns a new array — the input blocks and
// their spans are never mutated, so the Sanity-fetched data stays untouched
// for the other locale — and every other block field (_key, _type, style,
// marks, markDefs, listItem, level, inline objects) is carried over
// untouched. Blocks without children, and non-span children, pass through
// unchanged. A missing/empty input comes back as an empty array.
export function substitutePhonePlaceholdersInBlocks(
  blocks: PortableTextBlock[] | undefined | null,
  settings: PhoneSettings,
): PortableTextBlock[] {
  if (!blocks) return [];
  return blocks.map((block) => {
    if (!block || block._type !== "block" || !Array.isArray(block.children)) {
      return block;
    }
    let changed = false;
    const children = block.children.map((child) => {
      const span = child as PortableTextSpan;
      if (span?._type !== "span" || typeof span.text !== "string") {
        return child;
      }
      const text = substitutePhonePlaceholders(span.text, settings);
      if (text === span.text) return child;
      changed = true;
      return { ...span, text };
    });
    return changed ? { ...block, children } : block;
  });
}
