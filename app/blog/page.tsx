import { sanity } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import SvgIcon from "@/components/common/SvgIcons";
import type { Metadata } from "next";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Blog | CallTechCare",
  description:
    "Tech tips, Wi-Fi guides, TV mounting advice, cybersecurity basics, and IT best practices for homes and small businesses in South Florida.",
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
      "categories": categories[]->title,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogItemListSchema) }}
      />

      <section className="blog-page">
        <div className="blog-container">

        <div className="blog-header-icon">
          <SvgIcon name="book-open" size={70} color="var(--brand-teal)" />
        </div>

        <h1 className="blog-title">Tech Insights & Updates</h1>

        <p className="blog-subtitle">
          Stay informed with the latest in technology, cybersecurity, and IT best practices
        </p>

        <div className="blog-grid">
          {posts.map((post: any) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug.current}`}
              className="blog-card"
            >
              <div className="blog-image-wrapper">
                {post.mainImage?.asset?.url && (
                  <Image
                    src={post.mainImage.asset.url}
                    alt={post.mainImage.alt || post.title}
                    width={500}
                    height={300}
                    className="blog-image"
                  />
                )}

                {post.categories?.[0] && (
                  <span className="blog-badge">{post.categories[0]}</span>
                )}
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
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="blog-tags">
                  {(() => {
                    const rawTags = Array.isArray(post.tags)
                      ? (post.tags as unknown[])
                      : [];

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
          ))}
        </div>
        </div>
      </section>
    </>
  );
}
