import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

// On-demand revalidation for Sanity content changes.
//
// A Sanity webhook POSTs here whenever content is published, so a saved
// page goes live right away instead of waiting for the hourly cache.
// The webhook URL carries the secret as a query param:
//   https://www.calltechcare.com/api/revalidate?secret=SANITY_REVALIDATE_SECRET
// SANITY_REVALIDATE_SECRET is set in the Vercel env vars, never committed.
//
// The body can list the paths directly:
//   { "paths": ["/", "/es/", "/sprinkler-repair-miami"] }
// or a single path:
//   { "path": "/sprinkler-repair-miami" }
// or a Sanity document, from which the affected paths are derived
// (a webhook with no projection posts the document as-is):
//   { "_type": "city", "slug": { "current": "miami" } }
//   { "_type": "homePage" }             -> / and /es/
//   { "_type": "siteSettings" }         -> / and /es/ (phone/hours show everywhere)
//   { "_type": "service", "slug": ... } -> /services/<slug> plus the hubs
//   { "_type": "post", ... }            -> /blog and /es/blog
//   { "_type": "location", ... }        -> /locations and /es/areas-de-servicio
//
// Only paths starting with "/" are revalidated; anything else is ignored.
// A missing or wrong secret returns 401 and revalidates nothing.

const HUB_CITY_SLUGS = new Set(["miami", "fort-lauderdale"]);

function slugOf(doc: any): string | null {
  const s = doc?.slug;
  if (typeof s === "string") return s;
  if (typeof s?.current === "string") return s.current;
  return null;
}

function pathsForDocument(doc: any): string[] {
  const type = typeof doc?._type === "string" ? doc._type : "";
  const slug = slugOf(doc);
  switch (type) {
    case "homePage":
    case "siteSettings":
      return ["/", "/es/"];
    case "city": {
      if (!slug) return [];
      const paths = [
        `/sprinkler-repair-${slug}`,
        `/es/reparacion-de-sprinklers-${slug}`,
      ];
      if (HUB_CITY_SLUGS.has(slug)) {
        paths.push(`/es/areas-de-servicio/${slug}`, `/locations/${slug}`);
      }
      return paths;
    }
    case "service": {
      if (!slug) return [];
      return [`/services/${slug}`, "/services", "/es/servicios"];
    }
    case "post":
      return ["/blog", "/es/blog"];
    case "location":
      return ["/locations", "/es/areas-de-servicio"];
    default:
      return [];
  }
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const secret =
    url.searchParams.get("secret") ??
    request.headers.get("x-revalidate-secret");
  if (!secret || secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }
  const body: any = await request.json().catch(() => null);
  const paths = new Set<string>();
  const add = (p: unknown) => {
    if (typeof p === "string" && p.startsWith("/")) paths.add(p);
  };
  if (Array.isArray(body?.paths)) body.paths.forEach(add);
  add(body?.path);
  pathsForDocument(body).forEach((p) => paths.add(p));
  if (paths.size === 0) {
    return NextResponse.json({
      revalidated: [],
      message: "No paths to revalidate for this payload.",
    });
  }
  for (const p of paths) revalidatePath(p);
  return NextResponse.json({ revalidated: [...paths] });
}
