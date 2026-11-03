"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import SvgIcon from "@/components/common/SvgIcons";
import { blogHref } from "@/lib/blogTwins";

type Category = {
  title?: string;
  slug?: { current?: string };
};

type Post = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  mainImage?: { asset?: { url?: string }; alt?: string };
  excerpt?: string;
  authorName?: string;
  publishedAt?: string;
  categories?: Category[];
  tags?: unknown;
};

function normalizeSlug(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeTitle(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function getCategorySlug(category: Category | undefined): string {
  return normalizeSlug(category?.slug?.current);
}

function getCategoryTitle(category: Category | undefined): string {
  return normalizeTitle(category?.title);
}

export default function BlogPageClient({
  posts,
  locale = "en",
}: {
  posts: Post[];
  locale?: "en" | "es";
}) {
  const isSpanish = locale === "es";
  const ui = {
    all: isSpanish ? "Todos" : "All",
    categoryLabel: isSpanish ? "Categoría" : "Category",
    searchAria: isSpanish
      ? "Buscar y filtrar posts del blog"
      : "Search and filter blog posts",
    searchLabel: isSpanish ? "Buscar blogs" : "Search blogs",
    searchPlaceholder: isSpanish ? "Buscar blogs..." : "Search blogs...",
    clearLabel: isSpanish ? "Limpiar búsqueda" : "Clear search",
    empty: isSpanish
      ? "Ningún post coincide con tus filtros."
      : "No posts match your filters.",
    readMore: isSpanish ? "Leer Más" : "Read More",
    fallbackExcerpt: isSpanish
      ? "Lee ideas, consejos y guías del equipo de CallTechCare."
      : "Read insights, tips, and guides from the CallTechCare team.",
  };
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const categories = useMemo(() => {
    const map = new Map<string, { slug: string; title: string }>();

    for (const post of Array.isArray(posts) ? posts : []) {
      const postCategories = Array.isArray(post?.categories) ? post.categories : [];
      for (const category of postCategories) {
        const slug = getCategorySlug(category);
        const title = getCategoryTitle(category);
        if (!slug || !title) continue;
        if (!map.has(slug)) map.set(slug, { slug, title });
      }
    }

    return Array.from(map.values()).sort((a, b) => a.title.localeCompare(b.title));
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const basePosts = Array.isArray(posts) ? posts : [];
    const normalizedSearch = normalizeTitle(searchTerm).toLowerCase();

    return basePosts.filter((post) => {
      const postCategories = Array.isArray(post?.categories) ? post.categories : [];
      const matchesCategory =
        !selectedCategory ||
        postCategories.some((category) => getCategorySlug(category) === selectedCategory);

      if (!matchesCategory) return false;

      if (!normalizedSearch) return true;

      const title = normalizeTitle(post?.title).toLowerCase();
      const excerpt = normalizeTitle(post?.excerpt).toLowerCase();

      const tags = Array.isArray(post?.tags)
        ? (post.tags as unknown[])
            .filter((t): t is string => typeof t === "string")
            .map((t) => t.trim().toLowerCase())
        : [];

      const categoryTitles = postCategories
        .map((c) => getCategoryTitle(c).toLowerCase())
        .filter((t) => t.length > 0);

      const haystack = [title, excerpt, ...tags, ...categoryTitles].join(" ");
      return haystack.includes(normalizedSearch);
    });
  }, [posts, selectedCategory, searchTerm]);

  return (
    <>
      <div className="blog-filter" role="search" aria-label={ui.searchAria}>
        <label className="sr-only" htmlFor="blog-category-filter">
          {ui.categoryLabel}
        </label>
        <select
          id="blog-category-filter"
          className="blog-filter-category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">{ui.all}</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.title}
            </option>
          ))}
        </select>

        <span className="blog-filter-divider" aria-hidden="true" />

        <div className="blog-filter-search">
          <SvgIcon
            name="search"
            size={18}
            color="var(--brand-teal)"
            className="blog-filter-searchIcon"
          />

          <label className="sr-only" htmlFor="blog-search-input">
            {ui.searchLabel}
          </label>
          <input
            id="blog-search-input"
            className="blog-filter-input"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={ui.searchPlaceholder}
            autoComplete="off"
            ref={searchInputRef}
          />

          {searchTerm.trim().length > 0 ? (
            <button
              type="button"
              className="blog-filter-clear"
              aria-label={ui.clearLabel}
              onClick={() => {
                setSearchTerm("");
                searchInputRef.current?.focus();
              }}
            >
              <SvgIcon name="x" size={18} color="currentColor" />
            </button>
          ) : null}
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <p className="blog-empty">{ui.empty}</p>
      ) : (
        <div className="blog-grid">
          {filteredPosts.map((post) => {
            const postSlug = normalizeSlug(post?.slug?.current);
            if (!postSlug) return null;

            const primaryCategoryTitle = getCategoryTitle(post?.categories?.[0]);

            return (
              <Link key={post._id} href={blogHref(postSlug, locale)} className="blog-card">
                <div className="blog-image-wrapper">
                  {post.mainImage?.asset?.url && (
                    <Image
                      src={post.mainImage.asset.url}
                      alt={post.mainImage.alt || post.title || "Blog post image"}
                      width={500}
                      height={300}
                      className="blog-image"
                    />
                  )}

                  {primaryCategoryTitle ? (
                    <span className="blog-badge">{primaryCategoryTitle}</span>
                  ) : null}
                </div>

                <div className="blog-content">
                  <h2 className="blog-card-title">{post.title}</h2>

                  <p className="blog-excerpt">
                    {post.excerpt ? post.excerpt : ui.fallbackExcerpt}
                  </p>

                  <div className="blog-meta-row">
                    <div className="blog-meta-left">
                      <SvgIcon name="blog-author" size={18} color="#9fb3c8" />
                      <span className="blog-author-name">{post.authorName}</span>
                    </div>

                    <div className="blog-meta-right">
                      <SvgIcon name="calendar" size={18} color="#9fb3c8" />
                      <span className="blog-date">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString(
                              isSpanish ? "es" : "en",
                              { timeZone: "America/New_York" }
                            )
                          : ""}
                      </span>
                    </div>
                  </div>

                  <div className="blog-tags">
                    {(() => {
                      const rawTags = Array.isArray(post.tags) ? (post.tags as unknown[]) : [];

                      const uniqueTags: string[] = Array.from(
                        new Set(
                          rawTags
                            .filter((t): t is string => typeof t === "string")
                            .map((t) => t.trim())
                            .filter((t) => t.length > 0)
                        )
                      );

                      return uniqueTags.map((tag) => (
                        <span key={tag} className="blog-tag">
                          {tag}
                        </span>
                      ));
                    })()}
                  </div>
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
          })}
        </div>
      )}
    </>
  );
}
