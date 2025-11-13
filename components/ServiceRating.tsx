"use client";

import SvgIcon from "@/components/common/SvgIcons";

export default function ServiceRating({
  rating,
  reviewsCount,
}: {
  rating: number;
  reviewsCount?: number;
}) {
  const handleScroll = () => {
    const section = document.querySelector(".reviews-section");
    if (section) {
      const yOffset = -80;
      const y = section.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const getStarFill = (index: number) => {
    const diff = rating - index;
    if (diff >= 1) return 100;
    if (diff > 0) return diff * 100;
    return 0;
  };

  return (
    <div className="service-rating" onClick={handleScroll}>
      <div className="star-wrapper">
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = getStarFill(i);
          return (
            <div
              className="star-item"
              key={i}
              style={{ position: "relative", width: 16, height: 16 }} 
            >
              <SvgIcon name="star" size={16} className="star-outline" />

              <div
                className="star-fill"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: `${fill}%`,
                  height: "100%",
                  overflow: "hidden",
                  pointerEvents: "none",
                }}
              >
                <SvgIcon name="star" size={16} className="star-filled" />
              </div>
            </div>
          );
        })}
      </div>

      <span className="score">{rating.toFixed(1)}</span>
      {reviewsCount !== undefined && (
        <span className="reviews">· {reviewsCount} reviews</span>
      )}
    </div>
  );
}
