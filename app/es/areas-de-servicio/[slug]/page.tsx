import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocationBySlug, getAllLocationSlugs } from "@/lib/sanityLocations";
import { urlFor } from "@/lib/sanityImage";
import LocationDetail from "@/components/LocationDetail";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllLocationSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const location = await getLocationBySlug(slug, "es");

  if (!location) {
    return {
      title: "Ubicación No Encontrada",
    };
  }

  return {
    title: `${location.city} | Reparación de Sprinklers, Irrigación y Cámaras`,
    description: location.descriptionEs || location.description,
    alternates: {
      canonical: `https://www.calltechcare.com/es/areas-de-servicio/${slug}`,
      languages: {
        es: `https://www.calltechcare.com/es/areas-de-servicio/${slug}`,
        en: `https://www.calltechcare.com/locations/${slug}`,
        "x-default": `https://www.calltechcare.com/locations/${slug}`,
      },
    },
    openGraph: {
      title: location.city,
      description: location.descriptionEs || location.description,
      url: `https://www.calltechcare.com/es/areas-de-servicio/${slug}`,
      siteName: "CallTechCare",
      images: location.heroImage
        ? [{ url: urlFor(location.heroImage).width(1200).height(630).url() }]
        : [],
    }
  };
}

export default async function LocationPageEs({ params }: Props) {
  const { slug } = await params;
  const location = await getLocationBySlug(slug, "es");
  if (!location) {
    notFound();
  }
  return <LocationDetail slug={slug} locale="es" />;
}
