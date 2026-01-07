"use client";

import { useEffect, useRef, useState } from "react";
import SvgIcon from "./SvgIcons";

export type Testimonial = {
  name?: string;
  text?: string;
  rating?: number;
  verified?: boolean;
  date?: string;
};

type Props = {
  items: Testimonial[];
  title?: string;
  subtitle?: string;
  carousel?: boolean;
  variant?: "card" | "plain";
};

export default function TestimonialsList({
  items,
  title = "What Clients Say",
  subtitle = "Real experiences from satisfied homeowners and businesses.",
  variant = "card", // NEW default
}: Props) {
  const n = items.length;
  const [cols, setCols] = useState(3);
  const [index, setIndex] = useState(cols);
  const [animating, setAnimating] = useState(false);

  const [expanded, setExpanded] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number | null>(null);
  const deltaXRef = useRef<number>(0);

  /** Responsive columns */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 760) setCols(1);
      else if (window.innerWidth < 1300) setCols(2);
      else setCols(3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const extended = [...items.slice(-cols), ...items, ...items.slice(0, cols)];
  const cardWidth = 100 / cols;

  const goNext = () => {
    if (animating) return;
    setAnimating(true);
    setIndex((i) => i + 1);
  };

  const goPrev = () => {
    if (animating) return;
    setAnimating(true);
    setIndex((i) => i - 1);
  };

  const handleTransitionEnd = () => {
    setAnimating(false);
    if (index >= n + cols) setIndex(cols);
    else if (index < cols) setIndex(n + cols - 1);
  };

  const translatePercent = -index * cardWidth;

  /** Mobile swipe */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleTouchStart = (e: TouchEvent) => {
      startXRef.current = e.touches[0].clientX;
      deltaXRef.current = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (startXRef.current !== null) {
        deltaXRef.current = e.touches[0].clientX - startXRef.current;
      }
    };

    const handleTouchEnd = () => {
      if (Math.abs(deltaXRef.current) > 50) {
        deltaXRef.current < 0 ? goNext() : goPrev();
      }
      startXRef.current = null;
      deltaXRef.current = 0;
    };

    track.addEventListener("touchstart", handleTouchStart, { passive: true });
    track.addEventListener("touchmove", handleTouchMove, { passive: true });
    track.addEventListener("touchend", handleTouchEnd);

    return () => {
      track.removeEventListener("touchstart", handleTouchStart);
      track.removeEventListener("touchmove", handleTouchMove);
      track.removeEventListener("touchend", handleTouchEnd);
    };
  }, [cols, index, animating]);

  /** Render stars */
  const renderStars = (rating = 0) => (
    <div className="stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <SvgIcon
          key={i}
          name="star"
          size={18}
          color="#facc15"
          className={i < rating ? "star-filled" : "star-outline"}
        />
      ))}
    </div>
  );

  /** Trim words */
  function truncateWords(text: string = "", limit = 15) {
    const words = text.split(" ");
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(" ") + "...";
  }

  return (
    <section id="testimonials" className="section testimonials">
      <div className={`site-container-testimonials ${variant === "plain" ? "no-container-border" : ""}`}>
        {title && <h2 className="testimonials-heading">{title}</h2>}
        {subtitle && <p className="testimonials-sub">{subtitle}</p>}

        <div className="carousel-wrapper">
          <div className="carousel-viewport">
            <div
              ref={trackRef}
              className={`carousel-track ${animating ? "animating" : "no-anim"}`}
              style={{ transform: `translateX(${translatePercent}%)` }}
              onTransitionEnd={handleTransitionEnd}
            >
              {extended.map((t, i) => {
                const date =
                  t.date && !isNaN(new Date(t.date).getTime())
                    ? new Date(t.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        timeZone: "UTC",
                      })
                    : "";

                const fullText = t.text ?? "";
                const isLong = fullText.split(" ").length > 15;
                const textToShow = expanded
                  ? fullText
                  : truncateWords(fullText, 15);

                return (
                  <div className="carousel-slide" key={i}>
                    <div
                      className={`testimonial-card fade-up ${
                        variant === "plain" ? "no-border" : ""
                      }`}
                    >
                      <div className="top-row stars-date-row">
                        {renderStars(t.rating)}
                        {date && <div className="t-date">{date}</div>}
                      </div>

                      <div className="testimonial-text">
                        {textToShow}

                        {isLong && (
                          <button
                            className="read-more-btn"
                            onClick={() => setExpanded((x) => !x)}
                          >
                            {expanded ? "Read less" : "Read more"}
                          </button>
                        )}
                      </div>

                      <div className="testimonial-footer">
                        <div className="footer-right">
                          {t.name && <span className="t-name">{t.name}</span>}
                          {t.verified && (
                            <span className="verified-pill below">
                              <SvgIcon name="verified-check" size={14} color="#fff" />
                              <span>Verified</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="owl-nav">
            <button className="owl-prev" onClick={goPrev} aria-label="Previous testimonial">
              <SvgIcon name="chevron-left" size={28} color="#d6d6ddff" />
            </button>
            <button className="owl-next" onClick={goNext} aria-label="Next testimonial">
              <SvgIcon name="chevron-right" size={28} color="#d6d6ddff" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
