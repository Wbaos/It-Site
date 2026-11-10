import { sanity } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import SvgIcon from "@/components/common/SvgIcons";
import type { Metadata } from "next";
import { Suspense } from "react";
import BlogPageClient from "@/app/blog/BlogPageClient";
import { blogHref } from "@/lib/blogTwins";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Sprinkler Repair & Security Camera Tips | CallTechCare Blog",
  description: "Helpful guides on sprinkler repair, irrigation, security cameras, and home maintenance tips for homeowners in Miami and South Florida.",
  alternates: {
    types: {
      "application/rss+xml": "https://www.calltechcare.com/blog/rss.xml",
    },
    canonical: "https://www.calltechcare.com/blog",
    languages: {
      es: "https://www.calltechcare.com/es/blog",
      en: "https://www.calltechcare.com/blog",
      "x-default": "https://www.calltechcare.com/blog",
    },
  },
};

// Single-template locale: the Spanish route (app/es/blog/page.tsx) renders
// this same component with locale="es". Only the text changes (Spanish
// fields from Sanity, English fallback when empty); structure, sections
// and icons stay identical by construction.
export default async function BlogPage({
  locale = "en",
}: {
  locale?: "en" | "es";
} = {}) {
  const isSpanish = locale === "es";

  const posts = await sanity.fetch(`
    *[_type == "post" && publishedAt <= now()] | order(publishedAt desc) {
      _id,
      title,
      titleEs,
      slug,
      mainImage { asset->{url}, alt },
      excerpt,
      excerptEs,
      "authorName": author->name,
      publishedAt,
      "categories": categories[]->{ title, titleEs, slug },
      tags,
      tagsEs
    }
  `);

  // Resolve display values to Spanish when locale is "es", English
  // fallback when an ES field is empty. No content is duplicated here:
  // the Spanish text lives in the same Sanity documents. Only the fields
  // the client component needs are passed down, so the other locale's
  // strings never ship in the page payload.
  const displayPosts = (Array.isArray(posts) ? posts : []).map((post: any) => ({
    _id: post._id,
    title: isSpanish ? post.titleEs || post.title : post.title,
    slug: post.slug,
    mainImage: post.mainImage,
    excerpt: isSpanish ? post.excerptEs || post.excerpt : post.excerpt,
    authorName: post.authorName,
    publishedAt: post.publishedAt,
    categories: Array.isArray(post.categories)
      ? post.categories.map((category: any) => ({
          title: isSpanish ? category.titleEs || category.title : category.title,
          slug: category.slug,
        }))
      : post.categories,
    tags: isSpanish ? post.tagsEs || post.tags : post.tags,
  }));

  const pageUrl = isSpanish
    ? "https://www.calltechcare.com/es/blog"
    : "https://www.calltechcare.com/blog";

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
        item: pageUrl,
      },
    ],
  };

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "CallTechCare Blog",
    description: isSpanish
      ? "Guías y consejos sobre reparación de sprinklers, riego, cámaras de seguridad y servicios para el hogar."
      : "Guides and tips about sprinkler repair, irrigation, security cameras, and home services.",
    url: pageUrl,
    publisher: {
      "@type": "Organization",
      name: "CallTechCare",
      logo: {
        "@type": "ImageObject",
        url: "https://www.calltechcare.com/logo-schema.png"
      }
    }
  };

  const blogItemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: displayPosts
      .map((post: any, index: number) => {
        const slug = post?.slug?.current;
        const title = typeof post?.title === "string" ? post.title : "";
        if (!slug || !title) return null;
        const url = `https://www.calltechcare.com${blogHref(slug, locale)}`;
        return {
          "@type": "ListItem",
          position: index + 1,
          url,
          name: title,
        };
      })
      .filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogItemListSchema) }}
      />

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />

      <section className="blog-page">
        <div className="blog-container">

        <div className="blog-header-icon">
          <SvgIcon name="book-open" size={70} color="var(--brand-teal)" />
        </div>

        <h1 className="blog-title">
          {isSpanish
            ? "Guías de Reparación de Sprinklers y Cámaras de Seguridad"
            : "Sprinkler Repair & Security Camera Guides"}
        </h1>

        <p className="blog-subtitle">
          {isSpanish
            ? "Guías útiles sobre reparación de sprinklers, riego, cámaras de seguridad y consejos de mantenimiento para el hogar para propietarios en Miami y el sur de Florida."
            : "Helpful guides on sprinkler repair, irrigation, security cameras, and home maintenance tips for Miami and South Florida homeowners."}
        </p>

        <p className="blog-intro">
          {isSpanish ? (
            <>
              ¿Buscas ayuda profesional? CallTechCare también ofrece{" "}
              <Link href="/services/home-security">
                instalación de cámaras de seguridad
              </Link> y{" "}
              <Link href="/services/landscaping">
                servicios de sprinklers y riego
              </Link>{" "}
              en Miami y el sur de Florida.
            </>
          ) : (
            <>
              Looking for professional help? CallTechCare also provides{" "}
              <Link href="/services/home-security">
                security camera installation
              </Link> and{" "}
              <Link href="/services/landscaping">
                sprinkler and irrigation services
              </Link>{" "}
              across Miami and South Florida.
            </>
          )}
        </p>

        <Suspense fallback={null}>
          <BlogPageClient posts={displayPosts} locale={locale} />
        </Suspense>
        </div>
      </section>
    </>
  );
}
