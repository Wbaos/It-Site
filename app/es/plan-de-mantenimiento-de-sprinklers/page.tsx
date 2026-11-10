import type { Metadata } from "next";
import { sanity } from "@/lib/sanity";
import ServicePage from "@/app/services/[slug]/page";

const ES_PAGE_URL =
  "https://www.calltechcare.com/es/plan-de-mantenimiento-de-sprinklers";
const EN_SERVICE_URL =
  "https://www.calltechcare.com/services/sprinkler-maintenance-plan";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const service = await sanity.fetch(
    `*[_type == "service" && slug.current == "sprinkler-maintenance-plan"][0]{
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
    "Plan de Mantenimiento de Sprinklers";
  const description =
    service?.metaDescriptionEs ||
    service?.descriptionEs ||
    "Dos visitas de mantenimiento de sprinklers al año en Miami y Broward: revisión completa del sistema, programación por temporada y reporte escrito. Inspección gratis.";
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
export default function PlanDeMantenimientoDeSprinklersPage() {
  return (
    <ServicePage
      params={Promise.resolve({ slug: "sprinkler-maintenance-plan" })}
      locale="es"
    />
  );
}
