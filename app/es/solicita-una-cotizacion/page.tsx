import type { Metadata } from "next";
import RequestQuoteClient from "@/app/request-quote/RequestQuoteClient";
import { getRequestQuoteContent, getServiceCategories } from "@/lib/request-quote-data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Inspección gratis de sprinklers en Miami y Broward | CallTechCare",
  description:
    "Solicita una cotización gratis de CallTechCare para reparación de sprinklers, irrigación e instalación de cámaras de seguridad en Miami y Broward. Respondemos dentro de 24 horas.",
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

  const [initialCategories, initialRqContent] = await Promise.all([
    getServiceCategories(),
    getRequestQuoteContent(),
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
    />
  );
}
