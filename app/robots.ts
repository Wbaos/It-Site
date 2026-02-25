import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/account", "/account/"],
            },
        ],
        sitemap: "https://www.calltechcare.com/sitemap.xml",
    };
}
