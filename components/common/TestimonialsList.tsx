"use client";
import { useState, useEffect } from "react";

export type Testimonial = {
  name?: string;
  author?: string;
  text?: string;
  quote?: string;
  date?: string;
  rating?: number;
};

type Props = {
  items?: Testimonial[];
  title?: string;
  subtitle?: string;
  carousel?: boolean;
};

export default function TestimonialsList({
  items = [],
  title = "What Our Clients Say",
  subtitle,
  carousel = false,
}: Props) {
  if (!items.length) return null;

  const [start, setStart] = useState(0);
  const [cols, setCols] = useState<0 | 1 | 2 | 3>(0);
  const [mode, setMode] = useState<
    "idle" | "next-anim" | "prev-prep" | "prev-anim"
  >("idle");

  useEffect(() => {
    if (!carousel) return;
    const decide = () => {
      const w = window.innerWidth;
      if (w < 760) setCols(1);
      else if (w >= 760 && w < 1300) setCols(2);
      else setCols(3);
    };
    decide();
    window.addEventListener("resize", decide);
    return () => window.removeEventListener("resize", decide);
  }, [carousel]);

  const idx = (n: number) => (n + items.length) % items.length;

  let frame: number[] = [];
  if (carousel && cols > 0) {
    if (mode === "prev-prep" || mode === "prev-anim") {
      frame = Array.from({ length: cols + 1 }, (_, i) => idx(start - 1 + i));
    } else {
      frame = Array.from({ length: cols + 1 }, (_, i) => idx(start + i));
    }
  } else {
    frame = items.map((_, i) => i);
  }

  const onTransitionEnd = () => {
    if (!carousel || cols === 0) return;
    if (mode === "next-anim") {
      setStart((s) => idx(s + 1));
      setMode("idle");
    } else if (mode === "prev-anim") {
      setStart((s) => idx(s - 1));
      setMode("idle");
    }
  };

  const next = () => {
    if (!carousel || cols === 0 || mode !== "idle") return;
    setMode("next-anim");
  };
  const prev = () => {
    if (!carousel || cols === 0 || mode !== "idle") return;
    setMode("prev-prep");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setMode("prev-anim"));
    });
  };

  const trackClass = [
    "t-track",
    carousel
      ? cols === 3
        ? "cols-3"
        : cols === 2
          ? "cols-2"
          : cols === 1
            ? "cols-1"
            : "grid-mode"
      : "grid-mode",
    mode === "next-anim" ? "animate shift-next" : "",
    mode === "prev-prep" ? "no-anim shift-prev-start" : "",
    mode === "prev-anim" ? "animate shift-prev-end" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className="section testimonials">
      <div className="site-container-testimonials">
        {title && <h2 className="testimonials-heading">{title}</h2>}
        {subtitle && <p className="testimonials-sub">{subtitle}</p>}

        <div className="testimonials-carousel">
          {carousel && cols > 0 && (
            <button type="button" className="t-arrow left" onClick={prev}>
              ‹
            </button>
          )}

          <div className="t-viewport">
            <div className={trackClass} onTransitionEnd={onTransitionEnd}>
              {frame.map((i, pos) => {
                const t = items[i];
                const date =
                  t.date && !isNaN(new Date(t.date).getTime())
                    ? new Date(t.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                    : "";

                return (
                  <div
                    className="t-slide"
                    key={`${i}-${pos}-${t.name || t.author || pos}`}
                  >
                    <blockquote className="testimonial-card">
                      <div className="t-meta">
                        <div className="stars">
                          {Array.from({ length: 5 }).map((_, s) => (
                            <span
                              key={s}
                              className={`star ${s < (t.rating ?? 5) ? "filled" : ""
                                }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        {date && <time className="t-date">{date}</time>}
                      </div>

                      <p className="testimonial-text">
                        “{t.text || t.quote}”
                      </p>
                      <footer className="testimonial-author">
                        — {t.name || t.author || "Anonymous"}
                      </footer>
                    </blockquote>
                  </div>
                );
              })}
            </div>
          </div>

          {carousel && cols > 0 && (
            <button type="button" className="t-arrow right" onClick={next}>
              ›
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
