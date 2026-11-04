import type { Metadata } from "next";
import { sanity } from "@/lib/sanity";
import ServicePage from "@/app/services/[slug]/page";

const ES_PAGE_URL =
  "https://www.calltechcare.com/es/seguridad-del-hogar";
const EN_CATEGORY_URL = "https://www.calltechcare.com/services/home-security";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const category = await sanity.fetch(
    `*[_type == "category" && slug.current == "home-security"][0]{
      title,
      titleEs,
      seoTitleEs,
      metaDescriptionEs,
      metaDescription,
      taglineEs,
      descriptionEs,
      icon { asset->{ url }, alt }
    }`
  );
  const title =
    category?.seoTitleEs ||
    (category?.titleEs
      ? `${category.titleEs} en Miami y Broward | CallTechCare`
      : "Seguridad del Hogar en Miami y Broward | CallTechCare");
  const description =
    category?.metaDescriptionEs ||
    category?.taglineEs ||
    category?.descriptionEs ||
    "Cámaras de seguridad instaladas y configuradas profesionalmente para proteger tu hogar y tu familia en todo el sur de Florida.";
  return {
    title,
    description,
    alternates: {
      canonical: ES_PAGE_URL,
      languages: {
        es: ES_PAGE_URL,
        en: EN_CATEGORY_URL,
        "x-default": EN_CATEGORY_URL,
      },
    },
    openGraph: {
      title,
      description,
      url: ES_PAGE_URL,
      siteName: "CallTechCare",
      images: category?.icon?.asset?.url
        ? [{ url: category.icon.asset.url, alt: category.icon.alt || title }]
        : [],
    },
    twitter: {
      title,
      description,
      images: category?.icon?.asset?.url ? [category.icon.asset.url] : [],
    },
  };
}

// Thin Spanish route: it renders the SAME category template as the
// English page, with locale="es". No duplicated page copy lives here:
// the category content comes from Sanity (Spanish fields, English
// fallback), only the text changes.
export default function SeguridadDelHogarPage() {
  return (
    <ServicePage
      params={Promise.resolve({ slug: "home-security" })}
      locale="es"
    />
  );
}
