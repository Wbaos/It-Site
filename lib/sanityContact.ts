import { sanity } from "@/lib/sanity";

// Sanity fetchers for the `contactPage` document (id: contact-page).
// Page content only; form labels/placeholders/buttons stay in code.

export type ContactFaq = { q?: string; a?: string };

export type ContactStat = {
  value?: string;
  valueEs?: string;
  label?: string;
  labelEs?: string;
};

export type ContactCard = {
  icon?: string;
  title?: string;
  titleEs?: string;
  text?: string;
  textEs?: string;
  link?: string;
  meta?: string;
  metaEs?: string;
};

export type ContactPage = {
  title?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaTitleEs?: string;
  metaDescriptionEs?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroTitleEs?: string;
  heroSubtitleEs?: string;
  stats?: ContactStat[];
  optionsTitle?: string;
  optionsTitleEs?: string;
  cards?: ContactCard[];
  faqs?: ContactFaq[];
  faqsEs?: ContactFaq[];
  sideTitle?: string;
  sideSubtitle?: string;
  sideTitleEs?: string;
  sideSubtitleEs?: string;
  hoursTitle?: string;
  hoursTitleEs?: string;
  dayMonFri?: string;
  dayMonFriEs?: string;
  daySat?: string;
  daySatEs?: string;
  daySun?: string;
  daySunEs?: string;
  emergencyNote?: string;
  emergencyNoteEs?: string;
  locationTitle?: string;
  locationTitleEs?: string;
  locationCity?: string;
  locationCityEs?: string;
  locationMuted?: string;
  locationMutedEs?: string;
  locationsLink?: string;
  locationsLinkEs?: string;
  emergencyTitle?: string;
  emergencyTitleEs?: string;
  emergencyText?: string;
  emergencyTextEs?: string;
};

const CONTACT_FIELDS = `title, metaTitle, metaDescription, metaTitleEs,
  metaDescriptionEs, heroTitle, heroSubtitle, heroTitleEs, heroSubtitleEs,
  stats[]{value, valueEs, label, labelEs},
  optionsTitle, optionsTitleEs,
  cards[]{icon, title, titleEs, text, textEs, link, meta, metaEs},
  faqs[]{q, a}, faqsEs[]{q, a},
  sideTitle, sideSubtitle, sideTitleEs, sideSubtitleEs,
  hoursTitle, hoursTitleEs, dayMonFri, dayMonFriEs, daySat, daySatEs,
  daySun, daySunEs, emergencyNote, emergencyNoteEs,
  locationTitle, locationTitleEs, locationCity, locationCityEs,
  locationMuted, locationMutedEs, locationsLink, locationsLinkEs,
  emergencyTitle, emergencyTitleEs, emergencyText, emergencyTextEs`;

export async function getContactPage(): Promise<ContactPage | null> {
  return sanity.fetch<ContactPage | null>(
    `*[_type == "contactPage" && _id == "contact-page"][0]{${CONTACT_FIELDS}}`
  );
}
