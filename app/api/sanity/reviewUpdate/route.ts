import { NextResponse } from "next/server";
import { sanity } from "@/lib/sanity";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Get the slug of the affected service from the review document
    const serviceSlug = body?.document?.serviceSlug;
    if (!serviceSlug) {
      return NextResponse.json({ error: "Missing serviceSlug" }, { status: 400 });
    }

    // Fetch all approved reviews for that service
    const reviews = await sanity.fetch(
      `*[_type == "review" && approved == true && serviceSlug == $slug]{ rating }`,
      { slug: serviceSlug }
    );

    // Compute average rating
    const total = reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0);
    const avg = reviews.length ? parseFloat((total / reviews.length).toFixed(1)) : 0;

    // Get the service document ID
    const serviceDoc = await sanity.fetch(
      `*[_type == "service" && slug.current == $slug][0]{ _id }`,
      { slug: serviceSlug }
    );

    if (!serviceDoc?._id) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Update service document with new average + count
    await sanity
      .patch(serviceDoc._id)
      .set({
        rating: avg,
        reviewsCount: reviews.length,
      })
      .commit();

    return NextResponse.json({
      message: "Service rating updated successfully",
      slug: serviceSlug,
      rating: avg,
      reviewsCount: reviews.length,
    });
  } catch (err) {
    console.error("Review update error:", err);
    return NextResponse.json({ error: "Failed to update service rating" }, { status: 500 });
  }
}
