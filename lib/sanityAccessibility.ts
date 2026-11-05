import { sanity } from "@/lib/sanity";
import type { SvgIconName } from "@/components/common/SvgIcons";

// Sanity fetchers for the `accessibilityPage` document (Accessibility /
// Accesibilidad, EN + ES). One document, id `accessibility-page`.

export type AccessibilitySection = {
  icon?: SvgIconName;
  heading?: string;
  headingEs?: string;
  paragraphs?: string[];
  paragraphsEs?: string[];
  highlight?: string;
  highlightEs?: string;
  list?: string[];
  listEs?: string[];
  isContactCard?: boolean;
};

export type AccessibilityPage = {
  title?: string;
  titleEs?: string;
  metaTitle?: string;
  metaTitleEs?: string;
  metaDescription?: string;
  metaDescriptionEs?: string;
  updated?: string;
  updatedEs?: string;
  backText?: string;
  backTextEs?: string;
  intro?: string;
  introEs?: string;
  sections?: AccessibilitySection[];
};

const ACCESSIBILITY_FIELDS = `title, titleEs, metaTitle, metaTitleEs,
  metaDescription, metaDescriptionEs, updated, updatedEs, backText,
  backTextEs, intro, introEs, sections[]{icon, heading, headingEs,
    paragraphs, paragraphsEs, highlight, highlightEs, list, listEs,
    isContactCard}`;

export async function getAccessibilityPage(): Promise<AccessibilityPage | null> {
  return sanity.fetch<AccessibilityPage | null>(
    `*[_type == "accessibilityPage" && _id == "accessibility-page"][0]{${ACCESSIBILITY_FIELDS}}`,
  );
}
