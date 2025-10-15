import { sanity } from "@/lib/sanity";
import Image from "next/image";
import { PortableText } from "@portabletext/react";

export default async function BlogPost({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const post = await sanity.fetch(
        `*[_type == "post" && slug.current == $slug][0]{
      title,
      mainImage { asset -> { url } },
      "authorName": author->name,
      publishedAt,
      body
    }`,
        { slug }
    );

    if (!post) {
        return <p className="no-posts">Post not found.</p>;
    }

    return (
        <article className="blog-post">
            <div className="blog-container">
                {post.mainImage?.asset?.url && (
                    <div className="blog-hero">
                        <Image
                            src={post.mainImage.asset.url}
                            alt={post.title}
                            width={1200}
                            height={600}
                            priority
                        />
                    </div>
                )}

                <div className="blog-content">
                    <h1 className="blog-title">{post.title}</h1>
                    <p className="blog-meta">
                        By <span>{post.authorName}</span> •{" "}
                        {new Date(post.publishedAt).toLocaleDateString()}
                    </p>

                    <div className="blog-body">
                        <PortableText value={post.body} />
                    </div>
                </div>
            </div>
        </article>
    );
}
