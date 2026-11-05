import { sanity } from "@/lib/sanity";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Link from "next/link";
import SvgIcon from "@/components/common/SvgIcons";
import RelatedArticlesCarousel from "@/components/RelatedArticlesCarousel";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogHref, BLOG_ES_PATHS } from "@/lib/blogTwins";
import {
  resolveSiteSettings,
  substitutePhonePlaceholdersInBlocks,
} from "@/lib/sanitySettings";


type SanityImage = {
  asset?: { url?: string };
  alt?: string;
};

type SanitySlug = {
  current: string;
};

type BlogCategoryRef = {
  _id: string;
  title?: string;
  titleEs?: string;
};

type BlogPostResult = {
  title: string;
  titleEs?: string;
  metaTitle?: string;
  metaTitleEs?: string;
  metaDescription?: string;
  metaDescriptionEs?: string;
  excerpt?: string;
  excerptEs?: string;
  canonicalUrl?: string;
  authorName?: string;
  publishedAt: string;
  _updatedAt?: string;
  mainImage?: SanityImage;
  ogImage?: { asset?: { url?: string } };
  readingTime?: number;
  body: PortableTextBlock[];
  bodyEs?: PortableTextBlock[];
  categories?: BlogCategoryRef[];
  tags?: string[];
  tagsEs?: string[];
  focusKeyword?: string;
};

type RelatedPostResult = {
  _id: string;
  title: string;
  titleEs?: string;
  slug: SanitySlug;
  mainImage?: SanityImage;
  excerpt?: string;
  excerptEs?: string;
  categories?: { title?: string; titleEs?: string }[];
};

/* =========================
   SEO METADATA (English route only; the Spanish routes export their own)
========================= */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const post = await sanity.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      metaTitle,
      metaDescription,
      excerpt,
      canonicalUrl,
      seoNoIndex,
      mainImage { asset->{url}, alt },
      ogImage { asset->{url}, alt }
    }`,
    { slug }
  );

  if (!post) return {};

  const title = post.metaTitle || post.title;

  const description =
    post.metaDescription ||
    post.excerpt ||
    "Sprinkler repair and irrigation guides for Miami and Broward — leaks, valves, timers, pumps and new systems — plus security camera guides from CallTechCare.";

  const image =
    post.ogImage?.asset?.url || post.mainImage?.asset?.url;

  const url =
    post.canonicalUrl || `https://www.calltechcare.com/blog/${slug}`;

  const esTwinPath = BLOG_ES_PATHS[slug];

  return {
    title,
    description,
    alternates: esTwinPath
      ? {
          canonical: url,
          languages: {
            es: `https://www.calltechcare.com${esTwinPath}`,
            en: url,
            "x-default": url,
          },
        }
      : { canonical: url },
    robots: post.seoNoIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      images: image ? [{ url: image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

/* =========================
   PAGE COMPONENT
========================= */
// Single-template locale: the Spanish routes render this same component
// with locale="es" and the English slug. Only the text changes (Spanish
// fields from Sanity, English fallback when empty); structure, sections
// and icons stay identical by construction.
export default async function BlogPost({
  params,
  locale = "en",
}: {
  params: Promise<{ slug: string }>;
  locale?: "en" | "es";
}) {
  const { slug } = await params;
  const isSpanish = locale === "es";

  const post = await sanity.fetch<BlogPostResult | null>(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      titleEs,
      metaTitle,
      metaTitleEs,
      metaDescription,
      metaDescriptionEs,
      excerpt,
      excerptEs,
      canonicalUrl,
      "authorName": author->name,
      publishedAt,
      _updatedAt,
      mainImage { asset->{url}, alt },
      ogImage { asset->{url} },
      readingTime,
      body,
      bodyEs,
      "categories": categories[]->{ _id, title, titleEs },
      tags,
      tagsEs,
      focusKeyword
    }`,
    { slug }
  );

  if (!post) {
    notFound();
  }

  const settings = await resolveSiteSettings();

  const displayTitle = isSpanish ? post.titleEs || post.title : post.title;
  const displayDescription = isSpanish
    ? post.metaDescriptionEs ||
      post.excerptEs ||
      "Guías de reparación de sprinklers y riego para Miami y Broward — fugas, válvulas, temporizadores, bombas y sistemas nuevos — además de guías de cámaras de seguridad de CallTechCare."
    : post.metaDescription ||
      post.excerpt ||
      "Sprinkler repair and irrigation guides for Miami and Broward — leaks, valves, timers, pumps and new systems — plus security camera guides from CallTechCare.";
  // Phone placeholders ({{phone}} etc.) in the Sanity body resolve against
  // site-settings, same as the plain-text templates, so the number lives in
  // exactly one place. No-op until a post body carries a marker.
  const displayBody = substitutePhonePlaceholdersInBlocks(
    isSpanish ? post.bodyEs || post.body : post.body,
    settings,
  );
  const displayTags: string[] = isSpanish
    ? post.tagsEs || post.tags || []
    : post.tags || [];
  const displayCategoryTitles: string[] = (post.categories || [])
    .map((c) => (isSpanish ? c.titleEs || c.title : c.title))
    .filter((t): t is string => Boolean(t));

  const pageUrl = isSpanish
    ? `https://www.calltechcare.com${blogHref(slug, "es")}`
    : post.canonicalUrl || `https://www.calltechcare.com/blog/${slug}`;

  const image =
    post.ogImage?.asset?.url || post.mainImage?.asset?.url;

  const tags: string[] = Array.isArray(displayTags) ? displayTags : [];

  const uniqueTags = Array.from(
    new Set(tags.map(tag => tag.trim()).filter(Boolean))
  );

  const primaryCategoryId = post.categories?.[0]?._id;
  const relatedLimit = 9;

  const relatedRaw: RelatedPostResult[] = primaryCategoryId
    ? await sanity.fetch<RelatedPostResult[]>(
        `*[_type == "post" && slug.current != $slug && publishedAt <= now() && $primaryCategoryId in categories[]._ref]
          | order(publishedAt desc)[0...$relatedLimit]{
            _id,
            title,
            titleEs,
            slug,
            mainImage { asset->{url}, alt },
            excerpt,
            excerptEs,
            "categories": categories[]->{ title, titleEs },
          }`,
        { slug, primaryCategoryId, relatedLimit }
      )
    : [];

  // Related posts resolve to Spanish titles, excerpts and category
  // labels in Spanish mode, English otherwise. Only the fields the
  // carousel needs are passed down.
  const relatedPosts = relatedRaw.map((related) => ({
    _id: related._id,
    title: isSpanish ? related.titleEs || related.title : related.title,
    slug: related.slug,
    mainImage: related.mainImage,
    excerpt: isSpanish ? related.excerptEs || related.excerpt : related.excerpt,
    categories: (related.categories || [])
      .map((c) => (isSpanish ? c.titleEs || c.title : c.title))
      .filter((t): t is string => Boolean(t)),
  }));

  /* =========================
     BLOGPOSTING SCHEMA
  ========================= */
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: isSpanish
      ? post.metaTitleEs || displayTitle
      : post.metaTitle || post.title,
    description: displayDescription,
    image: image ? [image] : undefined,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt || post.publishedAt,

    author: {
      "@type": "Person",
      name: post.authorName || "CallTechCare",
    },

    publisher: {
      "@type": "Organization",
      name: "CallTechCare",
      logo: {
        "@type": "ImageObject",
        url: "https://www.calltechcare.com/logo-schema.png",
        width: 512,
        height: 512,
      },
    },

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },

    articleSection: displayCategoryTitles,

    keywords: uniqueTags.join(", "),
    about: post.focusKeyword || undefined,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: isSpanish ? "Inicio" : "Home",
        item: "https://www.calltechcare.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: isSpanish
          ? "https://www.calltechcare.com/es/blog"
          : "https://www.calltechcare.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: displayTitle,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogSchema),
        }}
      />

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <article className="single-blog-page">
        <div className="single-blog-container">

          <Link href={isSpanish ? "/es/blog" : "/blog"} className="single-blog-back">
            <SvgIcon name="chevron-left" size={18} color="var(--brand-teal)" />
            {isSpanish ? "Volver a Blogs" : "Back to Blogs"}
          </Link>

          <h1 className="single-blog-title">{displayTitle}</h1>

          <p className="post-summary sr-only">{displayDescription}</p>

          <p className="single-blog-meta">
            <span className="single-blog-metaItem single-blog-metaAuthor">
              <SvgIcon name="blog-author" size={16} color="#9fb3c8" />
              <span>{post.authorName}</span>
            </span>

            <span className="single-blog-metaItem single-blog-metaDate">
              <SvgIcon name="calendar" size={16} color="#9fb3c8" />
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString(
                  isSpanish ? "es" : "en",
                  { timeZone: "America/New_York" }
                )}
              </time>
            </span>

            {post.readingTime ? (
              <span className="single-blog-metaItem single-blog-metaReading">
                <SvgIcon name="clock" size={16} color="#9fb3c8" />
                <span>{post.readingTime} {isSpanish ? "min de lectura" : "min read"}</span>
              </span>
            ) : null}
          </p>

          {post.mainImage?.asset?.url && (
            <div className="single-blog-hero">
              <Image
                src={post.mainImage.asset.url}
                alt={post.mainImage.alt || displayTitle}
                width={1200}
                height={600}
                priority
              />
            </div>
          )}

          <div className="single-blog-body">
            <PortableText value={displayBody} />
          </div>

          {uniqueTags.length > 0 && (
            <div className="single-blog-tags-box">
              <span className="single-blog-tags-label">
                <SvgIcon name="tag" size={17} color="var(--brand-teal)" />
                {isSpanish ? "Etiquetas" : "Tags"}
              </span>

              <div className="single-blog-tags">
                {uniqueTags.map((tag) => (
                  <span key={tag} className="single-blog-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(relatedPosts) && relatedPosts.length > 0 ? (
            <section className="single-blog-related" aria-labelledby="related-articles">
              <RelatedArticlesCarousel posts={relatedPosts} locale={locale} />
            </section>
          ) : null}

          <div className="single-blog-cta-box">
            <h2 className="single-blog-cta-title">
              {isSpanish ? "¿Necesitas Ayuda Experta?" : "Need Expert Help?"}
            </h2>
            <p className="single-blog-cta-text">
              {isSpanish
                ? "Nuestro equipo está listo para ayudarte con servicios de sprinklers, riego y cámaras de seguridad"
                : "Our team is ready to help with sprinkler, irrigation, and security camera services"}
            </p>

            <Link href={isSpanish ? "/es/#contact" : "/#contact"} className="single-blog-cta-btn">
              {isSpanish ? "Ponte en Contacto" : "Get in Touch"}
            </Link>
          </div>

        </div>
      </article>
    </>
  );
}
