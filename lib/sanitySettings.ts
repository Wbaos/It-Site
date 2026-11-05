import { sanity } from "@/lib/sanity";

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
