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

const DESCRIPTION_ES: Record<string, string> = {
  miami: "CallTechCare ofrece reparación profesional de sprinklers e instalación de irrigación en Miami para propiedades residenciales y comerciales. También ofrecemos instalación de cámaras de seguridad. Atendemos todos los barrios de Miami con servicio rápido y confiable y estimados claros.",
  "fort-lauderdale": "CallTechCare ofrece reparación profesional de sprinklers e instalación de irrigación en Fort Lauderdale para propiedades residenciales y comerciales. También ofrecemos instalación de cámaras de seguridad en todo el condado de Broward con servicio rápido y confiable.",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const location = await getLocationBySlug(slug, "es");

  if (!location) {
    return {
      title: "Ubicación No Encontrada",
    };
  }

  return {
    title: `${location.city} | Reparación de Sprinklers, Irrigación y Cámaras de Seguridad`,
    description: DESCRIPTION_ES[slug] || location.description,
    alternates: {
      canonical: `https://www.calltechcare.com/es/areas-de-servicio/${slug}`,
      languages: {
        es: `https://www.calltechcare.com/es/areas-de-servicio/${slug}`,
        en: `https://www.calltechcare.com/locations/${slug}`,
      },
    },
    openGraph: {
      title: location.city,
      description: DESCRIPTION_ES[slug] || location.description,
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
