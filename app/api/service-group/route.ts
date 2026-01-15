import { NextRequest, NextResponse } from "next/server";
import { sanity } from "@/lib/sanity";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json([]);
  }

  const services = await sanity.fetch(
    `
    *[_type == "service" && group->slug.current == $slug && enabled == true]{
      title,
      "slug": slug.current,
      price,
      showPrice,
      description,
      serviceType,
      popular
    }
    `,
    { slug }
  );

  return NextResponse.json(services || []);
}
