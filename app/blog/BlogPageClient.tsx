"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import SvgIcon from "@/components/common/SvgIcons";

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

export default function BlogPageClient({ posts }: { posts: Post[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

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
      <div className="blog-filter" role="search" aria-label="Search and filter blog posts">
        <label className="sr-only" htmlFor="blog-category-filter">
          Category
        </label>
        <select
          id="blog-category-filter"
          className="blog-filter-category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All</option>
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
            Search blogs
          </label>
          <input
            id="blog-search-input"
            className="blog-filter-input"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search blogs..."
            autoComplete="off"
          />
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <p className="blog-empty">No posts match your filters.</p>
      ) : (
        <div className="blog-grid">
          {filteredPosts.map((post) => {
            const postSlug = normalizeSlug(post?.slug?.current);
            if (!postSlug) return null;

            const primaryCategoryTitle = getCategoryTitle(post?.categories?.[0]);

            return (
              <Link key={post._id} href={`/blog/${postSlug}`} className="blog-card">
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
                    {post.excerpt
                      ? post.excerpt
                      : "Read insights, tips, and guides from the CallTechCare team."}
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
                          ? new Date(post.publishedAt).toLocaleDateString()
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
                  <span>Read More</span>
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
