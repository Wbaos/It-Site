import type { Metadata } from "next";
import { sanity } from "@/lib/sanity";
import ServicePage from "@/app/services/[slug]/page";

const ES_PAGE_URL =
  "https://www.calltechcare.com/es/instalacion-de-pozos-nuevos-de-irrigacion";
const EN_SERVICE_URL =
  "https://www.calltechcare.com/services/new-irrigation-well-installation";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const service = await sanity.fetch(
    `*[_type == "service" && slug.current == "new-irrigation-well-installation"][0]{
      title,
      titleEs,
      descriptionEs,
      metaTitleEs,
      metaDescriptionEs,
      image { asset->{ url }, alt }
    }`
  );
  const title =
    service?.metaTitleEs ||
    service?.titleEs ||
    "Instalación de Pozos Nuevos de Irrigación";
  const description =
    service?.metaDescriptionEs ||
    service?.descriptionEs ||
    "Instalación de pozos nuevos de irrigación en Miami y Broward para casas y negocios: pozo nuevo, bomba y conexión al sistema de riego. Inspección gratis.";
  return {
    title,
    description,
    alternates: {
      canonical: ES_PAGE_URL,
      languages: {
        es: ES_PAGE_URL,
        en: EN_SERVICE_URL,
        "x-default": EN_SERVICE_URL,
      },
    },
    openGraph: {
      title,
      description,
      url: ES_PAGE_URL,
      siteName: "CallTechCare",
      images: service?.image?.asset?.url
        ? [{ url: service.image.asset.url, alt: service.image.alt || title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: service?.image?.asset?.url ? [service.image.asset.url] : [],
    },
  };
}

// Thin Spanish route: it renders the SAME service detail template as the
// English page, with locale="es". No duplicated page copy lives here:
// structure, sections and icons come from the shared template, only the
// text changes (Spanish fields from Sanity, English fallback when empty).
export default function InstalacionDePozosNuevosDeIrrigacionPage() {
  return (
    <ServicePage
      params={Promise.resolve({ slug: "new-irrigation-well-installation" })}
      locale="es"
    />
  );
}
