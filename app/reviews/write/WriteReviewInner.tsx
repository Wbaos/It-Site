
import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

export default function WriteReviewPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const serviceTitle = searchParams.get("title") || "";
    const serviceSlug = searchParams.get("slug") || "";
    const serviceImage = searchParams.get("img") || "";

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [title, setTitle] = useState("");
    const [comment, setComment] = useState("");
    const [media, setMedia] = useState<File | null>(null);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const handleSubmit = async () => {
        if (!session) return alert("Please log in to write a review.");
        if (!rating || !comment.trim() || !title.trim())
            return alert("Please fill all required fields.");

        const formData = new FormData();
        formData.append("serviceSlug", serviceSlug);
        formData.append("rating", rating.toString());
        formData.append("comment", comment);
        formData.append("title", title);
        if (media) formData.append("media", media);

        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                body: formData,
            });

            if (res.ok) setStatus("success");
            else setStatus("error");
        } catch (err) {
            console.error("Error submitting review:", err);
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <div className="review-success">
                <div className="success-icon">✔</div>
                <h2>Review Submitted</h2>
                <p>Awesome! Thank you for helping other shoppers!</p>
                <button onClick={() => router.push(`/services/${serviceSlug}`)}>
                    Back to Service
                </button>
            </div>
        );
    }

    return (
        <div className="review-write-page">
            <div className="review-write-page-inside">
            <h2>How was the service?</h2>

            <div className="review-header">
                {serviceImage && (
                    <Image src={serviceImage} alt={serviceTitle} width={80} height={80} />
                )}
                <div>
                    <h3>{serviceTitle}</h3>
                    <p>We value your feedback to improve our services.</p>
                </div>
            </div>

            {/* Star rating */}
            <div className="stars">
                {[1, 2, 3, 4, 5].map((n) => (
                    <span
                        key={n}
                        className={`star ${n <= (hover || rating) ? "filled" : ""}`}
                        onClick={() => setRating(n)}
                        onMouseEnter={() => setHover(n)}
                        onMouseLeave={() => setHover(0)}
                    >
                        ★
                    </span>
                ))}
            </div>

            <input
                type="text"
                placeholder="Title your review (required)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Write your review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />

            <label className="upload-box">
                <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => setMedia(e.target.files?.[0] || null)}
                />
                {media ? (
                    <span>📎 {media.name}</span>
                ) : (
                    <span>📸 Upload a photo or video</span>
                )}
            </label>

            <div className="form-actions">
                <button className="btn-submit-review" onClick={handleSubmit}>
                    Submit Review
                </button>
                <button className="btn-cancel" onClick={() => router.back()}>
                    Cancel
                </button>
            </div>
            </div>
        </div>
    );
}
