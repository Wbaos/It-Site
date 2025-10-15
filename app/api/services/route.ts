import { NextResponse } from "next/server";
import { client } from "@/lib/sanity.client";

export async function GET() {
  try {
    const services = await client.fetch(`
      *[_type == "service" && !defined(parentService)]{
        _id,
        title,
        "slug": slug.current,
        "category": category->title,
        price,
        description,
        image,
        details,
        faqs,
        testimonials,
        "subservices": *[_type == "service" && references(^._id)]{
          _id,
          title,
          "slug": slug.current,
          price,
          description
        }
      } | order(category->title asc, title asc)
    `);

    const grouped = services.reduce((acc: Record<string, any[]>, item: any) => {
      const cat = item.category || "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});

    return NextResponse.json(grouped);
  } catch (err: any) {
    console.error("Failed to fetch services:", err);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
