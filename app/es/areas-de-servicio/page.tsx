import type { Metadata } from "next";
import LocationsClient from "@/app/locations/LocationsClient";
import { resolveSiteSettings } from "@/lib/sanitySettings";

export const metadata: Metadata = {
  title: "Áreas de Servicio de Sprinklers | Miami y Broward | CallTechCare",

  description:
    "Explora las 30 ciudades que CallTechCare atiende en Miami-Dade y Broward para reparación de sprinklers e instalación de irrigación.",

  alternates: {
    canonical: "https://www.calltechcare.com/es/areas-de-servicio",
    languages: {
      es: "https://www.calltechcare.com/es/areas-de-servicio",
      en: "https://www.calltechcare.com/locations",
      "x-default": "https://www.calltechcare.com/locations",
    },
  },

  openGraph: {
    title: "Áreas de Servicio de Reparación de Sprinklers | Miami y Broward",
    description:
      "Explora las 30 ciudades que CallTechCare atiende en Miami-Dade y Broward para reparación de sprinklers, instalación de irrigación, reemplazo de válvulas y temporizadores.",
    url: "https://www.calltechcare.com/es/areas-de-servicio",
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

export default async function LocationsPageEs() {
  const settings = await resolveSiteSettings();
  const locationsSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Áreas de Servicio de CallTechCare",
    url: "https://www.calltechcare.com/es/areas-de-servicio",
    about: {
      "@type": "LocalBusiness",
      name: "CallTechCare",
      areaServed: [
        "Sunrise",
        "Fort Lauderdale",
        "Dania Beach",
        "Weston",
        "Davie",
        "Southwest Ranches",
        "Hollywood",
        "West Park",
        "Pembroke Pines",
        "Miramar",
        "Miami Gardens",
        "Miami Lakes",
        "Country Club",
        "Aventura",
        "Sunny Isles Beach",
        "North Miami",
        "Surfside",
        "North Bay Village",
        "Miami Beach",
        "Hialeah",
        "Doral",
        "Fontainebleau",
        "Tamiami",
        "Miami",
        "Coral Gables",
        "Key Biscayne",
        "Kendall",
        "Kendale Lakes",
        "Country Walk",
        "Cutler Bay"
      ]
    }
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

      <LocationsClient locale="es" phoneDisplay={settings.phoneDisplay} />
    </>
  );
}
