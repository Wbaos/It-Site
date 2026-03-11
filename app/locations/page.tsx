import type { Metadata } from "next";
import LocationsClient from "./LocationsClient";

export const metadata: Metadata = {
  title: "Service Areas in South Florida | CallTechCare",

  description:
    "Explore the cities and communities CallTechCare serves across Miami-Dade and Broward County for TV mounting, security camera installation, Wi-Fi troubleshooting, computer support, sprinkler repair, and home services.",

  alternates: {
    canonical: "https://www.calltechcare.com/locations",
  },

  openGraph: {
    title: "CallTechCare Service Areas | South Florida",
    description:
      "Browse the cities and communities CallTechCare serves across Miami-Dade and Broward County for home, outdoor, and tech services.",
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

export default function LocationsPage() {

  const locationsSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "CallTechCare Service Areas",
    url: "https://www.calltechcare.com/locations",
    about: {
      "@type": "LocalBusiness",
      name: "CallTechCare",
      areaServed: [
        "Miami",
        "Miami Beach",
        "Coral Gables",
        "Hialeah",
        "Homestead",
        "Miramar",
        "Pembroke Pines",
        "Hollywood",
        "Fort Lauderdale",
        "Davie"
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

      <LocationsClient />
    </>
  );
}