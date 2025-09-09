// components/sections/Testimonials.tsx
"use client";
import { useEffect, useState } from "react";

/*For starts and date */
type Quote = {
  name: string;
  text: string;
  date: string; // ISO or any parseable date string
  rating: number; // 1–5
};

const QUOTES: Quote[] = [
  {
    name: "Ana R.",
    text: "They were patient and explained everything to my mom.",
    date: "2025-05-12",
    rating: 5,
  },
  {
    name: "George T.",
    text: "Set up our Wi-Fi and TV in one visit. Great service!",
    date: "2025-04-29",
    rating: 5,
  },
  {
    name: "María L.",
    text: "Very respectful and helpful. Highly recommended.",
    date: "2025-03-03",
    rating: 5,
  },
  {
    name: "Peter S.",
    text: "Solved our printer and Wi-Fi issues fast.",
    date: "2025-02-17",
    rating: 4,
  },
  {
    name: "Linda K.",
    text: "Kind, on time, and made things easy.",
    date: "2025-01-22",
    rating: 5,
  },
  {
    name: "Ravi G.",
    text: "Explained step by step without rushing.",
    date: "2024-12-14",
    rating: 5,
  },
];

type Mode = "idle" | "next-anim" | "prev-prep" | "prev-anim";

export default function Testimonials() {
  const [start, setStart] = useState(0);
  const [cols, setCols] = useState<0 | 1 | 3>(0); // 0=grid, 1=mobile carousel, 3=desktop carousel
  const [mode, setMode] = useState<Mode>("idle");
  const len = QUOTES.length;

  useEffect(() => {
    const decide = () => {
      const w = window.innerWidth;
      if (w < 500) setCols(1);
      else if (w >= 1000) setCols(3);
      else setCols(0);
    };
    decide();
    window.addEventListener("resize", decide);
    return () => window.removeEventListener("resize", decide);
  }, []);

  const idx = (n: number) => (n + len) % len;

  let frame: number[] = [];
  if (cols === 3) {
    frame =
      mode === "prev-prep" || mode === "prev-anim"
        ? [idx(start - 1), start, idx(start + 1), idx(start + 2)]
        : [start, idx(start + 1), idx(start + 2), idx(start + 3)];
  } else if (cols === 1) {
    frame =
      mode === "prev-prep" || mode === "prev-anim"
        ? [idx(start - 1), start]
        : [start, idx(start + 1)];
  } else {
    frame = QUOTES.map((_, i) => i);
  }

  const onTransitionEnd = () => {
    if (cols === 0) return;
    if (mode === "next-anim") {
      setStart((s) => idx(s + 1));
      setMode("idle");
    } else if (mode === "prev-anim") {
      setStart((s) => idx(s - 1));
      setMode("idle");
    }
  };

  const next = () => {
    if (cols === 0 || mode !== "idle") return;
    setMode("next-anim");
  };
  const prev = () => {
    if (cols === 0 || mode !== "idle") return;
    setMode("prev-prep");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setMode("prev-anim"));
    });
  };

  const trackClass = [
    "t-track",
    cols === 3 ? "cols-3" : cols === 1 ? "cols-1" : "grid-mode",
    mode === "next-anim" ? "animate shift-next" : "",
    mode === "prev-prep" ? "no-anim shift-prev-start" : "",
    mode === "prev-anim" ? "animate shift-prev-end" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section id="testimonials" className="section testimonials">
      <div className="site-container-testimonials">
        <h2 className="testimonials-heading">What Families Say</h2>
        <p className="testimonials-sub">
          Real experiences from seniors and their loved ones.
        </p>

        <div className="testimonials-carousel">
          {(cols === 1 || cols === 3) && (
            <button
              type="button"
              className="t-arrow left"
              aria-label="Previous testimonials"
              onClick={prev}
            >
              ‹
            </button>
          )}

          <div className="t-viewport">
            <div className={trackClass} onTransitionEnd={onTransitionEnd}>
              {frame.map((i) => {
                const q = QUOTES[i];
                const date = new Date(q.date);
                const nice = date.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
                //to display starts and date
                return (
                  <div className="t-slide" key={`${i}-${q.name}`}>
                    <blockquote className="testimonial-card">
                      <div className="t-meta">
                        <div
                          className="stars"
                          aria-label={`${q.rating} out of 5 stars`}
                        >
                          {Array.from({ length: 5 }).map((_, s) => (
                            <span
                              key={s}
                              className={`star ${s < q.rating ? "filled" : ""}`}
                              aria-hidden="true"
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <time className="t-date" dateTime={q.date}>
                          {nice}
                        </time>
                      </div>

                      <p className="testimonial-text">“{q.text}”</p>
                      <footer className="testimonial-author">— {q.name}</footer>
                    </blockquote>
                  </div>
                );
              })}
            </div>
          </div>

          {(cols === 1 || cols === 3) && (
            <button
              type="button"
              className="t-arrow right"
              aria-label="Next testimonials"
              onClick={next}
            >
              ›
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
