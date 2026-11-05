import type { Metadata } from "next";
import RequestQuoteClient from "@/app/request-quote/RequestQuoteClient";
import { getRequestQuoteContent, getServiceCategories } from "@/lib/request-quote-data";
import {
  getGoogleRatingSummary,
  FALLBACK_GOOGLE_RATING_SUMMARY,
} from "@/lib/google-reviews";
import { resolveSiteSettings } from "@/lib/sanitySettings";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Inspección gratis de sprinklers | Miami y Broward | CallTechCare",
  description:
    "Solicita una cotización gratis para reparación de sprinklers, irrigación e instalación de cámaras en Miami y Broward. Respondemos dentro de 24 horas.",
  alternates: {
    canonical: "https://www.calltechcare.com/es/solicita-una-cotizacion",
    languages: {
      es: "https://www.calltechcare.com/es/solicita-una-cotizacion",
      en: "https://www.calltechcare.com/request-quote",
      "x-default": "https://www.calltechcare.com/request-quote",
    },
  },
};

export default async function SolicitaUnaCotizacionPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) || {};
  const tabRaw = sp.tab;
  const requestedTab = Array.isArray(tabRaw) ? tabRaw[0] : tabRaw;

  const [initialCategories, initialRqContent, ratingSummary, settings] = await Promise.all([
    getServiceCategories(),
    getRequestQuoteContent(),
    getGoogleRatingSummary().then((s) => s ?? FALLBACK_GOOGLE_RATING_SUMMARY),
    resolveSiteSettings(),
  ]);

  const safeCategories = Array.isArray(initialCategories) ? initialCategories : [];
  const allowedTabs = new Set<string>(["all", "popular", ...safeCategories.map((c) => c.categorySlug)]);
  const initialTab = requestedTab && allowedTabs.has(requestedTab)
    ? requestedTab
    : safeCategories?.[0]?.categorySlug || "all";

  return (
    <RequestQuoteClient
      locale="es"
      initialCategories={safeCategories}
      initialRqContent={initialRqContent}
      initialTab={initialTab}
      ratingSummary={ratingSummary}
      phoneTel={settings.phoneTel}
      phoneDisplay={settings.phoneDisplay}
      phoneCard={settings.phoneCard}
    />
  );
}
