"use client";
import { useState, useEffect } from "react";

type Highlight = { icon: string; title: string; desc: string };

const HIGHLIGHTS: Highlight[] = [
  { icon: "⚡", title: "Fast Service", desc: "Same-day availability in most areas." },
  { icon: "🤝", title: "Friendly Experts", desc: "Patient support with clear explanations." },
  { icon: "💳", title: "Fair Pricing", desc: "Only pay when the job is done right." },
];

export default function Highlights() {
  const [isSmall, setIsSmall] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const onResize = () => setIsSmall(window.innerWidth <= 760);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!isSmall) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % HIGHLIGHTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isSmall]);

  return (
    <section id="highlights" className="highlights">
      <div className="site-container">
        <div className={`highlights-grid ${isSmall ? "carousel-mode" : ""}`}>
          {HIGHLIGHTS.map((h, i) => {
            let positionClass = "";
            if (i === index) positionClass = "active";
            else if (i === (index - 1 + HIGHLIGHTS.length) % HIGHLIGHTS.length)
              positionClass = "prev";
            else positionClass = "next";

            return (
              <div key={i} className={`highlight ${positionClass}`}>
                <span className="highlight-icon">{h.icon}</span>
                <div>
                  <h3 className="highlight-title">{h.title}</h3>
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
