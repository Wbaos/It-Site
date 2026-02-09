import { redirect } from "next/navigation";

export default async function Step1Redirect({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  const qs = new URLSearchParams();
  if (resolvedSearchParams) {
    for (const [key, value] of Object.entries(resolvedSearchParams)) {
      if (typeof value === "string") qs.set(key, value);
      else if (Array.isArray(value)) value.forEach((v) => qs.append(key, v));
    }
  }

  const suffix = qs.toString();
  redirect(`/book/${slug}${suffix ? `?${suffix}` : ""}`);
}
