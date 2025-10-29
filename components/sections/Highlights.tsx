"use client";
import { useState, useEffect } from "react";
import { sanity } from "@/lib/sanity";

export default function Highlights() {
  const [highlights, setHighlights] = useState<any[]>([]);
  const [isSmall, setIsSmall] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const onResize = () => setIsSmall(window.innerWidth <= 760);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Fetch from Sanity
  useEffect(() => {
    (async () => {
      const data = await sanity.fetch(`
        *[_type == "highlight"] | order(order asc) {
          _id,
          icon,
          title,
          desc
        }
      `);
      setHighlights(data);
    })();
  }, []);

  // Auto carousel
  useEffect(() => {
    if (!isSmall || highlights.length === 0) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % highlights.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isSmall, highlights]);

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
                <span className="highlight-icon">{h.icon}</span>
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
