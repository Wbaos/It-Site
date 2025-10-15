import { NextResponse } from "next/server";
import { sanity } from "@/lib/sanity";

type Service = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  price?: number;
  category?: string;
  image?: { asset?: { url: string } };
  parentService?: { _id: string };
  subservices?: Service[];
};

export async function GET() {
  try {
    const query = `
      *[_type == "service"]{
        _id,
        title,
        "slug": slug.current,
        description,
        price,
        "category": category->title,
        image { asset -> { url } },
        parentService->{ _id }
      }
    `;

    const services: Service[] = await sanity.fetch(query);

    const parents = services.filter((s) => !s.parentService);
    const subs = services.filter((s) => s.parentService);

    for (const parent of parents) {
      parent.subservices = subs.filter(
        (sub: Service) => sub.parentService?._id === parent._id
      );
    }

    const grouped: Record<string, Service[]> = {};
    for (const s of parents) {
      const cat = s.category || "Other";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(s);
    }

    return NextResponse.json(grouped);
  } catch (err) {
    console.error("❌ Error fetching services:", err);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}
