import { sanity } from "@/lib/sanity";

// Sanity fetchers for the `faqPage` document (FAQ / Preguntas Frecuentes,
// EN + ES). One document, id `faq-page`.

export type FaqItem = { q?: string; a?: string };

export type FaqPage = {
  title?: string;
  titleEs?: string;
  metaTitle?: string;
  metaTitleEs?: string;
  metaDescription?: string;
  metaDescriptionEs?: string;
  introBefore?: string;
  introLink1Text?: string;
  introBetween?: string;
  introLink2Text?: string;
  introAfter?: string;
  introBeforeEs?: string;
  introLink1TextEs?: string;
  introBetweenEs?: string;
  introLink2TextEs?: string;
  introAfterEs?: string;
  faqs?: FaqItem[];
  faqsEs?: FaqItem[];
  contactBefore?: string;
  contactLinkText?: string;
  contactAfter?: string;
  contactBeforeEs?: string;
  contactLinkTextEs?: string;
  contactAfterEs?: string;
};

const FAQ_FIELDS = `title, titleEs, metaTitle, metaTitleEs,
  metaDescription, metaDescriptionEs, introBefore, introLink1Text,
  introBetween, introLink2Text, introAfter, introBeforeEs,
  introLink1TextEs, introBetweenEs, introLink2TextEs, introAfterEs,
  faqs[]{q, a}, faqsEs[]{q, a}, contactBefore, contactLinkText,
  contactAfter, contactBeforeEs, contactLinkTextEs, contactAfterEs`;

export async function getFaqPage(): Promise<FaqPage | null> {
  return sanity.fetch<FaqPage | null>(
    `*[_type == "faqPage" && _id == "faq-page"][0]{${FAQ_FIELDS}}`,
  );
}
