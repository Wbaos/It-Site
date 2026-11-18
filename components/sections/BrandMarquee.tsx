"use client";

// Brands marquee (18 Nov 2026): an infinite scrolling strip with the
// five brands installed — Irritrol, Pearl, Goulds, Rain Bird, Hunter.
// Text only, no logos, no claims; brand names do not translate, so the
// strip is identical in EN and ES. The track holds the list twice and
// scrolls -50% in a loop. Touching the banner never pauses it: the only
// way to pause is the pause/play button at the right end of the strip
// (hover pauses on mouse devices only, via CSS). With reduced motion
// it does not move at all (single static row, button hidden via CSS).
import { useState } from "react";

const BRANDS = ["Irritrol", "Pearl", "Goulds", "Rain Bird", "Hunter"];

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
            {[false, true].map((hidden) => (
              <ul
                key={hidden ? "copy" : "main"}
                className="brand-marquee-group"
                aria-hidden={hidden || undefined}
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
