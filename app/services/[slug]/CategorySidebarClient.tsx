"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

interface Category {
  title: string;
  slug: string | { current: string };
  icon?: { asset?: { url?: string }, alt?: string };
}

interface Props {
  categories: Category[];
  selectedSlug: string;
}

export default function CategorySidebarClient({ categories, selectedSlug }: Props) {
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
          return (
            <Link
              key={slug}
              href={`/services/${slug}`}
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
              <span>{cat.title}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
