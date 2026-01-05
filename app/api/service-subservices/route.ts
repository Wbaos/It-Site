import { NextRequest, NextResponse } from "next/server";
import { sanity } from "@/lib/sanity";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug) return NextResponse.json([]);
  const subservices = await sanity.fetch(
    `*[_type == "service" && parentService->slug.current == $slug]{
      title,
      "slug": slug.current,
      price,
      showPrice,
      description,
      serviceType,
      popular
    }`,
    { slug }
  );
  return NextResponse.json(subservices || []);
}