import type { Metadata } from "next";
import { sanity } from "@/lib/sanity";
import ServicePage from "@/app/services/[slug]/page";

const ES_PAGE_URL =
  "https://www.calltechcare.com/es/reparacion-de-sprinklers-e-irrigacion";
const EN_CATEGORY_URL = "https://www.calltechcare.com/services/landscaping";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const category = await sanity.fetch(
    `*[_type == "category" && slug.current == "landscaping"][0]{
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
      : "Reparación de Sprinklers e Irrigación en Miami y Broward | CallTechCare");
  const description =
    category?.metaDescriptionEs ||
    category?.taglineEs ||
    category?.descriptionEs ||
    "Servicios profesionales de reparación de sprinklers e instalación de irrigación para propiedades residenciales y comerciales en todo el sur de Florida.";
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
export default function ReparacionDeSprinklersEIrrigacionPage() {
  return (
    <ServicePage
      params={Promise.resolve({ slug: "landscaping" })}
      locale="es"
    />
  );
}
