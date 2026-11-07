import { MetadataRoute } from 'next';
import { getAllLocationSlugs } from '@/lib/sanityLocations';
import { sanity } from '@/lib/sanity';
import { BLOG_ES_PATHS } from '@/lib/blogTwins';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.calltechcare.com';

    const now = new Date();

    const [locationSlugs, serviceItems, postItems, cityItems] = await Promise.all([
        getAllLocationSlugs(),
        sanity.fetch<Array<{ slug?: { current?: string }; _updatedAt?: string }>>(
            `*[_type == "service" && enabled == true && defined(slug.current)]{ slug, _updatedAt }`
        ),
        sanity.fetch<Array<{ slug?: { current?: string }; _updatedAt?: string; publishedAt?: string }>>(
            `*[_type == "post" && publishedAt <= now() && defined(slug.current)]
            | order(publishedAt desc)
            { slug, _updatedAt, publishedAt }`
        ),
        sanity.fetch<Array<{ slug?: { current?: string }; esSlug?: string; _updatedAt?: string }>>(
            `*[_type == "city" && defined(slug.current) && isHub != true] | order(order asc)
            { slug, esSlug, _updatedAt }`
        ),
    ]);

    const locationUrls = (locationSlugs ?? []).map((slug) => ({
        url: `${baseUrl}/locations/${slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // /services/[slug] lists service pages only. Blog categories have no
    // archive pages, so they must not be emitted here.
    const slugToLastModified = new Map<string, Date>();

    for (const item of serviceItems ?? []) {
        const slug = item.slug?.current;
        if (!slug) continue;
        const last = item._updatedAt ? new Date(item._updatedAt) : now;
        const existing = slugToLastModified.get(slug);
        if (!existing || last > existing) slugToLastModified.set(slug, last);
    }

    const serviceUrls = Array.from(slugToLastModified.entries()).map(
        ([slug, lastModified]) => ({
            url: `${baseUrl}/services/${slug}`,
            lastModified,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        })
    );

    // Blog posts live in Sanity: EN + ES twin from the shared map.
    const blogPostUrls = (postItems ?? []).flatMap((p) => {
        const slug = p.slug?.current;
        if (!slug) return [];
        const last = p._updatedAt || p.publishedAt;
        const lastModified = last ? new Date(last) : now;
        const urls = [
            {
                url: `${baseUrl}/blog/${slug}`,
                lastModified,
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            },
        ];
        const esPath = BLOG_ES_PATHS[slug];
        if (esPath) {
            urls.push({
                url: `${baseUrl}${esPath}`,
                lastModified,
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            });
        }
        return urls;
    });

    // City landing pages live in Sanity (Lote 2): 29 standard pages, EN + ES.
    // The Miami hub keeps its fixed entries below (0.95 EN / 0.9 ES).
    // Falls back to the fixed slug list when Sanity comes back empty.
    const FALLBACK_CITY_SLUGS = [
        "pembroke-pines",
        "hollywood",
        "miramar",
        "weston",
        "sunrise",
        "davie",
        "fort-lauderdale",
        "aventura",
        "hialeah",
        "doral",
        "kendall",
        "cutler-bay",
        "dania-beach",
        "west-park",
        "southwest-ranches",
        "miami-gardens",
        "miami-lakes",
        "north-miami",
        "coral-gables",
        "key-biscayne",
        "miami-beach",
        "north-bay-village",
        "surfside",
        "sunny-isles-beach",
        "country-club",
        "fontainebleau",
        "tamiami",
        "kendale-lakes",
        "country-walk",
    ];
    const cityEntries = (cityItems?.length ? cityItems : FALLBACK_CITY_SLUGS.map((slug) => ({
        slug: { current: slug },
        esSlug: `reparacion-de-sprinklers-${slug}`,
        _updatedAt: undefined as string | undefined,
    })));
    const cityLandingUrls = cityEntries.flatMap((item) => {
        const slug = item.slug?.current;
        if (!slug) return [];
        const lastModified = item._updatedAt ? new Date(item._updatedAt) : now;
        const urls = [{
            url: `${baseUrl}/sprinkler-repair-${slug}`,
            lastModified,
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }];
        if (item.esSlug) {
            urls.push({
                url: `${baseUrl}/es/${item.esSlug}`,
                lastModified,
                changeFrequency: 'weekly' as const,
                priority: 0.9,
            });
        }
        return urls;
    });


    return [
        {
            url: `${baseUrl}/`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/sprinkler-repair-miami`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.95,
        },
        {
            url: `${baseUrl}/es`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/es/reparacion-de-sprinklers-miami`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/es/reparacion-e-instalacion-de-sprinklers`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/es/reparacion-de-fugas-de-sprinklers`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/es/reparacion-de-valvulas-de-sprinklers`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/es/reemplazo-de-bombas-de-sprinklers`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/es/instalacion-de-temporizadores-de-sprinklers`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/es/actualizacion-a-controlador-wifi-de-sprinklers`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/es/instalacion-de-sensores-de-lluvia`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/es/instalacion-nueva-de-irrigacion`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/es/instalacion-de-camaras-inalambricas`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/es/plan-de-mantenimiento-de-sprinklers`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/es/reparacion-de-emergencia-de-sprinklers`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/es/contacto`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/es/solicita-una-cotizacion`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/es/servicios`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/services`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        // Service group pages (fixed entries: groups are not `service`
        // documents, so they do not come from the service query above).
        {
            url: `${baseUrl}/services/home-security`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/services/landscaping`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/es/seguridad-del-hogar`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/es/reparacion-de-sprinklers-e-irrigacion`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/es/blog`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.9,
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
            url: `${baseUrl}/request-quote`,
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
        {
            url: `${baseUrl}/es/areas-de-servicio`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/es/areas-de-servicio/miami`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/es/areas-de-servicio/fort-lauderdale`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/es/sobre-nosotros`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/es/preguntas-frecuentes`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/es/politica-de-privacidad`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/es/terminos-y-condiciones`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/es/accesibilidad`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        ...locationUrls,
        ...cityLandingUrls,
        ...serviceUrls,
        ...blogPostUrls,
    ];
}
