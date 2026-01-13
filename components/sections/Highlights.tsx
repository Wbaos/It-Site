"use client";
import { useState, useEffect } from "react";

type Highlight = {
  _id: string;
  title: string;
  desc: string;
  color: string;
  icon: string;
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

  const normalizeHex = (hex: string = "#000000") => {
    let c = hex.trim();
    if (!c.startsWith("#")) c = "#" + c;
    if (c.length === 4) {
      c = "#" + c[1] + c[1] + c[2] + c[2] + c[3] + c[3];
    }
    return c;
  };

  return (
    <section id="highlights" className="highlights">
      <div className="site-container">
        <div className={`highlights-grid ${isSmall ? "carousel-mode" : ""}`}>
          {highlights.map((h, i) => {
            const iconColor = normalizeHex(h.color);
            const shadowColor = iconColor + "40";
            const shadowHoverColor = iconColor + "70";

            let positionClass = "";
            if (i === index) positionClass = "active";
            else if (i === (index - 1 + highlights.length) % highlights.length)
              positionClass = "prev";
            else positionClass = "next";

            return (
              <div key={h._id} className={`highlight ${positionClass}`}>
                <div
                  className="highlight-icon"
                  style={
                    {
                      "--iconColor": iconColor,
                      "--shadowColor": shadowColor,
                      "--shadowHoverColor": shadowHoverColor,
                    } as React.CSSProperties
                  }
                >
                  <img
                    src={h.icon}
                    alt={h.title}
                    className="highlight-svg"
                    loading="lazy"
                  />
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
