import { sanity } from "@/lib/sanity";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Link from "next/link";
import SvgIcon from "@/components/common/SvgIcons";
import RelatedArticlesCarousel from "@/components/RelatedArticlesCarousel";
import type { Metadata } from "next";
import { notFound } from "next/navigation";


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
};

type BlogPostResult = {
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  excerpt?: string;
  canonicalUrl?: string;
  authorName?: string;
  publishedAt: string;
  _updatedAt?: string;
  mainImage?: SanityImage;
  ogImage?: { asset?: { url?: string } };
  readingTime?: number;
  body: PortableTextBlock[];
  categories?: BlogCategoryRef[];
  tags?: string[];
  focusKeyword?: string;
};

type RelatedPostResult = {
  _id: string;
  title: string;
  slug: SanitySlug;
  mainImage?: SanityImage;
  excerpt?: string;
  categories?: string[];
};

/* =========================
   SEO METADATA
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
    "Local home, outdoor, and tech services in South Florida — including security camera installation, TV mounting, Wi-Fi & internet troubleshooting, computer and printer support, phone & tablet help, senior-friendly tech support, plus sprinkler & irrigation service, and tree trimming.";

  const image =
    post.ogImage?.asset?.url || post.mainImage?.asset?.url;

  const url =
    post.canonicalUrl || `https://www.calltechcare.com/blog/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
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
export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await sanity.fetch<BlogPostResult | null>(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      metaTitle,
      metaDescription,
      excerpt,
      canonicalUrl,
      "authorName": author->name,
      publishedAt,
      _updatedAt,
      mainImage { asset->{url}, alt },
      ogImage { asset->{url} },
      readingTime,
      body,
      "categories": categories[]->{ _id, title },
      tags,
      focusKeyword
    }`,
    { slug }
  );

  if (!post) {
    notFound();
  }

  const url =
    post.canonicalUrl || `https://www.calltechcare.com/blog/${slug}`;

  const image =
    post.ogImage?.asset?.url || post.mainImage?.asset?.url;

  const description =
    post.metaDescription ||
    post.excerpt ||
    "Local home, outdoor, and tech services in South Florida — including security camera installation, TV mounting, Wi-Fi & internet troubleshooting, computer and printer support, phone & tablet help, senior-friendly tech support, plus sprinkler & irrigation service, and tree trimming.";

  const tags: string[] = Array.isArray(post.tags) ? post.tags : [];

  const uniqueTags = Array.from(
    new Set(tags.map(tag => tag.trim()).filter(Boolean))
  );

  const primaryCategoryId = post.categories?.[0]?._id;
  const relatedLimit = 9;

  const relatedPosts: RelatedPostResult[] = primaryCategoryId
    ? await sanity.fetch<RelatedPostResult[]>(
        `*[_type == "post" && slug.current != $slug && publishedAt <= now() && $primaryCategoryId in categories[]._ref]
          | order(publishedAt desc)[0...$relatedLimit]{
            _id,
            title,
            slug,
            mainImage { asset->{url}, alt },
            excerpt,
            "categories": categories[]->title,
          }`,
        { slug, primaryCategoryId, relatedLimit }
      )
    : [];

  /* =========================
     BLOGPOSTING SCHEMA
  ========================= */
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.metaTitle || post.title,
    description,
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
      "@id": url,
    },

    articleSection: post.categories?.map(c => c.title).filter(Boolean),

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
        name: "Home",
        item: "https://www.calltechcare.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://www.calltechcare.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: url,
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

          <Link href="/blog" className="single-blog-back">
            <SvgIcon name="chevron-left" size={18} color="var(--brand-teal)" />
            Back to Blogs
          </Link>

          <h1 className="single-blog-title">{post.title}</h1>

          <p className="post-summary sr-only">{description}</p>

          <p className="single-blog-meta">
            <span className="single-blog-metaItem single-blog-metaAuthor">
              <SvgIcon name="blog-author" size={16} color="#9fb3c8" />
              <span>{post.authorName}</span>
            </span>

            <span className="single-blog-metaItem single-blog-metaDate">
              <SvgIcon name="calendar" size={16} color="#9fb3c8" />
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString()}
              </time>
            </span>

            {post.readingTime ? (
              <span className="single-blog-metaItem single-blog-metaReading">
                <SvgIcon name="clock" size={16} color="#9fb3c8" />
                <span>{post.readingTime} min read</span>
              </span>
            ) : null}
          </p>

          {post.mainImage?.asset?.url && (
            <div className="single-blog-hero">
              <Image
                src={post.mainImage.asset.url}
                alt={post.mainImage.alt || post.title}
                width={1200}
                height={600}
                priority
              />
            </div>
          )}

          <div className="single-blog-body">
            <PortableText value={post.body} />
          </div>

          {uniqueTags.length > 0 && (
            <div className="single-blog-tags-box">
              <span className="single-blog-tags-label">
                <SvgIcon name="tag" size={17} color="var(--brand-teal)" />
                Tags
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
              <RelatedArticlesCarousel posts={relatedPosts} />
            </section>
          ) : null}

          <div className="single-blog-cta-box">
            <h2 className="single-blog-cta-title">
              Need Expert Help?
            </h2>
            <p className="single-blog-cta-text">
              Our team is ready to help with home, outdoor, and tech services
            </p>

            <Link href="/#contact" className="single-blog-cta-btn">
              Get in Touch
            </Link>
          </div>

        </div>
      </article>
    </>
  );
}