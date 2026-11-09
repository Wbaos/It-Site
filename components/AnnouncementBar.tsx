"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { FALLBACK_SETTINGS } from "@/lib/sanitySettings";

type AnnouncementBarProps = {
  messages?: string[];
  intervalMs?: number;
  fadeMs?: number;
  phoneTel?: string;
  phoneDisplay?: string;
};

export default function AnnouncementBar({
  messages,
  intervalMs = 10_000,
  fadeMs = 300,
  phoneTel = FALLBACK_SETTINGS.phoneTel,
  phoneDisplay = FALLBACK_SETTINGS.phoneDisplay,
}: AnnouncementBarProps) {
  const pathname = usePathname();
  const isSpanishPage =
    pathname === "/es" || (pathname ?? "").startsWith("/es/");
  const items = useMemo(
    () =>
      (messages && messages.length > 0
        ? messages
        : isSpanishPage
          ? [
              "Inspección gratis en todos los servicios",
              "Hablamos Español",
              "Obtén 10% de descuento al registrarte",
            ]
          : [
              "Free inspection on all services",
              "Hablamos Español",
              "Get 10% discount when you sign up",
            ])
          .filter(Boolean),
    [messages, isSpanishPage],
  );

  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const reduceMotionRef = useRef(false);
  const timeoutIdRef = useRef<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    reduceMotionRef.current = !!media?.matches;

    const onChange = () => {
      reduceMotionRef.current = !!media?.matches;
    };

    media?.addEventListener?.("change", onChange);
    return () => media?.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;

    const intervalId = window.setInterval(() => {
      if (reduceMotionRef.current) {
        setIndex((prev) => (prev + 1) % items.length);
        return;
      }

      setVisible(false);
      if (timeoutIdRef.current) window.clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = window.setTimeout(() => {
        setIndex((prev) => (prev + 1) % items.length);
        setVisible(true);
      }, fadeMs);
    }, intervalMs);

    return () => {
      window.clearInterval(intervalId);
      if (timeoutIdRef.current) window.clearTimeout(timeoutIdRef.current);
    };
  }, [fadeMs, intervalMs, items.length]);

  const message = items[index] ?? "";

  return (
    <div className="announcement-bar" role="status" aria-live="polite">
      <div className="announcement-bar-inner">
        <div className="announcement-bar-grid">

          <div className="announcement-center">
            <span
              className={
                visible
                  ? "announcement-text announcement-text--in"
                  : "announcement-text announcement-text--out"
              }
              style={{ transitionDuration: `${fadeMs}ms` }}
            >
              {message}
            </span>
          </div>

          <div className="announcement-right">
            <a className="announcement-phone" href={`tel:${phoneTel}`}>{phoneDisplay}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
