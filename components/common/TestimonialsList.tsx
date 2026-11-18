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

  // The visible row is uniform: every card on screen gets the height of
  // the tallest VISIBLE card, so the row looks even — but the name +
  // "Verified" badge stay glued right under the review text (the card
  // is flex-start and the footer has a fixed 12px gap), and any slack
  // ends up below the name at the bottom of the card.
  //
  // Why JS instead of `align-items: stretch` on the track: the track
  // holds every review (plus loop clones), so stretch would size the row
  // to the tallest review overall — even one off screen — and the arrows
  // would sit at that height. Measuring only the visible window keeps
  // the row and the arrows following the cards actually on screen.
  //
  // A card's natural height is measured from its footer (the last thing
  // in the flow): footer bottom − card top + bottom padding/border.
  // That stays true even after a min-height is applied, so re-measuring
  // after an expand/collapse always sees the real content height.
  // (box-sizing is border-box site-wide, so the min-height below takes
  // the border-box height measured here.)
  const [viewportHeight, setViewportHeight] = useState<number | undefined>(
    undefined,
  );
  const measureViewportHeight = useCallback(() => {
    const count = canSlide ? cols : n;
    const start = canSlide ? index : 0;
    let max = 0;
    const seen: HTMLElement[] = [];
    for (let k = start; k < start + count; k++) {
      const slide = slideRefs.current[k];
      if (!slide) continue;
      seen.push(slide);
      const card = slide.querySelector<HTMLElement>(".testimonial-card");
      const footer = card?.querySelector<HTMLElement>(".testimonial-footer");
      let natural = 0;
      if (card && footer) {
        const cardRect = card.getBoundingClientRect();
        const footerRect = footer.getBoundingClientRect();
        const cardStyle = window.getComputedStyle(card);
        natural =
          footerRect.bottom -
          cardRect.top +
          (parseFloat(cardStyle.paddingBottom) || 0) +
          (parseFloat(cardStyle.borderBottomWidth) || 0);
      } else {
        natural = slide.offsetHeight;
      }
      max = Math.max(max, natural);
    }
    if (max <= 0) return;
    // Uniform row: every card on screen gets the tallest visible height.
    for (const slide of seen) {
      const card = slide.querySelector<HTMLElement>(".testimonial-card");
      if (card) card.style.minHeight = `${max}px`;
    }
    // Off-screen cards go back to their natural height, so they are
    // measured correctly when they slide into view.
    slideRefs.current.forEach((slide, i) => {
      if (!slide || (i >= start && i < start + count)) return;
      const card = slide.querySelector<HTMLElement>(".testimonial-card");
      if (card) card.style.minHeight = "";
    });
    if (!canSlide) return;
    // offsetHeight excludes the slide's vertical margins, but the
    // track's height includes them — count them or the card bottom
    // gets clipped by the margin.
    let marginY = 0;
    const first = seen[0];
    if (first) {
      const s = window.getComputedStyle(first);
      marginY = parseFloat(s.marginTop) + parseFloat(s.marginBottom);
    }
    const next = max + marginY;
    setViewportHeight((prev) => (prev === next ? prev : next));
  }, [canSlide, cols, index, n]);

  // Re-measure whenever what is visible (or how tall it is) changes:
  // slide change, column count, expand/collapse, and the post-mount
  // shuffle that picks which reviews are on screen.
  useLayoutEffect(() => {
    measureViewportHeight();
  }, [measureViewportHeight, expandedSet, ordered]);

  // Re-measure when any slide's height changes for another reason
  // (webfont swap, text reflow) — the track's size changes with it.
  // The visible slides are observed directly too, so an expand/collapse
  // re-measures even if the state update and the layout effect race:
  // any real height change on screen re-measures, and the footer-based
  // measurement is unaffected by the min-height itself, so there is no
  // feedback loop.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => measureViewportHeight());
    ro.observe(track);
    const count = canSlide ? cols : n;
    const start = canSlide ? index : 0;
    for (let k = start; k < start + count; k++) {
      const el = slideRefs.current[k];
      if (el) ro.observe(el);
    }
    if (document.fonts) {
      document.fonts.ready
        .then(() => measureViewportHeight())
        .catch(() => {});
    }
    return () => ro.disconnect();
  }, [measureViewportHeight, canSlide, cols, index, n]);

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
