import type { Testimonial } from "@/components/common/TestimonialsList";

export function getGoogleReviewsUrl(): string | null {
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!placeId) return null;
  return `https://search.google.com/local/reviews?placeid=${encodeURIComponent(placeId)}`;
}

export function getGoogleWriteReviewUrl(): string | null {
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!placeId) return null;
  return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`;
}

export async function getGoogleReviews(): Promise<Testimonial[]> {
  const placeId = process.env.GOOGLE_PLACE_ID;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!placeId || !apiKey) return [];

  const url =
    `https://maps.googleapis.com/maps/api/place/details/json` +
    `?place_id=${placeId}` +
    `&fields=reviews` +
    `&key=${apiKey}`;

  const res = await fetch(url, { next: { revalidate: 60 * 60 } });
  const data = await res.json();

  if (!data?.result?.reviews) return [];

  return data.result.reviews.map((r: any) => ({
    name: r.author_name,
    text: r.text,
    rating: r.rating,
    verified: true,
    date: new Date(r.time * 1000).toISOString(),
  }));
}
