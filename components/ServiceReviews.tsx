"use client";

import { useEffect, useState } from "react";
import { sanity } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import SvgIcon from "./common/SvgIcons";

interface Review {
    _id: string;
    userName: string;
    rating: number;
    comment: string;
    title?: string;
    _createdAt: string;
    media?: string;
}

export default function ServiceReviews({ slug }: { slug: string }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [service, setService] = useState<{ title?: string; image?: string }>({});

    // Fetch approved reviews + service info
    useEffect(() => {
        const fetchReviews = async () => {
            const query = `*[_type == "review" && approved == true && serviceSlug == $slug] | order(_createdAt desc) {
        _id, userName, rating, comment, title, _createdAt, "media": media.asset->url
      }`;
            const data = await sanity.fetch(query, { slug });
            setReviews(data);
        };

        const fetchService = async () => {
            const query = `*[_type == "service" && slug.current == $slug][0]{ title, image { asset->{url} } }`;
            const data = await sanity.fetch(query, { slug });
            setService({
                title: data?.title || "",
                image: data?.image?.asset?.url || "",
            });
        };

        fetchReviews();
        fetchService();
    }, [slug]);

    return (
        <div className="reviews-section">
            <h3 className="reviews-title">Customer Reviews</h3>
            {/* Button to new page */}
            <div className="review-action-footer">
                <Link
                    href={`/reviews/write?slug=${slug}&title=${encodeURIComponent(
                        service.title || ""
                    )}&img=${encodeURIComponent(service.image || "")}`}
                    className="btn-write-review"
                >
                    Write a Review
                </Link>
            </div>

            {/* Existing Reviews */}
            {/* {reviews.length === 0 && <p>No reviews yet — be the first to share your experience!</p>} */}

            {/* <div className="existing-reviews">
                <ul className="review-list">
                    {reviews.map((r) => (
                        <li key={r._id} className="review-card">
                            <div className="review-top">
                                <div className="review-avatar">
                                    <SvgIcon name="user-avatar" size={40} color="#333" />
                                    <p className="review-author">{r.userName}</p>
                                </div>

                                <div className="review-meta">
                                    <div className="review-stars">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <span key={i} className={i < r.rating ? "filled" : ""}>★</span>
                                        ))}
                                    </div>

                                    {r.title && <p className="review-title">{r.title}</p>}

                                    <p className="review-date">
                                        Reviewed on{" "}
                                        {new Date(r._createdAt).toLocaleDateString(undefined, {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div className="review-body">
                                <p className="review-comment">{r.comment}</p>

                                {r.media && (
                                    <div className="review-media">
                                        {r.media.endsWith(".mp4") ? (
                                            <video src={r.media} controls />
                                        ) : (
                                            <img src={r.media} alt="Review" />
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="review-actions">
                                <button>Helpful</button>
                                <button>Report</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div> */}


        </div>
    );
}
