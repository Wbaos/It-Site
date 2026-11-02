import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/account", "/account/", "/cart", "/checkout", "/login", "/signup", "/success", "/thank-you", "/cancel", "/forgot-password", "/book", "/assessment", "/reviews/write"],
            },
        ],
        sitemap: "https://www.calltechcare.com/sitemap.xml",
    };
}
