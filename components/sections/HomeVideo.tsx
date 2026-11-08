"use client";

import { useEffect, useRef, useState } from "react";

import type { HomePage } from "@/lib/sanityHome";

// Home video asset (Sanity CDN). Exported so the VideoObject schema in
// HomeTemplate uses exactly the same URLs as the <video> element below.
// The file went live 2026-11-06 (lighter re-encode of the same video).
export const HOME_VIDEO_URL =
  "https://cdn.sanity.io/files/celkrwoq/production/1fed58166a9d6dcd13bcef55421ef6873c9408ae.mp4";
export const HOME_VIDEO_POSTER_URL =
  "https://cdn.sanity.io/images/celkrwoq/production/5839c3116edccd85882b50a97612a27ed68bd9f9-1024x768.jpg?w=640&auto=format&q=50";
export const HOME_VIDEO_UPLOAD_DATE = "2026-11-06";

export default function HomeVideo({ locale = "en", doc }: { locale?: "en" | "es"; doc?: HomePage | null }) {
  const isSpanish = locale === "es";
  const heading =
    (isSpanish ? doc?.videoHeadingEs : doc?.videoHeading) ??
    (isSpanish ? "Mira tu sistema trabajando" : "See your system at work");
  const subtitle =
    (isSpanish ? doc?.videoSubtitleEs : doc?.videoSubtitle) ??
    (isSpanish
      ? "Sistema de sprinklers optimizado para una cobertura del 100% en Fort Lauderdale."
      : "Optimized sprinkler system for 100% coverage in Fort Lauderdale.");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  // The poster (65 KB) is deferred until the video is about to scroll
  // into view, so it never downloads on the initial page load. Same URL
  // as before — no quality change — it is set 600px before the section
  // enters the viewport, so it is already in place when the visitor
  // reaches it. The VideoObject schema keeps using the constant directly.
  const [poster, setPoster] = useState<string | undefined>(undefined);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setPoster(HOME_VIDEO_POSTER_URL);
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
