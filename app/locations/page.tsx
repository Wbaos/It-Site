import type { Metadata } from "next";
import LocationsClient from "./LocationsClient";

export const metadata: Metadata = {
  title: "Service Areas in South Florida | CallTechCare",
  description:
    "Browse the cities and communities CallTechCare serves across Miami-Dade and Broward County in South Florida.",
};

export default function LocationsPage() {
  return <LocationsClient />;
}
