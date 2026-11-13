"use client";

import { useEffect, useRef, useState } from "react";

import type { HomePage } from "@/lib/sanityHome";
import { HOME_VIDEO_POSTER_URL, HOME_VIDEO_URL } from "@/lib/homeVideo";

export default function HomeVideo({ locale = "en", doc }: { locale?: "en" | "es"; doc?: HomePage | null }) {
  const isSpanish = locale === "es";
  const heading =
    (isSpanish ? doc?.videoHeadingEs : doc?.videoHeading) ??
    (isSpanish ? "Mira tu sistema trabajando" : "See your system at work");
  const subtitle =
    (isSpanish ? doc?.videoSubtitleEs : doc?.videoSubtitle) ??
    (isSpanish
      ? "Sistema de sprinklers optimizado para una cobertura completa y uniforme en Fort Lauderdale."
      : "Optimized sprinkler system for full, even coverage in Fort Lauderdale.");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  // The poster (65 KB) is deferred until the video is about to scroll
  // into view, so it never downloads on the initial page load. Same URL
  // as before — no quality change — it is set 600px before the section
  // enters the viewport, so it is already in place when the visitor
  // reaches it. The VideoObject schema keeps using the constant directly.
  // The video download starts at the same moment (9 Nov 2026): with
  // preload="none" the 5 MB file only started downloading once playback
  // was requested, so on a normal connection it stalled while catching
  // up and looked slow/choppy. Starting it 600px early keeps the
  // no-download-on-initial-load behaviour and lets playback be smooth.
  const [poster, setPoster] = useState<string | undefined>(undefined);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setPoster(HOME_VIDEO_POSTER_URL);
          video.preload = "auto";
          video.load();
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  // Autoplay muted only once the section scrolls into view, so the video
  // never downloads on the initial page load.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          video.muted = true;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const handlePlayClick = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.play().catch(() => {});
  };

  return (
    <section className="section home-video" aria-labelledby="home-video-title">
      <div className="site-container">
        <h2 id="home-video-title" className="home-video-heading">
          {heading}
        </h2>
        <p className="home-video-sub">
          {subtitle}
        </p>
        <div className="home-video-frame">
          <video
            ref={videoRef}
            src={HOME_VIDEO_URL}
            poster={poster}
            muted
            loop
            playsInline
            controls
            preload="none"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          {!isPlaying && (
            <button
              type="button"
              className="home-video-play"
              onClick={handlePlayClick}
              aria-label={isSpanish ? "Reproducir video" : "Play video"}
            >
              <span className="home-video-play-icon" aria-hidden="true">
                ▶
              </span>
              <span className="home-video-play-label">
                {isSpanish ? "Ver video" : "Watch video"}
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
