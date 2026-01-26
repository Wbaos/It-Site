"use client";

import Link from "next/link";
import { useState, useRef } from "react";

export default function ServiceGroupList({
  title,
  items,
  onSelect,
}: {
  title: string;
  items: any[];
  onSelect?: (service?: any) => void;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [boxPos, setBoxPos] = useState<{top: number, left: number} | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (idx: number, e: React.MouseEvent) => {
    setHoveredIdx(idx);
    const card = e.currentTarget as HTMLElement;
    const parent = containerRef.current;
    if (parent) {
      const parentRect = parent.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      setBoxPos({
        top: cardRect.top - parentRect.top,
        left: cardRect.right - parentRect.left + 12,
      });
    } else {
      setBoxPos(null);
    }
  };
  const handleMouseLeave = () => {
    setHoveredIdx(null);
    setBoxPos(null);
  };

  return (
    <>
      <div className="svc-list submenu-left-column" ref={containerRef} style={{position: 'relative'}}>
        {items.map((s, i) => {
          const subs = s.subservices ?? [];
          const hasSubs = subs.length > 0;
          const key = typeof s.slug === "object" ? s.slug.current : s.slug || i;
          return (
            <Link
              key={key}
              href="#"
              className={`svc-card ${s.popular ? "popular-service" : ""}`}
              onClick={(e) => {
                const isMobile = window.innerWidth < 900;
                const subs = s.subservices ?? [];
                const hasSubs = subs.length > 0;

                e.preventDefault();

                if (isMobile && hasSubs) {
                  onSelect?.(s);
                  return;
                }

                if (isMobile && !hasSubs) {
                  onSelect?.(s);
                  return;
                }

                if (!isMobile && hasSubs) {
                  onSelect?.(s);
                  return;
                }

                if (!isMobile && !hasSubs) {
                  window.location.href = `/services/${s.slug}`;
                  return;
                }
              }}
              onMouseEnter={s.description ? (e) => handleMouseEnter(i, e) : undefined}
              onMouseLeave={s.description ? handleMouseLeave : undefined}
            >
              <div className="svc-left">
                <div className="svc-check">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      d="M20 6 9 17l-5-5"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="svc-mid">
                <span className="svc-title">
                  {s.title}
                  {hasSubs && (
                    <span className="srv-count">
                      ({subs.length})
                    </span>
                  )}
                </span>

                {s.showPrice && (
                  <span className="svc-price">
                    ${s.price}
                    {title === "Support"}
                  </span>
                )}
              </div>

              <div className="svc-right">
                {s.popular && <span className="svc-badge">Popular</span>}
              </div>
            </Link>
          );
        })}
        {hoveredIdx !== null && items[hoveredIdx]?.description && boxPos && (
          <div
            className="floating-description-box custom-floating-desc"
            style={{
              position: "absolute",
              top: boxPos.top,
              left: boxPos.left,
              opacity: hoveredIdx !== null ? 1 : 0,
            }}
          >
            <span className="floating-desc-arrow" />
            <strong className="floating-desc-title">
              {items[hoveredIdx].title}
            </strong>
            <span className="floating-desc-text">
              {items[hoveredIdx].description}
            </span>
          </div>
        )}
      </div>
    </>
  );
}
