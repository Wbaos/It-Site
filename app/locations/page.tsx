import type { Metadata } from "next";
import LocationsClient from "./LocationsClient";
import { resolveSiteSettings } from "@/lib/sanitySettings";

export const metadata: Metadata = {
  title: "Sprinkler Repair Service Areas | CallTechCare",

  description:
    "Explore the 32 cities CallTechCare serves across Miami-Dade and Broward County for sprinkler repair, irrigation installation, valve and timer replacement.",

  alternates: {
    canonical: "https://www.calltechcare.com/locations",
    languages: {
      es: "https://www.calltechcare.com/es/areas-de-servicio",
      en: "https://www.calltechcare.com/locations",
      "x-default": "https://www.calltechcare.com/locations",
    },
  },

  openGraph: {
    title: "Sprinkler Repair Service Areas | Miami & Broward",
    description:
      "Explore the 32 cities CallTechCare serves across Miami-Dade and Broward County for sprinkler repair, irrigation installation, valve and timer replacement.",
    url: "https://www.calltechcare.com/locations",
    siteName: "CallTechCare",
    images: [
      {
        url: "https://www.calltechcare.com/logo-schema.png",
        width: 512,
        height: 512,
      },
    ],
  },
};

export default async function LocationsPage() {
  const settings = await resolveSiteSettings();

  const locationsSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "CallTechCare Service Areas",
    url: "https://www.calltechcare.com/locations",
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(locationsSchema),
        }}
      />

      <LocationsClient phoneDisplay={settings.phoneDisplay} />
    </>
  );
}