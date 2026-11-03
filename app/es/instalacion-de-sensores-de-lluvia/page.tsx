import type { Metadata } from "next";
import { sanity } from "@/lib/sanity";
import ServicePage from "@/app/services/[slug]/page";

const ES_PAGE_URL =
  "https://www.calltechcare.com/es/instalacion-de-sensores-de-lluvia";
const EN_SERVICE_URL =
  "https://www.calltechcare.com/services/rain-sensor-installation";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const service = await sanity.fetch(
    `*[_type == "service" && slug.current == "rain-sensor-installation"][0]{
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
    "Instalación de Sensores de Lluvia";
  const description =
    service?.metaDescriptionEs ||
    service?.descriptionEs ||
    "Instalación de sensores de lluvia en Miami y Broward para sistemas de sprinklers, para evitar el riego innecesario y mejorar la eficiencia de la irrigación durante el clima lluvioso del sur de Florida.";
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
// Same single-template pattern as the main service twin.
export default function InstalacionDeSensoresDeLluviaPage() {
  return (
    <ServicePage
      params={Promise.resolve({ slug: "rain-sensor-installation" })}
      locale="es"
    />
  );
}
