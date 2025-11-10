import { sanity } from "@/lib/sanity";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import SvgIcon from "@/components/common/SvgIcons";

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await sanity.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      mainImage { asset->{url} },
      "authorName": author->name,
      publishedAt,
      body,
      tags
    }`,
    { slug }
  );

  if (!post) {
    return <p className="no-posts">Post not found.</p>;
  }

  return (
    <article className="single-blog-page">
      <div className="single-blog-container">

     <Link href="/blog" className="single-blog-back">
        <SvgIcon name="chevron-left" size={18} color="#14b8a6" />
        Back to Blogs
    </Link>


        <h1 className="single-blog-title">{post.title}</h1>

        <p className="single-blog-meta">
          <SvgIcon name="blog-author" size={16} color="#9fb3c8" />{" "}
          <span>{post.authorName}</span> &nbsp; • &nbsp;
          <SvgIcon name="calendar" size={16} color="#9fb3c8" />{" "}
          {new Date(post.publishedAt).toLocaleDateString()}
        </p>

        {post.mainImage?.asset?.url && (
          <div className="single-blog-hero">
            <Image
              src={post.mainImage.asset.url}
              alt={post.title}
              width={1200}
              height={600}
              priority
            />
          </div>
        )}

        <div className="single-blog-body">
          <PortableText value={post.body} />
        </div>

        {post.tags?.length > 0 && (
          <div className="single-blog-tags-box">
            <span className="single-blog-tags-label">
              <SvgIcon name="tag" size={17} color="#14b8a6" />
              Tags
            </span>

            <div className="single-blog-tags">
              {post.tags.map((tag: string) => (
                <span key={tag} className="single-blog-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="single-blog-cta-box">
          <h2 className="single-blog-cta-title">Need Expert IT Support?</h2>
          <p className="single-blog-cta-text">
            Our team is ready to help you with all your technology needs
          </p>

          <Link href="/#contact" className="single-blog-cta-btn">
            Get in Touch
          </Link>
        </div>
      </div>
    </article>
  );
}
