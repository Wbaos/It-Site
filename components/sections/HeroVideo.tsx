"use client";

// Hero media: the home video (sprinklers at work) playing muted on loop
// INSIDE the hero's arched frame — the same shape and size the hero
// photo has — with the hero photo as poster and as fallback.
// - Reduced motion on: the photo stays, no autoplay.
// - Video fails to load/play: the photo stays.
// The video never replaces the photo's position in the grid (copy /
// photo / form on mobile), so the layout does not move.
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HOME_VIDEO_URL } from "@/lib/homeVideo";

export default function HeroVideo({
  imageSrc,
  mobileImageSrc,
  imageAlt,
}: {
  imageSrc: string;
  mobileImageSrc?: string;
  imageAlt?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // null = not decided yet (server + first paint show the photo, so
  // reduced-motion users never see a flash of video).
  const [showVideo, setShowVideo] = useState<boolean | null>(null);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setShowVideo(!reduced);
  }, []);

  useEffect(() => {
    if (!showVideo) return;
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => setShowVideo(false));
  }, [showVideo]);

  // Video poster: a sized Sanity variant (1200w) of the same photo, so
  // the <video> does not download the full-resolution file just for the
  // poster frame. The photo shown while the video is off comes from
  // next/image below, which picks its own width from `sizes`.
  const posterUrl = imageSrc.includes("cdn.sanity.io")
    ? `${imageSrc.split("?")[0]}?w=1200&auto=format&q=75`
    : imageSrc;

  if (showVideo !== true) {
    return (
      <picture>
        {mobileImageSrc ? (
          <source media="(max-width: 640px)" srcSet={mobileImageSrc} />
        ) : null}
        <Image
          src={imageSrc}
          alt={imageAlt ?? ""}
          width={1600}
          height={1200}
          priority
          // The photo band is full container width (21/9 desktop, 4/3
          // under 900px): without `sizes` next/image only offered the
          // 1920/2048 variants, so a phone downloaded ~640 KB for the
          // hero. With sizes the phone picks 640/828w (~161 KB).
          sizes="(max-width: 900px) 100vw, 1200px"
          className="heritage-hero-photo-img"
        />
      </picture>
    );
  }

  return (
    <video
      ref={videoRef}
      className="heritage-hero-video"
      src={HOME_VIDEO_URL}
      poster={posterUrl}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      aria-label={imageAlt ?? ""}
      onError={() => setShowVideo(false)}
    />
  );
}
