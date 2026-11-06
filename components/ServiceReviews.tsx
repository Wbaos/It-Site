"use client";

import { useEffect, useState } from "react";
import { sanity } from "@/lib/sanity";
import TestimonialsList, { Testimonial } from "@/components/common/TestimonialsList";

export default function ServiceReviews({
  slug,
  initialReviews,
  googleReviewsUrl,
}: {
  slug: string;
  initialReviews?: Testimonial[];
  googleReviewsUrl?: string;
}) {
  const [reviews, setReviews] = useState<Testimonial[]>(initialReviews ?? []);
  const [loading, setLoading] = useState(initialReviews ? false : true);

  const tvMountingSlugs = [
    "small-tv-up-to-32",
    "standard-tv-33-60",
    "large-tv-61",
  ];

  const isTvMounting = tvMountingSlugs.includes(slug);

  useEffect(() => {
    if (initialReviews) {
      setReviews(initialReviews);
      setLoading(false);
      return;
    }

    async function fetchSanityReviews() {
      const query = `*[_type == "review" && approved == true && serviceSlug == $slug]
      | order(_createdAt desc){
        userName,
        rating,
        comment,
        _createdAt
      }`;

      const data = await sanity.fetch(query, { slug });

      const formatted = data.map((r: any) => ({
        name: r.userName,
        text: r.comment,
        rating: r.rating,
        verified: true,
        date: r._createdAt,
      }));

      setReviews(formatted);
      setLoading(false);
    }

    // TV-mounting pages show the Google reviews from Sanity
    // site-settings (the interim bridge in lib/google-reviews.ts): the
    // same array the server wrapper passes as initialReviews. Dates are
    // the relative strings from the Business Profile dashboard ("a week
    // ago") — passed through as-is, never converted or invented. Entries
    // with a name but no text still render (name + stars).
    async function fetchGoogleReviews() {
      try {
        const data = await sanity.fetch(
          `*[_id == "site-settings"][0]{googleReviews}`
        );

        const reviews = Array.isArray(data?.googleReviews)
          ? data.googleReviews
          : [];
        const formatted: Testimonial[] = reviews
          .filter(
            (r: any) =>
              (typeof r?.name === "string" && r.name.trim().length > 0) ||
              (typeof r?.text === "string" && r.text.trim().length > 0)
          )
          .map((r: any) => ({
            name: r.name,
            text: r.text ?? "",
            rating: r.rating,
            verified: Boolean(r.verified),
            date: r.date,
          }));

        setReviews(formatted);
        setLoading(false);
      } catch (err) {
        console.error("Google reviews fetch error:", err);
        setLoading(false);
      }
    }

    if (isTvMounting) {
      fetchGoogleReviews();
    } else {
      fetchSanityReviews();
    }
  }, [slug, initialReviews, isTvMounting]);

  return (
    <>
      {loading && <p>Loading reviews...</p>}

      {!loading && reviews.length > 0 && (
        <TestimonialsList
          items={reviews}
          title="Customer Reviews"
          afterSubtitle={
            googleReviewsUrl ? (
              <a
                className="read-more-btn"
                href={googleReviewsUrl}
                target="_blank"
                rel="noreferrer"
              >
                View all reviews on Google
              </a>
            ) : null
          }
        />
      )}
    </>
  );
}