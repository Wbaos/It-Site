"use client";
import { useState, useEffect } from "react";

type Highlight = {
  _id: string;
  title: string;
  desc: string;
  color: string;
  icon: string;
};

// The three highlight icons live in Sanity as SVGs, but each file is a
// solid colored rounded square (yellow / blue / green) with a white
// stroked glyph on top — so the <img> always showed the Sanity color,
// breaking the one-deep-green-accent rule. The glyph paths below are copied
// verbatim from those SVG files (background rect dropped); they render
// in deep green on the pale-green tile. Keyed by the stable Sanity document
// id; any highlight not in the map keeps the original <img> fallback.
const HIGHLIGHT_GLYPHS: Record<string, React.ReactNode> = {
  // Fast Service — lightning
  "9346bf78-b1c7-49cb-b836-950cc788b0b8": (
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
  ),
  // Friendly Experts — badge
  "d310d2cf-15d3-4e4d-ba4f-165f12b5dc8c": (
    <>
      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
      <circle cx="12" cy="8" r="6" />
    </>
  ),
  // Clear Estimates — wallet
  "f692c871-b58e-4b9f-acd2-a24b16a126c0": (
    <>
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </>
  ),
};

export default function HighlightsClient({
  highlights,
}: {
  highlights: Highlight[];
}) {
  const [isSmall, setIsSmall] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const onResize = () => setIsSmall(window.innerWidth <= 760);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!isSmall || highlights.length === 0) return;

    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % highlights.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isSmall, highlights.length]);

  return (
    <section id="highlights" className="highlights">
      <div className="site-container">
        <div className={`highlights-grid ${isSmall ? "carousel-mode" : ""}`}>
          {highlights.map((h, i) => {
            let positionClass = "";
            if (i === index) positionClass = "active";
            else if (i === (index - 1 + highlights.length) % highlights.length)
              positionClass = "prev";
            else positionClass = "next";

            return (
              <div key={h._id} className={`highlight ${positionClass}`}>
                <div className="highlight-icon">
                  {HIGHLIGHT_GLYPHS[h._id] ? (
                    <svg
                      viewBox="0 0 24 24"
                      width={28}
                      height={28}
                      fill="none"
                      stroke="#14532D"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="highlight-svg"
                      aria-hidden="true"
                    >
                      {HIGHLIGHT_GLYPHS[h._id]}
                    </svg>
                  ) : (
                    <img
                      src={h.icon}
                      alt={h.title}
                      className="highlight-svg"
                      width={48}
                      height={48}
                      loading="lazy"
                    />
                  )}
                </div>

                <div>
                  <h2 className="highlight-title">{h.title}</h2>
                  <p className="highlight-desc">{h.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
