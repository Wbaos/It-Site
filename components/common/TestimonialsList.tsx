"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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
  subtitle,
  afterSubtitle,
  variant = "card", // NEW default
  locale = "en",
}: Props) {
  const isSpanish = locale === "es";
  // Default subtitle follows the page locale (audit fix 2026-11-10):
  // Spanish service pages showed the English default. An explicit
  // subtitle from the caller always wins (GoogleReviewsCTA passes its own).
  const effectiveSubtitle =
    subtitle ??
    (isSpanish
      ? "Experiencias reales de propietarios y negocios satisfechos."
      : "Real experiences from satisfied homeowners and businesses.");
  // Review order is randomized once on mount, client-side only: the
  // server renders the Sanity order and the first client render matches
  // it (no hydration mismatch); after mount a Fisher-Yates shuffle
  // reorders the list, so the first visible reviews differ on every
  // page load instead of always showing the same ones.
  const [ordered, setOrdered] = useState<Testimonial[]>(items);
  useEffect(() => {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setOrdered(shuffled);
    // Run once on mount; `items` is static per page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const n = ordered.length;
  const [cols, setCols] = useState(3);
  // With fewer reviews than visible columns, the infinite-loop padding
  // cannot fill the window when advancing, leaving an empty slot.
  // In that case show the reviews statically instead of sliding.
  const canSlide = n > cols;
  const [index, setIndex] = useState(cols);
  const [animating, setAnimating] = useState(false);

  // Expanded state is per review (keyed by the review's index in `items`),
  // so tapping "Read more" on one card grows only that card. A single
  // shared boolean expanded every card's text at once.
  const [expandedSet, setExpandedSet] = useState<ReadonlySet<number>>(new Set());
  const toggleExpanded = (origIndex: number) =>
    setExpandedSet((prev) => {
      const next = new Set(prev);
      if (next.has(origIndex)) next.delete(origIndex);
      else next.add(origIndex);
      return next;
    });

  const trackRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number | null>(null);
  const deltaXRef = useRef<number>(0);
  // One ref per rendered slide (position in `visible`), to measure the
  // visible window's height.
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // The viewport's height follows the tallest VISIBLE slide — not the
  // tallest slide in the whole track. The track holds every review (plus
  // loop clones), so its natural height is the tallest review overall;
  // with no explicit viewport height the prev/next arrows below it sat
  // at that height even when the card on screen was short. Measuring the
  // visible window keeps the arrows right under the card being viewed:
  // expanding a review pushes them down, collapsing pulls them back up.
  const [viewportHeight, setViewportHeight] = useState<number | undefined>(
    undefined,
  );
  const measureViewportHeight = useCallback(() => {
    if (!canSlide) return;
    let max = 0;
    for (let k = index; k < index + cols; k++) {
      const el = slideRefs.current[k];
      if (!el) continue;
      // offsetHeight excludes the slide's vertical margins, but the
      // track's height includes them — count them or the card bottom
      // gets clipped by the margin.
      const style = window.getComputedStyle(el);
      const marginY =
        parseFloat(style.marginTop) + parseFloat(style.marginBottom);
      max = Math.max(max, el.offsetHeight + marginY);
    }
    if (max > 0) setViewportHeight((prev) => (prev === max ? prev : max));
  }, [canSlide, cols, index]);

  // Re-measure whenever what is visible (or how tall it is) changes:
  // slide change, column count, expand/collapse, and the post-mount
  // shuffle that picks which reviews are on screen.
  useLayoutEffect(() => {
    measureViewportHeight();
  }, [measureViewportHeight, expandedSet, ordered]);

  // Re-measure when any slide's height changes for another reason
  // (webfont swap, text reflow) — the track's size changes with it.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => measureViewportHeight());
    ro.observe(track);
    if (document.fonts) {
      document.fonts.ready
        .then(() => measureViewportHeight())
        .catch(() => {});
    }
    return () => ro.disconnect();
  }, [measureViewportHeight]);

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

  const extended = [...ordered.slice(-cols), ...ordered, ...ordered.slice(0, cols)];
  const visible = canSlide ? extended : ordered;
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
          color="#d4af37"
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
        {effectiveSubtitle && <p className="testimonials-sub">{effectiveSubtitle}</p>}
        {afterSubtitle}

        <div className="carousel-wrapper">
          <div
            className="carousel-viewport"
            style={
              canSlide
                ? {
                    height: viewportHeight,
                    // Animate the height so the prev/next arrows glide
                    // down/up with the active card instead of jumping.
                    transition: "height 0.4s ease",
                  }
                : undefined
            }
          >
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
                // `visible` is the items array itself when the carousel
                // cannot slide, otherwise it is the loop-padded `extended`
                // array with clones at both ends. Map the rendered position
                // back to the review's index in `items` so the expanded
                // state follows the review, not the rendered clone.
                const origIndex = !canSlide
                  ? i
                  : i < cols
                    ? n - cols + i
                    : i < cols + n
                      ? i - cols
                      : i - (cols + n);
                const isExpanded = expandedSet.has(origIndex);
                const textToShow = isExpanded
                  ? fullText
                  : truncateWords(fullText, 15);

                return (
                  <div
                    className="carousel-slide"
                    ref={(el) => {
                      slideRefs.current[i] = el;
                    }}
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
                            onClick={() => toggleExpanded(origIndex)}
                          >
                            {isExpanded ? (isSpanish ? "Leer menos" : "Read less") : (isSpanish ? "Leer más" : "Read more")}
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
                <SvgIcon name="chevron-left" size={28} color="#ddd8c8ff" />
              </button>
              <button className="owl-next" onClick={goNext} aria-label={isSpanish ? "Reseña siguiente" : "Next testimonial"}>
                <SvgIcon name="chevron-right" size={28} color="#ddd8c8ff" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
