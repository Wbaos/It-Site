import { NextResponse } from "next/server";
import { sanity } from "@/lib/sanity";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get("q")?.trim().toLowerCase().replace(/[-\s]/g, "") || "";

        if (!q) return NextResponse.json({ results: [] });

        const results = await sanity.fetch(
            `*[_type == "service"] | order(title asc) {
        _id,
        title,
        slug,
        "category": category->title,
        description,
        image { asset -> { url } }
      }`
        );

        const filtered = results.filter((r: any) => {
            const normalizedTitle = r.title?.toLowerCase().replace(/[-\s]/g, "");
            const normalizedDesc = r.description?.toLowerCase().replace(/[-\s]/g, "");
            return normalizedTitle?.includes(q) || normalizedDesc?.includes(q);
        });

        return NextResponse.json({ results: filtered });
    } catch (err) {
        console.error("Sanity search error:", err);
        return NextResponse.json({ results: [] }, { status: 500 });
    }
}
