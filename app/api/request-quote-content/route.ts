import { NextResponse } from "next/server";
import { getRequestQuoteContent } from "@/lib/request-quote-data";

export const revalidate = 60;

export async function GET() {
  try {
    const data = await getRequestQuoteContent();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (err) {
    console.error("request-quote-content GET error", err);
    return NextResponse.json({ error: "Failed to load content" }, { status: 500 });
  }
}
