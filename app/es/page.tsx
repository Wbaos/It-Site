import type { Metadata } from "next";

import HomeTemplate from "@/components/sections/HomeTemplate";
import { resolveSiteSettings } from "@/lib/sanitySettings";

export const dynamic = "force-dynamic";

const ES_HOME_URL = "https://www.calltechcare.com/es/";
const EN_HOME_URL = "https://www.calltechcare.com/";

// Thin Spanish route: it renders the SAME shared home template as the
// English home page, with locale="es". No duplicated page copy lives here:
// structure, sections and icons come from HomeTemplate, only the text
// changes. Service and city links point to the existing English pages: no
// /es/* URL is linked unless it exists (the Spanish service, contact and
// quote pages, which the switcher links to).
// No prices, no diagnosis cost, no round-the-clock promise, no invented testimonials:
// the only review data shown is the real Google aggregate rendered by
// GoogleReviewsCTA (5.0, 26 reviews, link to Google).
export async function generateMetadata(): Promise<Metadata> {
  const settings = await resolveSiteSettings();
  return {
    title: "Reparación de Sprinklers en Miami y Broward | CallTechCare",
    description: `Reparación de sprinklers e irrigación en Miami y Broward. Servicio el mismo día dentro del horario de servicio, inspección gratis. Llama al ${settings.phoneDisplay}.`,
  alternates: {
    canonical: ES_HOME_URL,
    languages: {
      es: ES_HOME_URL,
      en: EN_HOME_URL,
      "x-default": EN_HOME_URL,
    },
  },
  openGraph: {
    title: "Reparación de Sprinklers en Miami y Broward | CallTechCare",
    description:
      "Reparación de sprinklers e irrigación en Miami y Broward. Servicio el mismo día dentro del horario de servicio, inspección gratis.",
    url: ES_HOME_URL,
    siteName: "CallTechCare",
    images: [
      {
        url: "https://www.calltechcare.com/logo-og.png",
        width: 1200,
        height: 630,
        alt: "CallTechCare - Reparación de Sprinklers en Miami y Broward",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reparación de Sprinklers en Miami y Broward | CallTechCare",
    description:
      "Reparación de sprinklers e irrigación en Miami y Broward. Servicio el mismo día dentro del horario de servicio, inspección gratis.",
    images: ["https://www.calltechcare.com/logo-og.png"],
  },
  };
}

export default function Page() {
  return <HomeTemplate locale="es" />;
}
