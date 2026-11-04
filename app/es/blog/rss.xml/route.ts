import { NextResponse } from "next/server";
import { sanity } from "@/lib/sanity";
import { blogHref } from "@/lib/blogTwins";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const siteUrl = "https://www.calltechcare.com";
  const feedUrl = `${siteUrl}/es/blog/rss.xml`;

  const posts = await sanity.fetch<
    Array<{
      title?: string;
      titleEs?: string;
      slug?: { current?: string };
      excerpt?: string;
      excerptEs?: string;
      metaDescription?: string;
      metaDescriptionEs?: string;
      publishedAt?: string;
      _updatedAt?: string;
      authorName?: string;
    }>
  >(
    `*[_type == "post" && publishedAt <= now() && defined(slug.current)]
      | order(publishedAt desc)[0...50]{
        title,
        titleEs,
        slug,
        excerpt,
        excerptEs,
        metaDescription,
        metaDescriptionEs,
        publishedAt,
        _updatedAt,
        "authorName": author->name
      }`
  );

  const itemsXml = (posts ?? [])
    .map((post) => {
      const slug = post.slug?.current;
      const title = (post.titleEs || post.title)?.trim();
      if (!slug || !title) return "";

      const url = `${siteUrl}${blogHref(slug, "es")}`;

      const description =
        (post.metaDescriptionEs || post.excerptEs || post.metaDescription || post.excerpt || "").trim();

      const pubDate = post.publishedAt || post._updatedAt;
      const pubDateRfc822 = pubDate
        ? new Date(pubDate).toUTCString()
        : "";

      const author = post.authorName?.trim();

      return [
        "<item>",
        `<title>${escapeXml(title)}</title>`,
        `<link>${url}</link>`,
        `<guid isPermaLink="true">${url}</guid>`,
        pubDateRfc822
          ? `<pubDate>${escapeXml(pubDateRfc822)}</pubDate>`
          : "",
        description
          ? `<description><![CDATA[${description}]]></description>`
          : "",
        author
          ? `<author>${escapeXml(author)} (CallTechCare)</author>`
          : "",
        "</item>",
      ]
        .filter(Boolean)
        .join("");
    })
    .filter(Boolean)
    .join("");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Blog de CallTechCare</title>
    <link>${siteUrl}/es/blog</link>

    <description>
    Consejos de sprinklers, irrigación y cámaras de seguridad para el sur de Florida — incluyendo mantenimiento de sprinklers, guías de irrigación, consejos de cámaras de seguridad e ideas prácticas de mantenimiento.
    </description>

    <generator>Blog de CallTechCare RSS</generator>

    <language>es-us</language>

    <image>
      <url>https://www.calltechcare.com/logo-schema.png</url>
      <title>CallTechCare</title>
      <link>${siteUrl}/es/blog</link>
    </image>

    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>

    <atom:link
      xmlns:atom="http://www.w3.org/2005/Atom"
      href="${feedUrl}"
      rel="self"
      type="application/rss+xml"
    />

    ${itemsXml}

  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control":
        "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}