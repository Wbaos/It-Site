import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocationBySlug, getAllLocationSlugs } from "@/lib/sanityLocations";
import { urlFor } from "@/lib/sanityImage";
import { resolveSiteSettings, substitutePhonePlaceholders } from "@/lib/sanitySettings";
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
  const location = await getLocationBySlug(slug);
  const settings = await resolveSiteSettings();

  if (!location) {
    return {
      title: "Location Not Found",
    };
  }

  // Location copy may carry {{phone}} markers; they resolve to site-settings.
  const description = substitutePhonePlaceholders(
    location.metaDescription || location.description,
    settings,
  );

  return {
    title:
      location.metaTitle ||
      `${location.title} | Sprinkler Repair, Irrigation & Security Cameras`,
    description,
    alternates: {
      canonical: `https://www.calltechcare.com/locations/${slug}`,
      languages: {
        es: `https://www.calltechcare.com/es/areas-de-servicio/${slug}`,
        en: `https://www.calltechcare.com/locations/${slug}`,
        "x-default": `https://www.calltechcare.com/locations/${slug}`,
      },
    },
    openGraph: {
      title: location.metaTitle || location.title,
      description,
      url: `https://www.calltechcare.com/locations/${slug}`,
      siteName: "CallTechCare",
      images: location.heroImage
        ? [{ url: urlFor(location.heroImage).width(1200).height(630).url() }]
        : [],
    }
  };
}

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;
  const location = await getLocationBySlug(slug);
  if (!location) {
    notFound();
  }
  return <LocationDetail slug={slug} locale="en" />;
}
