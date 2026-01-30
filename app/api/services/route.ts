
import { NextResponse } from "next/server";
import { getServiceCategories } from "@/lib/request-quote-data";


export async function GET() {
  try {
    const grouped = await getServiceCategories();
    return NextResponse.json(grouped);
  } catch (err) {
    console.error("API ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load services" },
      { status: 500 }
    );
  }
}
