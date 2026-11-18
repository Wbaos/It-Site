"use client";

// Brands marquee (18 Nov 2026): an infinite scrolling strip with the
// five brands installed — Irritrol, Pearl, Goulds, Rain Bird, Hunter.
// Text only, no logos, no claims; brand names do not translate, so the
// strip is identical in EN and ES. The track holds the list FOUR times
// and scrolls -25% (exactly one group) per loop: one group (~850px) is
// narrower than the container (~1168px), so with only two copies the
// right side of the strip went empty at the end of each loop. Four
// copies keep (4-1) groups of coverage past the loop point at any
// viewport width. Touching the banner never pauses it: the only way to
// pause is the pause/play button at the right end of the strip (hover
// pauses on mouse devices only, via CSS). With reduced motion it does
// not move at all (single static row, button hidden via CSS).
import { useState } from "react";

const BRANDS = ["Irritrol", "Pearl", "Goulds", "Rain Bird", "Hunter"];

// Four copies of the brand list: the seam stays invisible only while
// the track extends past the viewport by at least one full group.
const COPIES = 4;

export default function BrandMarquee({ locale = "en" }: { locale?: "en" | "es" }) {
  const isSpanish = locale === "es";
  const [paused, setPaused] = useState(false);
  return (
    <section
      className="section brand-marquee"
      aria-label={isSpanish ? "Las marcas que instalamos" : "Brands we install"}
    >
      <div className="site-container">
        <div className="brand-marquee-head">
          <span aria-hidden="true" />
          <p className="brand-marquee-label">
            {isSpanish ? "Las marcas que instalamos" : "Brands we install"}
          </p>
          <button
            type="button"
            className="brand-marquee-toggle"
            aria-pressed={paused}
            aria-label={
              paused
                ? isSpanish
                  ? "Reproducir marcas"
                  : "Play brands"
                : isSpanish
                  ? "Pausar marcas"
                  : "Pause brands"
            }
            onClick={() => setPaused((v) => !v)}
          >
            {paused ? (
              <svg width="11" height="13" viewBox="0 0 12 14" aria-hidden="true" fill="currentColor">
                <path d="M0 0 L12 7 L0 14 Z" />
              </svg>
            ) : (
              <svg width="11" height="13" viewBox="0 0 12 14" aria-hidden="true" fill="currentColor">
                <rect x="0" y="0" width="4" height="14" rx="1" />
                <rect x="8" y="0" width="4" height="14" rx="1" />
              </svg>
            )}
          </button>
        </div>
        <div className={`brand-marquee-viewport${paused ? " is-paused" : ""}`}>
          <div className="brand-marquee-track">
            {Array.from({ length: COPIES }).map((_, copy) => (
              <ul
                key={copy}
                className="brand-marquee-group"
                aria-hidden={copy > 0 || undefined}
              >
                {BRANDS.map((brand) => (
                  <li key={brand} className="brand-marquee-item">
                    <span>{brand}</span>
                    <span className="brand-marquee-sep" aria-hidden="true">
                      ✦
                    </span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
