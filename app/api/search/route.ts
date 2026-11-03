import { NextResponse } from "next/server";
import { sanity } from "@/lib/sanity";

function normalize(value: string | undefined | null): string {
    return (value ?? "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[-\s]/g, "");
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const q = normalize(searchParams.get("q")?.trim());

        if (!q) return NextResponse.json({ results: [] });

        const results = await sanity.fetch(
            `*[_type == "service"] | order(title asc) {
        _id,
        title,
        titleEs,
        descriptionEs,
        navDescriptionEs,
        slug,
        "category": category->title,
        description,
        image { asset -> { url } }
      }`
        );

        const filtered = results.filter((r: any) => {
            return (
                normalize(r.title).includes(q) ||
                normalize(r.description).includes(q) ||
                normalize(r.titleEs).includes(q) ||
                normalize(r.descriptionEs).includes(q) ||
                normalize(r.navDescriptionEs).includes(q)
            );
        });

        return NextResponse.json({ results: filtered });
    } catch (err) {
        console.error("Sanity search error:", err);
        return NextResponse.json({ results: [] }, { status: 500 });
    }
}
