import { NextResponse } from "next/server";
import { getGoogleReviews } from "@/lib/google-reviews";

export async function GET() {
  const reviews = await getGoogleReviews();
  return NextResponse.json(reviews);
}