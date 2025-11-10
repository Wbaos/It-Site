import { sanity } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import SvgIcon from "@/components/common/SvgIcons";

export default async function BlogPage() {
  const posts = await sanity.fetch(`*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage { asset->{url} },
    excerpt,
    "authorName": author->name,
    publishedAt,
    "categories": categories[]->title,
    tags
  }`);

  return (
    <section className="blog-page">
      <div className="blog-container">

        <div className="blog-header-icon">
        <SvgIcon name="book-open" size={70} color="#14b8a6" />
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
                <Image
                  src={post.mainImage?.asset?.url}
                  alt={post.title}
                  width={500}
                  height={300}
                  className="blog-image"
                />

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
                  {post.tags?.map((tag: string) => (
                    <span key={tag} className="blog-tag">{tag}</span>
                  ))}
                </div>

              </div>

              <div className="blog-readmore">
                <span>Read More</span>
                <SvgIcon
                  name="chevron-right"
                  size={18}
                  className="blog-arrow"
                  color="#14b8a6"
                />
              </div>

            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
