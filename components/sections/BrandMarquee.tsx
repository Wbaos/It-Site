"use client";

// Brands marquee (18 Nov 2026): an infinite scrolling strip with the
// five brands installed — Irritrol, Pearl, Goulds, Rain Bird, Hunter.
// Text only, no logos, no claims; brand names do not translate, so the
// strip is identical in EN and ES. The track holds the list twice and
// scrolls -50% in a loop. It pauses on hover and while touched, and
// with reduced motion it does not move at all (single static row).
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
        <p className="brand-marquee-label">
          {isSpanish ? "Las marcas que instalamos" : "Brands we install"}
        </p>
        <div
          className={`brand-marquee-viewport${paused ? " is-paused" : ""}`}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
          onTouchCancel={() => setPaused(false)}
        >
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
