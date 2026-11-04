import { sanity } from "@/lib/sanity";

// Sanity fetcher for the `homePage` document (id: home-page).
// Page copy only; CTA labels/hrefs, button/aria labels and media URLs
// stay in code by design.

export type HomeStat = {
  value?: string;
  valueEs?: string;
  label?: string;
  labelEs?: string;
};

export type WhyCard = {
  title?: string;
  titleEs?: string;
  text?: string;
  textEs?: string;
};

export type HomePage = {
  heroTitleLine1?: string;
  heroTitleLine1Es?: string;
  heroTitleLine2?: string;
  heroTitleLine2Es?: string;
  heroSubtitle?: string;
  heroSubtitleEs?: string;
  heroBadgeText?: string;
  heroBadgeTextEs?: string;
  heroImageAlt?: string;
  heroImageAltEs?: string;
  heroStats?: HomeStat[];
  seoIntroTitle?: string;
  seoIntroTitleEs?: string;
  seoIntroP1Before?: string;
  seoIntroP1BeforeEs?: string;
  seoIntroP1LinkText?: string;
  seoIntroP1LinkTextEs?: string;
  seoIntroP1After?: string;
  seoIntroP1AfterEs?: string;
  seoIntroP2?: string;
  seoIntroP2Es?: string;
  seoIntroP3?: string;
  seoIntroP3Es?: string;
  seoIntroP4?: string;
  seoIntroP4Es?: string;
  whyTitle?: string;
  whyTitleEs?: string;
  whySubtitle?: string;
  whySubtitleEs?: string;
  whyPhotoAlt?: string;
  whyPhotoAltEs?: string;
  whyCards?: WhyCard[];
  videoHeading?: string;
  videoHeadingEs?: string;
  videoSubtitle?: string;
  videoSubtitleEs?: string;
  contactHeadline?: string;
  contactHeadlineEs?: string;
  contactSubtitle?: string;
  contactSubtitleEs?: string;
};

const HOME_FIELDS = `heroTitleLine1, heroTitleLine1Es, heroTitleLine2,
  heroTitleLine2Es, heroSubtitle, heroSubtitleEs, heroBadgeText,
  heroBadgeTextEs, heroImageAlt, heroImageAltEs,
  heroStats[]{value, valueEs, label, labelEs},
  seoIntroTitle, seoIntroTitleEs, seoIntroP1Before, seoIntroP1BeforeEs,
  seoIntroP1LinkText, seoIntroP1LinkTextEs, seoIntroP1After,
  seoIntroP1AfterEs, seoIntroP2, seoIntroP2Es, seoIntroP3, seoIntroP3Es,
  seoIntroP4, seoIntroP4Es, whyTitle, whyTitleEs, whySubtitle,
  whySubtitleEs, whyPhotoAlt, whyPhotoAltEs,
  whyCards[]{title, titleEs, text, textEs},
  videoHeading, videoHeadingEs, videoSubtitle, videoSubtitleEs,
  contactHeadline, contactHeadlineEs, contactSubtitle, contactSubtitleEs`;

export async function getHomePage(): Promise<HomePage | null> {
  return sanity.fetch<HomePage | null>(
    `*[_type == "homePage" && _id == "home-page"][0]{${HOME_FIELDS}}`
  );
}
