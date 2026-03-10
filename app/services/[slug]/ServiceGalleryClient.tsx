"use client";

import { Dialog } from "@headlessui/react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import SvgIcon from "@/components/common/SvgIcons";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

type GalleryImage = {
  asset?: { url?: string };
  alt?: string;
};

type GalleryVideo = {
  title?: string;
  caption?: string;
  poster?: { asset?: { url?: string }; alt?: string };
  videoFile?: { asset?: { url?: string; mimeType?: string } };
};

type MediaItem =
  | { kind: "image"; url: string; alt: string }
  | {
      kind: "video";
      url: string;
      mimeType?: string;
      posterUrl?: string;
      title?: string;
      caption?: string;
    };

export default function ServiceGalleryClient({
  serviceTitle,
  gallery,
  videos,
}: {
  serviceTitle?: string;
  gallery?: GalleryImage[];
  videos?: GalleryVideo[];
}) {
  const items = useMemo<MediaItem[]>(() => {
    const imageItems: MediaItem[] = (Array.isArray(gallery) ? gallery : [])
      .filter((img) => Boolean(img?.asset?.url))
      .map((img) => ({
        kind: "image",
        url: img.asset!.url!,
        alt: img.alt || serviceTitle || "Service photo",
      }));

    const videoItems: MediaItem[] = (Array.isArray(videos) ? videos : [])
      .filter((v) => Boolean(v?.videoFile?.asset?.url))
      .map((v) => ({
        kind: "video",
        url: v.videoFile!.asset!.url!,
        mimeType: v.videoFile?.asset?.mimeType,
        posterUrl: v.poster?.asset?.url,
        title: v.title,
        caption: v.caption,
      }));

    return [...imageItems, ...videoItems];
  }, [gallery, videos, serviceTitle]);

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [topOffset, setTopOffset] = useState(0);
  const touchStartRef = useRef<{
    x: number;
    y: number;
    startedOnVideo: boolean;
  } | null>(null);

  useEffect(() => {
    if (items.length === 0) return;
    if (activeIndex < items.length) return;
    setActiveIndex(0);
  }, [items.length, activeIndex]);

  const openAt = (idx: number) => {
    setActiveIndex(idx);
    setOpen(true);
  };

  const goPrev = () => {
    if (items.length <= 1) return;
    setActiveIndex((idx) => (idx - 1 + items.length) % items.length);
  };

  const goNext = () => {
    if (items.length <= 1) return;
    setActiveIndex((idx) => (idx + 1) % items.length);
  };

  useEffect(() => {
    if (!open) return;

    const computeOffset = () => {
      const announcement = document.querySelector<HTMLElement>(".announcement-bar");
      const header = document.querySelector<HTMLElement>(".site-header");

      const announcementH = announcement?.getBoundingClientRect().height ?? 0;
      const headerH = header?.getBoundingClientRect().height ?? 0;
      setTopOffset(Math.max(0, Math.round(announcementH + headerH)));
    };

    computeOffset();
    window.addEventListener("resize", computeOffset);
    return () => window.removeEventListener("resize", computeOffset);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (items.length <= 1) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;

      const activeEl = document.activeElement as HTMLElement | null;
      const tag = activeEl?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      if (tag === "video") return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, items.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    if (items.length <= 1) return;
    const touch = e.touches[0];
    const target = e.target as HTMLElement | null;
    const startedOnVideo = target?.closest("video") != null;
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, startedOnVideo };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start) return;
    if (start.startedOnVideo) return;
    if (items.length <= 1) return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dy) > 50) return;
    if (Math.abs(dx) < 60) return;

    if (dx < 0) goNext();
    else goPrev();
  };

  if (items.length === 0) return null;

  const active = items[activeIndex];

  return (
    <>
      <div className="service-gallery-box">
        <div className="service-gallery-header">
          <div className="service-gallery-titleRow">
            <span className="service-gallery-icon" aria-hidden="true">
              <SvgIcon name="camera" size={18} color="var(--brand-teal)" />
            </span>

            <div>
              <h2 className="service-gallery-title">Gallery</h2>
              <p className="service-gallery-subtitle">Photos and videos from our work</p>
            </div>
          </div>
        </div>

        <div className="service-gallery-grid">
          {items.map((item, idx) => {
            if (item.kind === "image") {
              return (
                <button
                  key={`gallery-item-${idx}`}
                  type="button"
                  className="service-gallery-media service-gallery-mediaBtn"
                  onClick={() => openAt(idx)}
                  aria-label="Expand image"
                >
                  <Image
                    src={item.url}
                    alt={item.alt}
                    width={800}
                    height={520}
                    className="service-gallery-img"
                    sizes="(max-width: 700px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  <span
                    className="service-gallery-zoomBadge service-gallery-zoomBadge--center"
                    aria-hidden="true"
                  >
                    <ZoomIn size={18} />
                  </span>
                </button>
              );
            }

            return (
              <div key={`gallery-item-${idx}`} className="service-gallery-media">
                <video
                  className="service-gallery-video"
                  controls
                  preload="metadata"
                  playsInline
                  poster={item.posterUrl || undefined}
                  src={item.url}
                  onError={(e) => {
                    // eslint-disable-next-line no-console
                    console.error("Service gallery video failed to load:", item.url, e.currentTarget.error);
                  }}
                >
                  Your browser does not support the video tag.
                </video>

                <button
                  type="button"
                  className="service-gallery-expandBtn service-gallery-expandBtn--corner"
                  onClick={() => openAt(idx)}
                  aria-label="Expand video"
                >
                  <ZoomIn size={18} aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="service-gallery-modal"
        style={{
          ["--gallery-top-offset" as any]: `${topOffset}px`,
        }}
      >
        <div className="service-gallery-modalOverlay" aria-hidden="true" />

        <div className="service-gallery-modalWrap" onClick={() => setOpen(false)}>
          <Dialog.Panel className="service-gallery-modalPanel">
            <button
              type="button"
              className="service-gallery-modalClose"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {items.length > 1 && (
              <>
                <button
                  type="button"
                  className="service-gallery-modalNavBtn service-gallery-modalNavBtn--prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  aria-label="Previous"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  type="button"
                  className="service-gallery-modalNavBtn service-gallery-modalNavBtn--next"
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  aria-label="Next"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            {active.kind === "image" ? (
              <div className="service-gallery-modalMedia">
                <div
                  className="service-gallery-modalContent"
                  onClick={(e) => e.stopPropagation()}
                  onTouchStart={onTouchStart}
                  onTouchEnd={onTouchEnd}
                >
                  <Image
                    src={active.url}
                    alt={active.alt}
                    width={1400}
                    height={900}
                    className="service-gallery-modalImg"
                    sizes="(max-width: 900px) 92vw, 1100px"
                    priority
                  />
                </div>

                {items.length > 1 && (
                  <div
                    className="service-gallery-modalPagination"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Gallery pagination"
                    role="navigation"
                  >
                    {items.map((_, idx) => (
                      <button
                        key={`gallery-dot-${idx}`}
                        type="button"
                        className={
                          idx === activeIndex
                            ? "service-gallery-modalDot service-gallery-modalDot--active"
                            : "service-gallery-modalDot"
                        }
                        aria-label={`Go to item ${idx + 1}`}
                        aria-current={idx === activeIndex ? "true" : undefined}
                        onClick={() => setActiveIndex(idx)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="service-gallery-modalMedia">
                <div
                  className="service-gallery-modalContent"
                  onClick={(e) => e.stopPropagation()}
                  onTouchStart={onTouchStart}
                  onTouchEnd={onTouchEnd}
                >
                  <video
                    className="service-gallery-modalVideo"
                    controls
                    preload="metadata"
                    playsInline
                    poster={active.posterUrl || undefined}
                    src={active.url}
                    onError={(e) => {
                      // eslint-disable-next-line no-console
                      console.error(
                        "Service gallery modal video failed to load:",
                        active.url,
                        e.currentTarget.error
                      );
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>

                  {(active.title || active.caption) && (
                    <div className="service-gallery-modalCaption">
                      {active.title && (
                        <div className="service-gallery-captionTitle">{active.title}</div>
                      )}
                      {active.caption && (
                        <div className="service-gallery-captionText">{active.caption}</div>
                      )}
                    </div>
                  )}
                </div>

                {items.length > 1 && (
                  <div
                    className="service-gallery-modalPagination"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Gallery pagination"
                    role="navigation"
                  >
                    {items.map((_, idx) => (
                      <button
                        key={`gallery-dot-${idx}`}
                        type="button"
                        className={
                          idx === activeIndex
                            ? "service-gallery-modalDot service-gallery-modalDot--active"
                            : "service-gallery-modalDot"
                        }
                        aria-label={`Go to item ${idx + 1}`}
                        aria-current={idx === activeIndex ? "true" : undefined}
                        onClick={() => setActiveIndex(idx)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
