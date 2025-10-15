import { sanity } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";

export default async function BlogPage() {
    const posts = await sanity.fetch(`*[_type == "post"] | order(_createdAt desc) {
    _id,
    title,
    slug,
    mainImage { asset -> { url } },
    "authorName": author->name,
    publishedAt
  }`);

    return (
        <section className="blog-page">
            <div className="blog-container">
                <h1 className="blog-title">CareTech Blog</h1>

                {posts.length === 0 ? (
                    <p className="no-posts">No posts yet.</p>
                ) : (
                    <div className="blog-grid">
                        {posts.map((post: any, index: number) => (
                            <Link
                                key={post._id}
                                href={`/blog/${post.slug.current}`}
                                className="blog-card"
                            >
                                {post.mainImage?.asset?.url && (
                                    <Image
                                        src={post.mainImage.asset.url}
                                        alt={post.title || "Blog post image"}
                                        width={400}
                                        height={250}
                                        className="blog-image"
                                        priority={index === 0}
                                        loading={index === 0 ? "eager" : "lazy"}
                                        fetchPriority={index === 0 ? "high" : "auto"}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    />
                                )}

                                <div className="blog-content">
                                    <h2 className="blog-card-title">{post.title}</h2>
                                    <p className="blog-author">
                                        By <span>{post.authorName || "Unknown"}</span> •{" "}
                                        {new Date(post.publishedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
