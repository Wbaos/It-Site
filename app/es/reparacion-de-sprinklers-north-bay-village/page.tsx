import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CityTemplate, { cityOgAlt } from "@/components/CityTemplate";
import { getCityBySlug } from "@/lib/sanityCities";

const PAGE_URL = "https://www.calltechcare.com/es/reparacion-de-sprinklers-north-bay-village";
const EN_PAGE_URL = "https://www.calltechcare.com/sprinkler-repair-north-bay-village";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const city = await getCityBySlug("north-bay-village");
  if (!city) return {};
  const title = city.metaTitleEs || city.metaTitle;
  const description = city.metaDescriptionEs || city.metaDescription;
  return {
    title,
    description,
    alternates: {
      canonical: PAGE_URL,
      languages: { es: PAGE_URL, en: EN_PAGE_URL, "x-default": EN_PAGE_URL },
    },
    openGraph: {
      title,
      description,
      url: PAGE_URL,
      siteName: "CallTechCare",
      images: [
        {
          url: "https://www.calltechcare.com/logo-og.png",
          width: 1200,
          height: 630,
          alt: cityOgAlt(city, "es"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://www.calltechcare.com/logo-og.png"],
    },
  };
}

// Thin Spanish route: renders the SAME city template as the English page,
// with locale="es". No duplicated page copy lives here: structure,
// sections and icons come from the shared template, only the text changes
// (Spanish fields from Sanity, English fallback when empty).
export default async function ReparacionDeSprinklersNorthBayVillagePage() {
  const city = await getCityBySlug("north-bay-village");
  if (!city) notFound();
  return <CityTemplate city={city} locale="es" />;
}
