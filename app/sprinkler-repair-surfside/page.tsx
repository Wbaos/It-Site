import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CityTemplate, { cityOgAlt } from "@/components/CityTemplate";
import { getCityBySlug } from "@/lib/sanityCities";

const PAGE_URL = "https://www.calltechcare.com/sprinkler-repair-surfside";
const ES_PAGE_URL = "https://www.calltechcare.com/es/reparacion-de-sprinklers-surfside";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const city = await getCityBySlug("surfside");
  if (!city) return {};
  return {
    title: city.metaTitle,
    description: city.metaDescription,
    alternates: {
      canonical: PAGE_URL,
      languages: { en: PAGE_URL, es: ES_PAGE_URL, "x-default": PAGE_URL },
    },
    openGraph: {
      title: city.metaTitle,
      description: city.metaDescription,
      url: PAGE_URL,
      siteName: "CallTechCare",
      images: [
        {
          url: "https://www.calltechcare.com/logo-og.png",
          width: 1200,
          height: 630,
          alt: cityOgAlt(city, "en"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: city.metaTitle,
      description: city.metaDescription,
      images: ["https://www.calltechcare.com/logo-og.png"],
    },
  };
}

// Thin route: renders the shared city template with the Sanity document
// for this city. No page copy lives here.
export default async function SprinklerRepairSurfsidePage() {
  const city = await getCityBySlug("surfside");
  if (!city) notFound();
  return <CityTemplate city={city} locale="en" />;
}
