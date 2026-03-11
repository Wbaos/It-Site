import { sanity } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import SvgIcon from "@/components/common/SvgIcons";
import type { Metadata } from "next";
import { Suspense } from "react";
import BlogPageClient from "@/app/blog/BlogPageClient";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Home Tech, TV Mounting & Smart Home Tips | CallTechCare Blog",
  description:
    "Helpful guides on TV mounting, security camera installation, Wi-Fi troubleshooting, smart home setup, sprinkler repair, and home technology tips for homeowners across Miami and South Florida.",  
  alternates: {
    canonical: "https://www.calltechcare.com/blog",
  },
};

export default async function BlogPage() {
  const posts = await sanity.fetch(`
    *[_type == "post" && publishedAt <= now()] | order(publishedAt desc) {
      _id,
      title,
      slug,
      mainImage { asset->{url}, alt },
      excerpt,
      "authorName": author->name,
      publishedAt,
      "categories": categories[]->{ title, slug },
      tags
    }
  `);

  const pageUrl = "https://www.calltechcare.com/blog";

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
        item: pageUrl,
      },
    ],
  };

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "CallTechCare Blog",
    description:
      "Guides and tips about TV mounting, security cameras, Wi-Fi troubleshooting, smart home setup, and home services.",
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
    itemListElement: (Array.isArray(posts) ? posts : [])
      .map((post: any, index: number) => {
        const slug = post?.slug?.current;
        const title = typeof post?.title === "string" ? post.title : "";
        if (!slug || !title) return null;
        const url = `https://www.calltechcare.com/blog/${slug}`;
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
          Home Tech, TV Mounting & Smart Home Guides
        </h1>

        <p className="blog-subtitle">
          Helpful guides on TV mounting, security cameras, Wi-Fi troubleshooting, smart home setup, and home maintenance tips for Miami and South Florida homeowners.
        </p>

        <p className="blog-intro">
          Looking for professional help? CallTechCare also provides{" "}
          <Link href="/services/tv-wall-mount-installation-services">
            TV mounting
          </Link>,{" "}
          <Link href="/services/home-security">
            security camera installation
          </Link>,{" "}
          <Link href="/services/wifi-and-internet">
            Wi-Fi troubleshooting
          </Link>,{" "}
          <Link href="/services/computer-and-printers">
            computer and printer support
          </Link>,{" "}
          <Link href="/services/landscaping">
            sprinkler, irrigation, and tree trimming services
          </Link>{" "}
          across Miami and South Florida.
        </p>

        <Suspense fallback={null}>
          <BlogPageClient posts={Array.isArray(posts) ? posts : []} />
        </Suspense>
        </div>
      </section>
    </>
  );
}
