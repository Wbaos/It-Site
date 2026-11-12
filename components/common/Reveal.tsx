"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Soft scroll reveal for home sections: fades/slides content in the first
// time it enters the viewport. No libraries, no layout shift (only opacity
// + transform change), and it respects prefers-reduced-motion (see
// globals.css). The section starts VISIBLE (SSR + no-JS safe): the hidden
// state is only applied on mount, and only when the section is below the
// viewport, so nothing ever stays hidden if JavaScript never runs.
export default function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return;
    // Already on screen at mount: leave it visible, no flash.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;
    setRevealed(false);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -32px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal${revealed ? " is-visible" : ""}${className ? ` ${className}` : ""}`}
    >
      {children}
    </div>
  );
}
