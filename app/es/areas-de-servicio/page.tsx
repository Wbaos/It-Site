import type { Metadata } from "next";
import LocationsClient from "@/app/locations/LocationsClient";
import { resolveSiteSettings } from "@/lib/sanitySettings";
import { getAllActiveLocations, type Location } from "@/lib/sanityLocations";

export const metadata: Metadata = {
  title: "Áreas de Servicio de Sprinklers | CallTechCare",

  description:
    "Explora las 32 ciudades que CallTechCare atiende en Miami-Dade y Broward para reparación de sprinklers e instalación de irrigación.",

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
      "Explora las 32 ciudades que CallTechCare atiende en Miami-Dade y Broward para reparación de sprinklers, instalación de irrigación, reemplazo de válvulas y temporizadores.",
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

  // CLS fix (16 Nov 2026): fetch the county cards on the server so they
  // (and the search bar) render in the SSR HTML instead of popping in
  // after a client-side fetch. On failure the client component falls back
  // to fetching them itself, exactly as before.
  let initialLocations: Location[] = [];
  try {
    initialLocations = await getAllActiveLocations();
  } catch {
    initialLocations = [];
  }
  const locationsSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Áreas de Servicio de CallTechCare",
    url: "https://www.calltechcare.com/es/areas-de-servicio",
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

      <LocationsClient locale="es" phoneDisplay={settings.phoneDisplay} initialLocations={initialLocations} />
    </>
  );
}
