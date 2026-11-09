"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import SvgIcon from "./SvgIcons";

export type Testimonial = {
  name?: string;
  text?: string;
  rating?: number;
  verified?: boolean;
  date?: string;
};

// Relative review dates arrive as English strings ("a week ago",
// "10 weeks ago") from lib/google-reviews. On Spanish pages they read
// in Spanish instead — a direct translation of the same relative span,
// never a new date. Unknown strings pass through unchanged.
export function localizeRelativeReviewDate(
  date: string,
  locale: "en" | "es",
): string {
  if (locale !== "es") return date;
  const lower = date.trim().toLowerCase();
  if (lower === "today") return "hoy";
  const match =
    lower.match(/^a (day|week|month|year) ago$/) ||
    lower.match(/^(\d+) (days|weeks|months|years) ago$/);
  if (!match) return date;
  const singular: Record<string, string> = {
    day: "día",
    week: "semana",
    month: "mes",
    year: "año",
  };
  const plural: Record<string, string> = {
    days: "días",
    weeks: "semanas",
    months: "meses",
    years: "años",
  };
  if (match[2]) {
    const n = Number(match[1]);
    return `hace ${n} ${plural[match[2]] ?? match[2]}`;
  }
  return `hace 1 ${singular[match[1]] ?? match[1]}`;
}

type Props = {
  items: Testimonial[];
  title?: string;
  subtitle?: string;
  afterSubtitle?: ReactNode;
  carousel?: boolean;
  variant?: "card" | "plain";
  locale?: "en" | "es";
};

export default function TestimonialsList({
  items,
  title = "What Clients Say",
  subtitle = "Real experiences from satisfied homeowners and businesses.",
  afterSubtitle,
  variant = "card", // NEW default
  locale = "en",
}: Props) {
  const isSpanish = locale === "es";
  const n = items.length;
  const [cols, setCols] = useState(3);
  // With fewer reviews than visible columns, the infinite-loop padding
  // cannot fill the window when advancing, leaving an empty slot.
  // In that case show the reviews statically instead of sliding.
  const canSlide = n > cols;
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
  const visible = canSlide ? extended : items;
  const cardWidth = 100 / cols;

  const goNext = () => {
    if (animating || !canSlide) return;
    setAnimating(true);
    setIndex((i) => i + 1);
  };

  const goPrev = () => {
    if (animating || !canSlide) return;
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
        {afterSubtitle}

        <div className="carousel-wrapper">
          <div className="carousel-viewport">
            <div
              ref={trackRef}
              className={`carousel-track ${canSlide && animating ? "animating" : "no-anim"}`}
              style={{
                transform: canSlide
                  ? `translateX(${translatePercent}%)`
                  : undefined,
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {visible.map((t, i) => {
                // Dates arrive two ways: calendar dates (ISO, e.g. Sanity
                // reviews) render in the page locale, and relative
                // strings ("a week ago", "10 weeks ago") from the Google
                // reviews API are translated to Spanish on ES pages.
                // Nothing is ever invented: an unparsable, unknown string
                // shows as-is.
                const parsedDate = t.date ? new Date(t.date) : null;
                const date =
                  parsedDate && !isNaN(parsedDate.getTime())
                    ? parsedDate.toLocaleDateString(isSpanish ? "es-ES" : "en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        timeZone: "UTC",
                      })
                    : localizeRelativeReviewDate(t.date ?? "", locale);

                const fullText = t.text ?? "";
                const isLong = fullText.split(" ").length > 15;
                const textToShow = expanded
                  ? fullText
                  : truncateWords(fullText, 15);

                return (
                  <div
                    className="carousel-slide"
                    style={canSlide ? undefined : { flex: "1 1 0" }}
                    key={i}
                  >
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
                            {expanded ? (isSpanish ? "Leer menos" : "Read less") : (isSpanish ? "Leer más" : "Read more")}
                          </button>
                        )}
                      </div>

                      <div className="testimonial-footer">
                        <div className="footer-right">
                          {t.name && <span className="t-name">{t.name}</span>}
                          {t.verified && (
                            <span className="verified-pill below">
                              <SvgIcon name="verified-check" size={14} color="#fff" />
                              <span>{isSpanish ? "Verificado" : "Verified"}</span>
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

          {canSlide && (
            <div className="owl-nav">
              <button className="owl-prev" onClick={goPrev} aria-label={isSpanish ? "Reseña anterior" : "Previous testimonial"}>
                <SvgIcon name="chevron-left" size={28} color="#6B7280" />
              </button>
              <button className="owl-next" onClick={goNext} aria-label={isSpanish ? "Reseña siguiente" : "Next testimonial"}>
                <SvgIcon name="chevron-right" size={28} color="#6B7280" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
