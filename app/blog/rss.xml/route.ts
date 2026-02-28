import { NextResponse } from "next/server";
import { sanity } from "@/lib/sanity";

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
  const feedUrl = `${siteUrl}/blog/rss.xml`;

  const posts = await sanity.fetch<
    Array<{
      title?: string;
      slug?: { current?: string };
      excerpt?: string;
      metaDescription?: string;
      publishedAt?: string;
      _updatedAt?: string;
    }>
  >(
    `*[_type == "post" && publishedAt <= now() && defined(slug.current)] | order(publishedAt desc)[0...50] {
      title,
      slug,
      excerpt,
      metaDescription,
      publishedAt,
      _updatedAt
    }`
  );

  const itemsXml = (posts ?? [])
    .map((post) => {
      const slug = post.slug?.current;
      const title = post.title?.trim();
      if (!slug || !title) return "";

      const url = `${siteUrl}/blog/${slug}`;
      const description = (post.metaDescription || post.excerpt || "").trim();
      const pubDate = post.publishedAt || post._updatedAt;
      const pubDateRfc822 = pubDate ? new Date(pubDate).toUTCString() : "";

      return [
        "<item>",
        `<title>${escapeXml(title)}</title>`,
        `<link>${escapeXml(url)}</link>`,
        `<guid isPermaLink=\"true\">${escapeXml(url)}</guid>`,
        pubDateRfc822 ? `<pubDate>${escapeXml(pubDateRfc822)}</pubDate>` : "",
        description ? `<description><![CDATA[${description}]]></description>` : "",
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
    <title>CallTechCare Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Tech tips, Wi-Fi guides, TV mounting advice, cybersecurity basics, and IT best practices for homes and small businesses in South Florida.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${feedUrl}" rel="self" type="application/rss+xml" />
    ${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
