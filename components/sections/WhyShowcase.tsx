"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldCheck, Users, Clock, Smile } from "lucide-react";
import SpriteIcon from "@/components/common/SpriteIcon";

// Dynamic showcase for the five Why Choose Us reasons: one featured
// reason at a time, smooth fade/slide, auto-advance every ~4.5s,
// navigation dots, pause on interaction, and animated counters where
// the text carries numbers (1500+, 5.0, 29). Same five reasons, same
// icons, same order, same text — only the presentation moves.
// Respects prefers-reduced-motion: no auto-advance, no transitions,
// counters render their final values immediately.
export type WhyFeature = {
  iconIndex: number;
  title: string;
  text: string;
};

function StarIcon({ size = 24, strokeWidth = 2 }: { size?: number; strokeWidth?: number }) {
  return <SpriteIcon name="star-lucide" size={size} strokeWidth={strokeWidth} />;
}

const WHY_ICONS = [ShieldCheck, StarIcon, Users, Smile, Clock];

// A number inside a reason's title/text, counted up from 0 when its
// slide becomes active. Trivial values (a lone "1") stay static.
function AnimatedNumber({
  value,
  decimals,
  suffix,
  active,
  reducedMotion,
}: {
  value: number;
  decimals: number;
  suffix: string;
  active: boolean;
  reducedMotion: boolean;
}) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (reducedMotion || !active) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const duration = 1200;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, value, reducedMotion]);

  const formatted =
    decimals > 0 ? display.toFixed(decimals) : String(Math.round(display));
  return (
    <span className="why-showcase-count">
      {formatted}
      {suffix}
    </span>
  );
}

// Renders text with its numbers as animated counters (only while the
// slide is active). Non-numeric parts pass through untouched, so the
// wording never changes — "1500+ Customers Helped" stays exactly that.
function AnimatedText({
  text,
  active,
  reducedMotion,
}: {
  text: string;
  active: boolean;
  reducedMotion: boolean;
}) {
  const parts = text.split(/(\d[\d,]*\.?\d*\+?)/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^(\d[\d,]*)(\.\d+)?(\+)?$/);
        if (!m) return <span key={i}>{part}</span>;
        const value = parseFloat(m[1].replace(/,/g, "") + (m[2] ?? ""));
        const decimals = m[2] ? m[2].length - 1 : 0;
        if (value < 2 && !m[2] && !m[3]) return <span key={i}>{part}</span>;
        return (
          <AnimatedNumber
            key={i}
            value={value}
            decimals={decimals}
            suffix={m[3] ?? ""}
            active={active}
            reducedMotion={reducedMotion}
          />
        );
      })}
    </>
  );
}

export default function WhyShowcase({
  features,
  isSpanish = false,
}: {
  features: WhyFeature[];
  isSpanish?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [manualPause, setManualPause] = useState(false);
  const [inView, setInView] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setInView(true);
        else setInView(false);
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, []);

  const paused =
    reducedMotion || hovered || focused || manualPause || !inView;

  useEffect(() => {
    if (paused || features.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % features.length);
    }, 4500);
    return () => clearInterval(id);
  }, [paused, features.length]);

  const goTo = (i: number) => {
    setIndex(i);
    // Tapping a dot pauses the auto-advance; it resumes after 12s
    // without interaction (or as soon as the pointer leaves).
    setManualPause(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setManualPause(false), 12000);
  };

  return (
    <div
      ref={rootRef}
      className="why-showcase"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setManualPause(false);
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <div className="why-showcase-slides">
        {features.map((f, i) => {
          const Icon = WHY_ICONS[f.iconIndex] ?? WHY_ICONS[0];
          const active = i === index;
          return (
            <article
              key={i}
              className={`why-showcase-slide${active ? " active" : ""}`}
              aria-hidden={!active}
            >
              <div className="why-showcase-top">
                <span className="why-showcase-num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="why-showcase-icon">
                  <Icon size={28} strokeWidth={1.5} />
                </span>
              </div>
              <h3 className="why-showcase-title">
                <AnimatedText text={f.title} active={active && inView} reducedMotion={reducedMotion} />
              </h3>
              <p className="why-showcase-desc">
                <AnimatedText text={f.text} active={active && inView} reducedMotion={reducedMotion} />
              </p>
            </article>
          );
        })}
      </div>

      <div className="why-showcase-dots" role="group" aria-label={isSpanish ? "Razones" : "Reasons"}>
        {features.map((f, i) => (
          <button
            key={i}
            type="button"
            className={`why-showcase-dot${i === index ? " active" : ""}`}
            aria-label={
              isSpanish ? `Ver: ${f.title}` : `Show: ${f.title}`
            }
            aria-current={i === index}
            onClick={() => goTo(i)}
          >
            <span aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}
