import { sanity } from "@/lib/sanity";
import type { SvgIconName } from "@/components/common/SvgIcons";

// Sanity fetchers for `legalPage` documents (privacy + terms, EN + ES).

export type LegalBlock = {
  highlight?: string;
  highlightEs?: string;
  text?: string;
  textEs?: string;
  list?: string[];
  listEs?: string[];
  calloutTitle?: string;
  calloutTitleEs?: string;
  calloutText?: string;
  calloutTextEs?: string;
};

export type LegalSection = {
  icon?: SvgIconName;
  heading?: string;
  headingEs?: string;
  blocks?: LegalBlock[];
};

export type LegalContactCard = {
  icon?: SvgIconName;
  title?: string;
  titleEs?: string;
  text?: string;
  textEs?: string;
  emailLabel?: string;
  emailLabelEs?: string;
  phoneLabel?: string;
  phoneLabelEs?: string;
  mailLabel?: string;
  mailLabelEs?: string;
  buttonText?: string;
  buttonTextEs?: string;
};

export type LegalPage = {
  page?: string;
  layout?: string;
  title?: string;
  titleEs?: string;
  metaTitle?: string;
  metaTitleEs?: string;
  metaDescription?: string;
  metaDescriptionEs?: string;
  ogDescription?: string;
  ogDescriptionEs?: string;
  updated?: string;
  updatedEs?: string;
  backText?: string;
  backTextEs?: string;
  headerIcon?: SvgIconName;
  intro?: string;
  introEs?: string;
  sections?: LegalSection[];
  contactCard?: LegalContactCard;
};

const LEGAL_FIELDS = `page, layout, title, titleEs, metaTitle, metaTitleEs,
  metaDescription, metaDescriptionEs, ogDescription, ogDescriptionEs,
  updated, updatedEs, backText, backTextEs, headerIcon, intro, introEs,
  sections[]{icon, heading, headingEs,
    blocks[]{highlight, highlightEs, text, textEs, list, listEs,
      calloutTitle, calloutTitleEs, calloutText, calloutTextEs}},
  contactCard{icon, title, titleEs, text, textEs, emailLabel, emailLabelEs,
    phoneLabel, phoneLabelEs, mailLabel, mailLabelEs, buttonText, buttonTextEs}`;

export async function getLegalPage(
  page: "privacy" | "terms"
): Promise<LegalPage | null> {
  return sanity.fetch<LegalPage | null>(
    `*[_type == "legalPage" && page == $page][0]{${LEGAL_FIELDS}}`,
    { page }
  );
}
