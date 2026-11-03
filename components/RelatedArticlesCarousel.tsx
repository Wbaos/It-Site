"use client";

import { useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import SvgIcon from "@/components/common/SvgIcons";
import { blogHref } from "@/lib/blogTwins";

type SanityImage = {
  asset?: { url?: string };
  alt?: string;
};

type SanitySlug = {
  current: string;
};

export type RelatedArticle = {
  _id: string;
  title: string;
  slug: SanitySlug;
  mainImage?: SanityImage;
  excerpt?: string;
  categories?: string[];
};

function truncateByChars(input: string, maxChars: number) {
  const normalized = input.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxChars) return normalized;

  const slice = normalized.slice(0, maxChars);
  const lastSpace = slice.lastIndexOf(" ");
  const cutAt = lastSpace > Math.max(0, maxChars - 20) ? lastSpace : maxChars;
  return `${slice.slice(0, cutAt).trimEnd()}…`;
}

export default function RelatedArticlesCarousel({
  posts,
  locale = "en",
}: {
  posts: RelatedArticle[];
  locale?: "en" | "es";
}) {
  const isSpanish = locale === "es";
  const ui = {
    title: isSpanish ? "Artículos Relacionados" : "Related Articles",
    navAria: isSpanish
      ? "Navegación de artículos relacionados"
      : "Related articles navigation",
    prevAria: isSpanish
      ? "Artículos relacionados anteriores"
      : "Previous related articles",
    nextAria: isSpanish
      ? "Artículos relacionados siguientes"
      : "Next related articles",
    readMore: isSpanish ? "Leer Más" : "Read More",
    fallbackExcerpt: isSpanish
      ? "Lee ideas, consejos y guías del equipo de CallTechCare."
      : "Read insights, tips, and guides from the CallTechCare team.",
  };
  const trackRef = useRef<HTMLDivElement | null>(null);

  const showNav = useMemo(() => posts.length > 3, [posts.length]);

  const scrollByPage = (direction: "prev" | "next") => {
    const track = trackRef.current;
    if (!track) return;

    const delta = direction === "next" ? track.clientWidth : -track.clientWidth;
    track.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div className="single-blog-related-wrap">
      <div className="single-blog-related-header">
        <h2 id="related-articles" className="single-blog-related-title">
          {ui.title}
        </h2>

        {showNav ? (
          <div className="single-blog-related-nav" aria-label={ui.navAria}>
            <button
              type="button"
              className="single-blog-related-navBtn"
              onClick={() => scrollByPage("prev")}
              aria-label={ui.prevAria}
            >
              <SvgIcon name="chevron-left" size={18} color="var(--brand-teal)" />
            </button>

            <button
              type="button"
              className="single-blog-related-navBtn"
              onClick={() => scrollByPage("next")}
              aria-label={ui.nextAria}
            >
              <SvgIcon name="chevron-right" size={18} color="var(--brand-teal)" />
            </button>
          </div>
        ) : null}
      </div>

      <div
        ref={trackRef}
        className="single-blog-related-carousel"
        role="region"
        aria-labelledby="related-articles"
      >
        {posts.map((post) => (
          (() => {
            const fallback = ui.fallbackExcerpt;
            const excerptText = typeof post.excerpt === "string" ? post.excerpt : fallback;
            const truncatedExcerpt = truncateByChars(excerptText, 80);

            return (
          <Link
            key={post._id}
            href={blogHref(post.slug.current, locale)}
            className="blog-card single-blog-related-card"
          >
            <div className="blog-image-wrapper">
              {post.mainImage?.asset?.url ? (
                <Image
                  src={post.mainImage.asset.url}
                  alt={post.mainImage.alt || post.title}
                  width={500}
                  height={300}
                  className="blog-image"
                />
              ) : null}
            </div>

            <div className="blog-content">
              {post.categories?.[0] ? (
                <span className="single-blog-related-category">
                  {post.categories[0]}
                </span>
              ) : null}
              <h3 className="blog-card-title">{post.title}</h3>

              <p className="blog-excerpt">
                {truncatedExcerpt}
              </p>
            </div>

            <div className="blog-readmore">
              <span>{ui.readMore}</span>
              <SvgIcon
                name="chevron-right"
                size={18}
                className="blog-arrow"
                color="var(--brand-teal)"
              />
            </div>
          </Link>
            );
          })()
        ))}
      </div>
    </div>
  );
}
