"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import SvgIcon from "@/components/common/SvgIcons";

export type BeforeAfterComparison = {
  title: string;
  beforeImage?: { asset?: { url?: string }; alt?: string };
  afterImage?: { asset?: { url?: string }; alt?: string };
};

export type BeforeAfterData = {
  heading?: string;
  subheading?: string;
  comparisons?: BeforeAfterComparison[];
};

type Props = {
  data?: BeforeAfterData | null;
};

export default function BeforeAfterSection({ data }: Props) {
  const comparisons = useMemo(
    () => (data?.comparisons ?? []).filter(Boolean),
    [data?.comparisons]
  );

  const hasAny = comparisons.some(
    (c) => Boolean(c?.beforeImage?.asset?.url) && Boolean(c?.afterImage?.asset?.url)
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [percent, setPercent] = useState(50);

  useEffect(() => {
    setPercent(50);
  }, [activeIndex]);

  if (!hasAny) return null;

  const safeIndex = Math.min(Math.max(activeIndex, 0), comparisons.length - 1);
  const active = comparisons[safeIndex];

  const beforeUrl = active?.beforeImage?.asset?.url;
  const afterUrl = active?.afterImage?.asset?.url;
  if (!beforeUrl || !afterUrl) return null;

  const heading = data?.heading?.trim() || "Before & After Results";
  const subheading = data?.subheading?.trim() || "See the transformation from our recent projects";

  const beforeClip = `inset(0 ${100 - percent}% 0 0)`;
  const afterClip = `inset(0 0 0 ${percent}%)`;

  return (
    <section className="beforeafter-section" aria-label="Before and after results">
      <div className="beforeafter-section-container">
        <div className="beforeafter-card">
          <div className="beforeafter-header">
            <div className="beforeafter-titleRow">
              <span className="beforeafter-icon" aria-hidden>
                <span className="beforeafter-iconEmoji">📸</span>
              </span>
              <h2 className="beforeafter-title">{heading}</h2>
            </div>
            <p className="beforeafter-subtitle">{subheading}</p>
          </div>

          <div className="beforeafter-sliderWrap">
            <div className="beforeafter-slider" role="group" aria-label={active.title}>
              <div
                className="beforeafter-layer after-layer"
                style={{ clipPath: afterClip, WebkitClipPath: afterClip as any }}
              >
                <Image
                  src={afterUrl}
                  alt={active?.afterImage?.alt || "After"}
                  fill
                  sizes="(max-width: 768px) 100vw, 1000px"
                  className="beforeafter-img"
                  priority={false}
                />
              </div>

              <div
                className="beforeafter-layer before-layer"
                style={{ clipPath: beforeClip, WebkitClipPath: beforeClip as any }}
              >
                <Image
                  src={beforeUrl}
                  alt={active?.beforeImage?.alt || "Before"}
                  fill
                  sizes="(max-width: 768px) 100vw, 1000px"
                  className="beforeafter-img"
                  priority={false}
                />
              </div>

              <span className="beforeafter-badge before" aria-hidden>
                BEFORE
              </span>
              <span className="beforeafter-badge after" aria-hidden>
                AFTER
              </span>

              <input
                className="beforeafter-range"
                type="range"
                min={0}
                max={100}
                value={percent}
                onChange={(e) => setPercent(Number(e.target.value))}
                aria-label="Drag to compare before and after"
              />

              <div className="beforeafter-handle" style={{ left: `${percent}%` }} aria-hidden>
                <span className="beforeafter-handleLine" />
                <span className="beforeafter-handleKnob">
                  <SvgIcon
                    name="chevron-left"
                    size={18}
                    color="#0b0f19"
                    className="beforeafter-handleChevron"
                  />
                  <SvgIcon
                    name="chevron-right"
                    size={18}
                    color="#0b0f19"
                    className="beforeafter-handleChevron"
                  />
                </span>
              </div>
            </div>

            <div className="beforeafter-caption">{active.title}</div>

            {comparisons.length > 1 && (
              <div className="beforeafter-thumbs" role="tablist" aria-label="Select comparison">
                {comparisons.map((c, idx) => {
                  const thumbUrl = c?.beforeImage?.asset?.url || c?.afterImage?.asset?.url;
                  if (!thumbUrl) return null;
                  const isActive = idx === safeIndex;
                  return (
                    <button
                      key={`${idx}-${c.title}`}
                      type="button"
                      className={`beforeafter-thumb ${isActive ? "active" : ""}`}
                      onClick={() => setActiveIndex(idx)}
                      role="tab"
                      aria-selected={isActive}
                      aria-label={`View comparison ${idx + 1}`}
                    >
                      <span className="beforeafter-thumbImg">
                        <Image
                          src={thumbUrl}
                          alt={c?.beforeImage?.alt || c?.afterImage?.alt || `Comparison ${idx + 1}`}
                          fill
                          sizes="96px"
                          className="beforeafter-thumbImage"
                        />
                      </span>
                      <span className="beforeafter-thumbBadge">#{idx + 1}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="beforeafter-hint">
              <span className="beforeafter-hintIcon" aria-hidden>
                👆
              </span>
              Drag the slider left or right to compare before and after
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
