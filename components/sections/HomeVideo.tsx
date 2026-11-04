"use client";

import { useEffect, useRef, useState } from "react";

export default function HomeVideo({ locale = "en" }: { locale?: "en" | "es" }) {
  const isSpanish = locale === "es";
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
          {isSpanish ? "Mira tu sistema trabajando" : "See your system at work"}
        </h2>
        <p className="home-video-sub">
          {isSpanish
            ? "Sistema de sprinklers optimizado para una cobertura del 100% en Fort Lauderdale."
            : "Optimized sprinkler system for 100% coverage in Fort Lauderdale."}
        </p>
        <div className="home-video-frame">
          <video
            ref={videoRef}
            src="https://cdn.sanity.io/files/celkrwoq/production/212bcfac0e81577a37d4c8bbd9f01e9dee1a6997.mp4"
            poster="https://cdn.sanity.io/images/celkrwoq/production/5839c3116edccd85882b50a97612a27ed68bd9f9-1024x768.jpg"
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
