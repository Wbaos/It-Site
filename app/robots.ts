import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/assessment", "/api", "/api/"],
            },
        ],
        sitemap: "https://www.calltechcare.com/sitemap.xml",
    };
}
