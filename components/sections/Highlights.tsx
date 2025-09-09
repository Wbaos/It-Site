"use client";
import { useState, useEffect } from "react";

type Highlight = { icon: string; title: string; desc: string };

const HIGHLIGHTS: Highlight[] = [
  {
    icon: "⚡",
    title: "Fast Service",
    desc: "Same-day availability in most areas.",
  },
  {
    icon: "🤝",
    title: "Friendly Experts",
    desc: "Patient support with clear explanations.",
  },
  {
    icon: "💳",
    title: "Fair Pricing",
    desc: "Only pay when the job is done right.",
  },
];

export default function Highlights() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsSmallScreen(window.innerWidth < 500);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const visibleHighlight = isSmallScreen ? [HIGHLIGHTS[0]] : HIGHLIGHTS;
  return (
    <section id="highlights" className="highlights">
      <div className="site-container">
        <div className="highlights-grid">
          {visibleHighlight.map((h, i) => (
            <div key={i} className="highlight">
              <span className="highlight-icon">{h.icon}</span>
              <div>
                <h3 className="highlight-title">{h.title}</h3>
                <p className="highlight-desc">{h.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
