import RequestQuoteClient from "./RequestQuoteClient";
import { getRequestQuoteContent, getServiceCategories } from "@/lib/request-quote-data";

export const revalidate = 60;

export default async function RequestQuotePage({
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
      initialCategories={safeCategories}
      initialRqContent={initialRqContent}
      initialTab={initialTab}
    />
  );
}
