import { sanity } from "@/lib/sanity";

// Sanity fetchers for the `aboutPage` document (About / Sobre Nosotros,
// EN + ES). One document, id `about-page`.

export type AboutValue = {
  title?: string;
  titleEs?: string;
  text?: string;
  textEs?: string;
};

export type AboutPage = {
  title?: string;
  titleEs?: string;
  heroSubtitle?: string;
  heroSubtitleEs?: string;
  metaTitle?: string;
  metaTitleEs?: string;
  metaDescription?: string;
  metaDescriptionEs?: string;
  missionHeading?: string;
  missionHeadingEs?: string;
  missionBefore?: string;
  missionLinkText?: string;
  missionAfter?: string;
  missionBeforeEs?: string;
  missionLinkTextEs?: string;
  missionAfterEs?: string;
  storyHeading?: string;
  storyHeadingEs?: string;
  storyParagraphs?: string[];
  storyParagraphsEs?: string[];
  valuesHeading?: string;
  valuesHeadingEs?: string;
  values?: AboutValue[];
  ctaHeading?: string;
  ctaHeadingEs?: string;
  ctaBefore?: string;
  ctaLinkText?: string;
  ctaAfter?: string;
  ctaBeforeEs?: string;
  ctaLinkTextEs?: string;
  ctaAfterEs?: string;
  ctaButtonText?: string;
  ctaButtonTextEs?: string;
};

const ABOUT_FIELDS = `title, titleEs, heroSubtitle, heroSubtitleEs,
  metaTitle, metaTitleEs, metaDescription, metaDescriptionEs,
  missionHeading, missionHeadingEs, missionBefore, missionLinkText,
  missionAfter, missionBeforeEs, missionLinkTextEs, missionAfterEs,
  storyHeading, storyHeadingEs, storyParagraphs, storyParagraphsEs,
  valuesHeading, valuesHeadingEs, values[]{title, titleEs, text, textEs},
  ctaHeading, ctaHeadingEs, ctaBefore, ctaLinkText, ctaAfter, ctaBeforeEs,
  ctaLinkTextEs, ctaAfterEs, ctaButtonText, ctaButtonTextEs`;

export async function getAboutPage(): Promise<AboutPage | null> {
  return sanity.fetch<AboutPage | null>(
    `*[_type == "aboutPage" && _id == "about-page"][0]{${ABOUT_FIELDS}}`,
  );
}
