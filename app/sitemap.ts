import { MetadataRoute } from 'next';
import { getAllLocationSlugs } from '@/lib/sanityLocations';
import { sanity } from '@/lib/sanity';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.calltechcare.com';

    const now = new Date();

    const [locationSlugs, serviceItems, categorySlugs, postItems] = await Promise.all([
        getAllLocationSlugs(),
        sanity.fetch<Array<{ slug?: { current?: string }; _updatedAt?: string }>>( 
            `*[_type == "service" && enabled == true && defined(slug.current)]{ slug, _updatedAt }`
        ),
        sanity.fetch<string[]>(
            `*[_type == "category" && defined(slug.current)].slug.current`
        ),
        sanity.fetch<Array<{ slug?: { current?: string }; _updatedAt?: string; publishedAt?: string }>>(
            `*[_type == "post" && publishedAt <= now() && defined(slug.current)]{ slug, _updatedAt, publishedAt }`
        ),
    ]);

    const locationUrls = (locationSlugs ?? []).map((slug) => ({
        url: `${baseUrl}/locations/${slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // /services/[slug] is used for both services and categories
    const serviceAndCategorySlugs = Array.from(
        new Set([
            ...(serviceItems ?? [])
                .map((s) => s.slug?.current)
                .filter((s): s is string => Boolean(s)),
            ...(categorySlugs ?? [])
                .map((s) => (typeof s === 'string' ? s : ''))
                .filter(Boolean),
        ])
    );

    const serviceUrls = serviceAndCategorySlugs.map((slug) => ({
        url: `${baseUrl}/services/${slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    const blogPostUrls = (postItems ?? []).flatMap((p) => {
        const slug = p.slug?.current;
        if (!slug) return [];
        const last = p._updatedAt || p.publishedAt;
        return [
            {
                url: `${baseUrl}/blog/${slug}`,
                lastModified: last ? new Date(last) : now,
                changeFrequency: 'monthly' as const,
                priority: 0.6,
            },
        ];
    });


    return [
        {
            url: `${baseUrl}/`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/services`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/locations`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/faq`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/privacy-policy`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms-and-conditions`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/accessibility`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        ...locationUrls,
        ...serviceUrls,
        ...blogPostUrls,
    ];
}
