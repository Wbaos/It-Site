"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

interface Category {
  title: string;
  titleEs?: string;
  slug: string | { current: string };
  icon?: { asset?: { url?: string }, alt?: string };
}

interface Props {
  categories: Category[];
  selectedSlug: string;
  locale?: "en" | "es";
}

import { serviceHref } from "@/lib/serviceTwins";

export default function CategorySidebarClient({ categories, selectedSlug, locale = "en" }: Props) {
  const isSpanish = locale === "es";
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const idx = categories.findIndex(cat => {
      const slug = typeof cat.slug === "object" ? cat.slug.current : cat.slug;
      return slug === selectedSlug;
    });
    if (idx !== -1 && itemRefs.current[idx]) {
      itemRefs.current[idx]?.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
  }, [selectedSlug, categories]);

  return (
    <aside className="category-sidebar">
      <div className="category-list">
        {categories.map((cat, i) => {
          const slug = typeof cat.slug === "object" ? cat.slug.current : cat.slug;
          const displayTitle = isSpanish && cat.titleEs ? cat.titleEs : cat.title;
          return (
            <Link
              key={slug}
              href={serviceHref(slug, locale)}
              className={`category-list-item${slug === selectedSlug ? " active" : ""}`}
              ref={el => { itemRefs.current[i] = el; }}
            >
              {cat.icon?.asset?.url && (
                <Image
                  src={cat.icon.asset.url}
                  alt={cat.icon.alt || cat.title}
                  width={24}
                  height={24}
                  className="category-list-icon"
                />
              )}
              <span>{displayTitle}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
