import { sanity } from "@/lib/sanity";

export async function GET() {
  try {
    const data = await sanity.fetch(
      `*[_type == "service" && popular == true]{
        _id,
        title,
        "slug": slug.current,
        "icon": icon,
        "emoji": emoji,
        serviceType
      } | order(title asc)`
    );

    return Response.json({ results: data });
  } catch (err) {
    console.error("POPULAR SEARCH API ERROR:", err);
    return Response.json({ results: [] }, { status: 500 });
  }
}
