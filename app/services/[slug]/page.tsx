import CategoryServicesAccordion from "./CategoryServicesAccordion";
import CategorySidebarClient from "./CategorySidebarClient";
import { notFound } from "next/navigation";
import { sanity } from "@/lib/sanity";
import {
  resolveSiteSettings,
  substitutePhonePlaceholdersInBlocks,
} from "@/lib/sanitySettings";
import Link from "next/link";
import Image from "next/image";
import SvgIcon from "@/components/common/SvgIcons";
import ServiceReviewsWrapper from "@/components/ServiceReviewsWrapper";
import { getGoogleRatingSummary } from "@/lib/google-reviews";
import ServiceRating from "@/components/ServiceRating";
import FaqAccordion from "@/components/FaqAccordion";
import ServiceGroupList from "@/components/ServiceGroupList";
import { SERVICE_ES_PATHS, serviceHref } from "@/lib/serviceTwins";
import { cityHref } from "@/lib/cityTwins";
import BeforeAfterSection from "@/components/BeforeAfterSection";
import QuickLeadForm from "@/components/QuickLeadForm";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import ServiceGalleryClient from "./ServiceGalleryClient";


type SubService = {
  title: string;
  slug: string;
  price?: number;
  serviceType?: "installation" | "support";
  showPrice?: boolean;
  pricingModel?: "flat" | "hourly";
  hourlyConfig?: {
    minimumHours?: number;
    maximumHours?: number;
    billingIncrement?: number;
  };
  popular?: boolean;
  description?: string;
};

export const revalidate = 60;

const SPRINKLER_CITY_LINKS = [
  { name: "Sunrise", href: "/sprinkler-repair-sunrise" },
  { name: "Fort Lauderdale", href: "/sprinkler-repair-fort-lauderdale" },
  { name: "Dania Beach", href: "/sprinkler-repair-dania-beach" },
  { name: "Weston", href: "/sprinkler-repair-weston" },
  { name: "Davie", href: "/sprinkler-repair-davie" },
  { name: "Southwest Ranches", href: "/sprinkler-repair-southwest-ranches" },
  { name: "Hollywood", href: "/sprinkler-repair-hollywood" },
  { name: "West Park", href: "/sprinkler-repair-west-park" },
  { name: "Pembroke Pines", href: "/sprinkler-repair-pembroke-pines" },
  { name: "Miramar", href: "/sprinkler-repair-miramar" },
  { name: "Miami Gardens", href: "/sprinkler-repair-miami-gardens" },
  { name: "Miami Lakes", href: "/sprinkler-repair-miami-lakes" },
  { name: "Country Club", href: "/sprinkler-repair-country-club" },
  { name: "Aventura", href: "/sprinkler-repair-aventura" },
  { name: "Sunny Isles Beach", href: "/sprinkler-repair-sunny-isles-beach" },
  { name: "North Miami", href: "/sprinkler-repair-north-miami" },
  { name: "Surfside", href: "/sprinkler-repair-surfside" },
  { name: "North Bay Village", href: "/sprinkler-repair-north-bay-village" },
  { name: "Miami Beach", href: "/sprinkler-repair-miami-beach" },
  { name: "Hialeah", href: "/sprinkler-repair-hialeah" },
  { name: "Doral", href: "/sprinkler-repair-doral" },
  { name: "Fontainebleau", href: "/sprinkler-repair-fontainebleau" },
  { name: "Tamiami", href: "/sprinkler-repair-tamiami" },
  { name: "Miami", href: "/sprinkler-repair-miami" },
  { name: "Coral Gables", href: "/sprinkler-repair-coral-gables" },
  { name: "Key Biscayne", href: "/sprinkler-repair-key-biscayne" },
  { name: "Kendall", href: "/sprinkler-repair-kendall" },
  { name: "Kendale Lakes", href: "/sprinkler-repair-kendale-lakes" },
  { name: "Country Walk", href: "/sprinkler-repair-country-walk" },
  { name: "Cutler Bay", href: "/sprinkler-repair-cutler-bay" },
];

const SPRINKLER_SERVICE_LINKS = [
  { slug: "sprinkler-repair-and-installation", title: "Sprinkler Repair" },
  { slug: "emergency-sprinkler-repair", title: "Emergency Sprinkler Repair" },
  { slug: "sprinkler-leak-repair", title: "Sprinkler Leak Repair" },
  { slug: "sprinkler-valve-repair", title: "Sprinkler Valve Repair" },
  { slug: "sprinkler-timer-installation", title: "Sprinkler Timer Installation" },
  { slug: "sprinkler-pump-replacement", title: "Sprinkler Pump Replacement" },
  { slug: "new-irrigation-well-installation", title: "New Irrigation Well Installation" },
  { slug: "rain-sensor-installation", title: "Rain Sensor Installation" },
  { slug: "wifi-sprinkler-controller-upgrade", title: "WiFi Sprinkler Controller Upgrade" },
  { slug: "new-irrigation-installation", title: "New Irrigation Installation" },
  { slug: "sprinkler-maintenance-plan", title: "Sprinkler Maintenance Plan" },
  { slug: "commercial-irrigation-hoa-services", title: "Commercial Irrigation & HOA Services" },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const url = `https://www.calltechcare.com/services/${slug}`;


  // Try service first
  const service = await sanity.fetch(
    `*[_type == "service" && slug.current == $slug][0]{
      title,
      description,
      metaTitle,
      metaDescription,
      image { asset->{ url }, alt }
    }`,
    { slug }
  );

    if (service) {
    const title =
      service.metaTitle || `${service.title} in Miami & Broward | CallTechCare`;
    const description =
      service.metaDescription ||
      service.description ||
      `Professional ${service.title} service in Miami, Fort Lauderdale, and Broward County.`;
    // Spanish twin exists for all eleven services (main service since phase 1,
    // the other ten since the Spanish services lot).
    const esTwinPath = SERVICE_ES_PATHS[slug];
    return {
      title,
      description,
      alternates: esTwinPath
        ? {
            canonical: url,
            languages: {
              es: `https://www.calltechcare.com${esTwinPath}`,
              en: url,
              "x-default": url,
            },
          }
        : { canonical: url },
      openGraph: {
        title,
        description,
        url,
        images: service.image?.asset?.url
          ? [{ url: service.image.asset.url, alt: service.image.alt || service.title }]
          : [],
      },
      twitter: {
        title,
        description,
        images: service.image?.asset?.url ? [service.image.asset.url] : [],
      },
    };
  }

  // Otherwise category
  const category = await sanity.fetch(
    `*[_type == "category" && slug.current == $slug][0]{
      title,
      seoTitle,
      metaDescription,
      description,
      tagline,
      icon { asset->{ url }, alt }

    }`,
    { slug }
  );

  if (category) {
    const title =
      category.seoTitle ||
      `${category.title} in Miami & Broward | CallTechCare`;

    const description =
      category.metaDescription ||
      category.tagline ||
      category.description ||
      `Professional ${category.title} services in Miami, Fort Lauderdale, and Broward County.`;

    // Spanish twin exists for the home-security and landscaping groups
    // (their ES pages already emit hreflang back to this URL); other
    // categories keep canonical only so no false hreflang is emitted.
    const esTwinPath = SERVICE_ES_PATHS[slug];
    return {
      title,
      description,
      alternates: esTwinPath
        ? {
            canonical: url,
            languages: {
              es: `https://www.calltechcare.com${esTwinPath}`,
              en: url,
              "x-default": url,
            },
          }
        : { canonical: url },
      openGraph: {
        title,
        description,
        url,
        images: category.icon?.asset?.url
          ? [{ url: category.icon.asset.url, alt: category.icon.alt || category.title }]
          : [],
      },
      twitter: {
        title,
        description,
        images: category.icon?.asset?.url ? [category.icon.asset.url] : [],
      },
    };
  }

  return {};
}

export default async function ServicePage({
  params,
  locale = "en",
}: {
  params: Promise<{ slug: string }>;
  locale?: "en" | "es";
}) {
  const { slug } = await params;
    console.log("SERVICE SLUG:", slug);
  const isSpanish = locale === "es";
  // Camera pages (group + wireless install) must not show sprinkler-city
  // pills: their destinations are sprinkler repair pages, which does not
  // correspond to a camera page. The neutral city row above stays.
  const isCameraPage =
    slug === "home-security" || slug === "wireless-camera-installation";
  const settings = await resolveSiteSettings();

  const pageUrl =
    locale === "es"
      ? `https://www.calltechcare.com${serviceHref(slug, "es")}`
      : `https://www.calltechcare.com/services/${slug}`;
  const speakableWebPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: pageUrl,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [
        ".service-detail h1",
        ".service-description",
        ".included-box",
        ".styled-about-box",
        ".styled-features-box",
      ],
    },
  };

  const serviceAreasRaw = await sanity.fetch<
    Array<{ city?: string; slug?: { current?: string } }>
  >(
    `*[_type == "location" && isActive == true] | order(city asc) { city, slug }`
  );

  const serviceAreas = Array.from(
    new Map(
      (serviceAreasRaw ?? [])
        .map((loc) => {
          const city = loc.city?.trim();
          const locationSlug = loc.slug?.current?.trim();
          if (!city || !locationSlug) return null;
          return [locationSlug, { city, slug: locationSlug }] as const;
        })
        .filter(
          (
            item
          ): item is readonly [string, { city: string; slug: string }] =>
            Boolean(item)
        )
    ).values()
  );

  const ServiceAreasSection = () => (
    serviceAreas.length > 0 ? (
    <section className="service-areas-section">
      <div className="site-container">
        <div className="service-areas-inner">
          <h2 className="service-areas-title">
            {isSpanish ? "Áreas de servicio" : "Service Areas"}
          </h2>
          <p className="service-areas-subtitle">
            {isSpanish
              ? "Atendemos comunidades en Miami-Dade y Broward."
              : "Serving communities across Miami-Dade and Broward County."}
          </p>
          <div className="service-areas-pills">
            {serviceAreas.map((area) => (
              <Link
                key={area.slug}
                href={isSpanish ? `/es/areas-de-servicio/${area.slug}` : `/locations/${area.slug}`}
                className="service-area-pill"
                aria-label={
                  isSpanish
                    ? `Ver servicios en ${area.city}`
                    : `View services in ${area.city}`
                }
              >
                <SvgIcon
                  name="map-pin"
                  size={14}
                  color="var(--brand-teal)"
                  className="service-area-icon"
                />
                {area.city}
              </Link>
            ))}
          </div>
          {/* Sprinkler-city pills: sprinkler pages only. On camera pages
              these destinations would not correspond to the page, so the
              whole row is skipped there (the neutral city row above stays). */}
          {!isCameraPage && (
            <>
          <p className="service-areas-subtitle">
            {isSpanish ? "Atendemos estas ciudades:" : "We serve these cities:"}
          </p>
          <div className="service-areas-pills">
            {SPRINKLER_CITY_LINKS.map((city) => (
              <Link
                key={city.href}
                href={cityHref(city.href.replace("/sprinkler-repair-", ""), locale)}
                className="service-area-pill"
                aria-label={
                  // Camera pages link to sprinkler city pages too, but the
                  // label must not claim sprinkler repair: keep it neutral.
                  slug === "home-security" ||
                  slug === "wireless-camera-installation"
                    ? isSpanish
                      ? `Ver servicios en ${city.name}`
                      : `See services in ${city.name}`
                    : isSpanish
                      ? `Reparación de sprinklers en ${city.name}`
                      : `Sprinkler repair in ${city.name}`
                }
              >
                <SvgIcon
                  name="map-pin"
                  size={14}
                  color="var(--brand-teal)"
                  className="service-area-icon"
                />
                {city.name}
              </Link>
            ))}
          </div>
            </>
          )}
        </div>
      </div>
    </section>
    ) : null
  );

  const service = await sanity.fetch(
    `*[_type == "service" && slug.current == $slug][0]{
      title,
      titleEs,
      pricingModel,
      hourlyConfig{minimumHours, maximumHours, billingIncrement},
      description,
      descriptionEs,
      mode,
      category-> { title },
      warranty,
      warrantyEs,
      image { asset->{ url }, alt },
      gallery[]{
        asset-> { url },
        alt
      },
      videos[]{
        title,
        caption,
        videoFile{ asset-> { url, mimeType, size } },
        poster{ asset-> { url }, alt }
      },
      details,
      detailsEs,
      faqs,
      faqsEs,
      beforeAfter{
        heading,
        subheading,
        comparisons[]{
          title,
          beforeImage{asset->{url}, alt},
          afterImage{asset->{url}, alt}
        }
      },
      beforeAfterEs{
        heading,
        subheading,
      },
      testimonials[] | order(date desc) {
        name,
        text,
        date,
        rating
      },

      "subservices": *[_type == "service" && parentService._ref == ^._id]{
        title,
        titleEs,
        navDescriptionEs,
        "slug": slug.current,
        serviceType,
        pricingModel,
        hourlyConfig{minimumHours, maximumHours, billingIncrement},
        popular,
        description
      }
    }`,
    { slug }
  );

  // Live Google rating summary (5.0 + review count) from the same source
  // as the home page. Shares the 60-second cache with getGoogleReviews()
  // (used by ServiceReviewsWrapper below), so one Google call serves both
  // the rating badge and the review list per render. When the API fails
  // or returns nothing, the badge hides instead of showing a stale number.
  const googleRatingSummary = await getGoogleRatingSummary();

  // Single-template locale: display values resolve to the Spanish field
  // when locale is "es" and the field is present, otherwise English.
  // Testimonials, gallery, videos and before/after comparisons have no
  // Spanish counterpart by design (customer words and media stay verbatim).
  const displayTitle =
    isSpanish && service?.titleEs ? service.titleEs : service?.title;
  const displayDescription =
    isSpanish && service?.descriptionEs
      ? service.descriptionEs
      : service?.description;
  const displayWarranty =
    isSpanish && service?.warrantyEs ? service.warrantyEs : service?.warranty;
  const displayDetails =
    isSpanish && service?.detailsEs?.length
      ? service.detailsEs
      : service?.details;
  const displayFaqs =
    isSpanish && service?.faqsEs?.length ? service.faqsEs : service?.faqs;
  const displayBeforeAfter =
    isSpanish && service?.beforeAfterEs
      ? {
          ...service.beforeAfter,
          heading:
            service.beforeAfterEs.heading || service.beforeAfter?.heading,
          subheading:
            service.beforeAfterEs.subheading ||
            service.beforeAfter?.subheading,
        }
      : service?.beforeAfter;
  // Related sprinkler services: title + short description per service, in
  // both languages, for the related-services cards inside the main content
  // (below) and the Spanish titles of the pills at the bottom. One fetch
  // serves both locales; the current service is excluded at render time.
  // A service with no Sanity doc yet (the two new ones) falls back to its
  // hardcoded title in SPRINKLER_SERVICE_LINKS until the doc exists.
  const relatedServiceInfo: Record<
    string,
    {
      title?: string;
      titleEs?: string;
      description?: string;
      descriptionEs?: string;
    }
  > = {};
  if (service) {
    const related = await sanity.fetch(
      `*[_type == "service" && slug.current in ["sprinkler-repair-and-installation", "emergency-sprinkler-repair", "sprinkler-leak-repair", "sprinkler-valve-repair", "sprinkler-timer-installation", "sprinkler-pump-replacement", "new-irrigation-well-installation", "rain-sensor-installation", "wifi-sprinkler-controller-upgrade", "new-irrigation-installation", "wireless-camera-installation", "sprinkler-maintenance-plan", "commercial-irrigation-hoa-services"]]{ "slug": slug.current, title, titleEs, description, descriptionEs }`
    );
    for (const t of (related as any[]) ?? []) {
      if (t?.slug) relatedServiceInfo[t.slug] = t;
    }
  }
  // Spanish titles for the related-services pills (only the title text
  // changes); derived from the same fetch above.
  const sprinklerTitlesEs: Record<string, string> = {};
  for (const [s, info] of Object.entries(relatedServiceInfo)) {
    if (info?.titleEs) sprinklerTitlesEs[s] = info.titleEs;
  }
  // Cards for the related-services section: every sprinkler service except
  // the current one, title + short description in the page locale.
  const relatedServices = SPRINKLER_SERVICE_LINKS.filter(
    (s) => s.slug !== slug
  ).map((s) => {
    const info = relatedServiceInfo[s.slug];
    return {
      slug: s.slug,
      title:
        isSpanish && info?.titleEs ? info.titleEs : info?.title ?? s.title,
      description:
        isSpanish && info?.descriptionEs
          ? info.descriptionEs
          : info?.description,
    };
  });

  // Related-services pills for the camera service page, mirroring the
  // "Related sprinkler services" section below: the camera service is the
  // only service without one, so it links to its parent group. The group
  // label is the ES twin page title in Spanish mode; in English it is the
  // category title from Sanity.
  const cameraRelatedLinks =
    slug === "wireless-camera-installation"
      ? [
          {
            href: serviceHref("home-security", locale),
            label: isSpanish
              ? "Seguridad del Hogar"
              : ((service as any)?.category?.title ?? "Home Security"),
          },
        ]
      : [];

  // Shared related-pills section (same markup as the sprinkler related
  // section). Renders nothing when there are no links.
  const RelatedLinksSection = ({
    links,
  }: {
    links: { href: string; label: string }[];
  }) =>
    links.length > 0 ? (
      <section className="service-areas-section">
        <div className="site-container">
          <div className="service-areas-inner">
            <h2 className="service-areas-title">
              {isSpanish ? "Servicios relacionados" : "Related services"}
            </h2>
            <div className="service-areas-pills">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="service-area-pill"
                  aria-label={l.label}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    ) : null;

 const serviceBreadcrumbSchema = service
  ? {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: isSpanish ? "Inicio" : "Home",
          item: "https://www.calltechcare.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: isSpanish ? "Servicios" : "Services",
          item: "https://www.calltechcare.com/services",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: displayTitle,
          item: pageUrl,
        },
      ],
    }
  : null;


  const faqSchema = (() => {
    if (!displayFaqs?.length) return null;

    const mainEntity = displayFaqs
      .map((faq: any) => {
        const question =
          (typeof faq?.question === "string" && faq.question.trim()) ||
          (typeof faq?.q === "string" && faq.q.trim()) ||
          "";
        const answer =
          (typeof faq?.answer === "string" && faq.answer.trim()) ||
          (typeof faq?.a === "string" && faq.a.trim()) ||
          "";

        if (!question || !answer) return null;

        return {
          "@type": "Question",
          name: question,
          acceptedAnswer: {
            "@type": "Answer",
            text: answer,
          },
        };
      })
      .filter(Boolean);

    if (mainEntity.length === 0) return null;

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity,
    };
  })();

        const serviceSchema = service
          ? {
              "@context": "https://schema.org",
              "@type": "Service",
              name: displayTitle,
              url: pageUrl,
              ...(service.image?.asset?.url && {
                image: service.image.asset.url,
              }),
              description:
                displayDescription ||
                `Professional ${displayTitle} service in Miami, Fort Lauderdale, and Broward County.`,
              areaServed: {
                "@type": "Place",
                name: "Miami, Fort Lauderdale, Broward County",
              },
              provider: {
                "@type": "LocalBusiness",
                "@id": "https://www.calltechcare.com/#business",
                name: "CallTechCare",
                url: "https://www.calltechcare.com",
              },
            }
          : null;

  if (!service) {
    // Fetch serviceGroups for the category and their services
    const [serviceGroups, allCategories, category] = await Promise.all([
      sanity.fetch(
        `*[_type == "serviceGroup" && category->slug.current == $slug]|order(order asc){
          title,
          titleEs,
          slug,
          description,
          descriptionEs,
          "services": *[_type == "service" && group._ref == ^._id]{
            title,
            titleEs,
            slug,
            description,
            descriptionEs,
            pricingModel,
            popular
          }
        }`,
        { slug }
      ),
      sanity.fetch(
        `*[_type == "category" && defined(slug.current) && count(*[_type == "serviceGroup" && category._ref == ^._id]) > 0]
          | order(displayOrder asc, title asc){
          title,
          titleEs,
          slug,
          icon {
            asset->{url},
            alt
          }
        }`
      ),
      sanity.fetch(
        `*[_type == "category" && slug.current == $slug][0]{
          title,
          titleEs,
          description,
          descriptionEs,
          seoTitle,
          seoTitleEs,
          metaDescription,
          metaDescriptionEs,
          tagline,
          taglineEs,
          "jobsCompletedValue": jobsCompleted.value,
          "jobsCompletedIconUrl": jobsCompleted.icon.asset->url,
          "customerRatingValue": customerRating.value,
          "customerRatingIconUrl": customerRating.icon.asset->url,
          "yearsExperienceValue": yearsExperience.value,
          "yearsExperienceIconUrl": yearsExperience.icon.asset->url,
          about,
          aboutEs,
          features,
          featuresEs,
          faqs[]{
            question,
            answer
          },
          faqsEs[]{
            question,
            answer
          },
          whyChoose[]{
            title,
            description,
            "iconUrl": icon.asset->url
          },
          whyChooseEs[]{
            title,
            description,
            "iconUrl": icon.asset->url
          },
          badges[]{
            title,
            description,
            "iconUrl": icon.asset->url
          },
          badgesEs[]{
            title,
            description,
            "iconUrl": icon.asset->url
          },
          icon {
            asset->{url},
            alt
          }
        }`,
        { slug }
      )
    ]);
    if (category) {

      // Spanish fields from Sanity, with English fallback (dynamic, organized:
      // no hardcoded Spanish copy for category content).
      const catTitle = isSpanish && category.titleEs ? category.titleEs : category.title;
      const catTagline = isSpanish && category.taglineEs ? category.taglineEs : category.tagline;
      const catAbout = substitutePhonePlaceholdersInBlocks(
        isSpanish && category.aboutEs?.length ? category.aboutEs : category.about,
        settings,
      );
      const catFeatures = isSpanish && category.featuresEs?.length ? category.featuresEs : category.features;
      const catFaqs = isSpanish && category.faqsEs?.length ? category.faqsEs : category.faqs;
      // Related-services pills for the camera group page, mirroring the
      // sprinkler related section: the group's own services, titles from
      // Sanity (Spanish field with English fallback). Other categories
      // get no related section from this block.
      const categoryCameraLinks =
        slug === "home-security"
          ? (serviceGroups as any[])
              .flatMap((g: any) => g.services ?? [])
              .map((s: any) => ({
                href: serviceHref(
                  typeof s.slug === "string" ? s.slug : s.slug?.current,
                  locale
                ),
                label: isSpanish && s.titleEs ? s.titleEs : s.title,
              }))
              .filter((l: any) => Boolean(l.href) && Boolean(l.label))
          : [];
      const catBadges = (isSpanish && category.badgesEs?.length ? category.badgesEs : category.badges ?? []).map((b: any, i: number) => ({
        ...b,
        iconUrl: b.iconUrl || (category.badges?.[i]?.iconUrl ?? null),
      }));
      const catWhyChoose = (isSpanish && category.whyChooseEs?.length ? category.whyChooseEs : category.whyChoose ?? []).map((w: any, i: number) => ({
        ...w,
        iconUrl: w.iconUrl || (category.whyChoose?.[i]?.iconUrl ?? null),
      }));

      const categoryBreadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://www.calltechcare.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: "https://www.calltechcare.com/services",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: category.title,
            item: `https://www.calltechcare.com/services/${slug}`,
          },
        ],
      };
      const categoryServiceSchema = {
        "@context": "https://schema.org",
        "@type": "Service",
        name: isSpanish ? `${catTitle} en Miami y Broward` : `${catTitle} in Miami & Broward`,
        description:
          (isSpanish && category.metaDescriptionEs ? category.metaDescriptionEs : category.metaDescription) ||
          catTagline ||
          (isSpanish && category.descriptionEs ? category.descriptionEs : category.description) ||
          `Professional ${category.title} services in Miami, Fort Lauderdale, and Broward County.`,

        areaServed: {
          "@type": "Place",
          name: "Miami, Fort Lauderdale, Broward County",
        },

        provider: {
          "@type": "LocalBusiness",
          "@id": "https://www.calltechcare.com/#business",
          name: "CallTechCare",
          url: "https://www.calltechcare.com",
        },
      };

      const categoryFaqMainEntity = (catFaqs || [])
        .map((faq: any) => {
          const question = String(faq?.question || "").trim();
          const answer = String(faq?.answer || "").trim();
          if (!question || !answer) return null;
          return {
            "@type": "Question",
            name: question,
            acceptedAnswer: {
              "@type": "Answer",
              text: answer,
            },
          };
        })
        .filter(Boolean);

      const categoryFaqSchema =
        categoryFaqMainEntity.length > 0
          ? {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: categoryFaqMainEntity,
            }
          : null;
      return (
        <>
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(categoryBreadcrumbSchema),
    }}
  />
   <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(categoryServiceSchema),
    }}
  />

  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(speakableWebPageSchema),
    }}
  />

  {categoryFaqSchema && (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(categoryFaqSchema),
      }}
    />
  )}

  <section className="category-detail">

          {/* Category Header - full width, above sidebar */}
          <div className="category-header category-header-full">
            <div className="category-header-inner">
              <div className="category-header-inner-content">
                {category.icon?.asset?.url && (
                  <Image
                    src={category.icon.asset.url}
                    alt={category.icon.alt || category.title}
                    width={64}
                    height={64}
                    className="category-icon"
                  />
                )}
                <div>
                  <h1 className="category-title">
                    {isSpanish ? `${catTitle} en Miami y Broward` : `${catTitle} in Miami & Broward`}
                  </h1>
                  {catTagline && (
                    <p className="category-desc">{catTagline}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Sidebar */}
          <CategorySidebarClient categories={allCategories} selectedSlug={slug} locale={locale} />
          <div className="category-main-layout">
            {/* Main Content */}
            <main className="category-main-content">
              {serviceGroups.length > 0 ? (
                <CategoryServicesAccordion serviceGroups={serviceGroups} locale={locale} />
              ) : (
                <p className="category-no-services">No service groups found in this category.</p>
              )}

              <hr className="category-section-divider" />

              {/* <div className="category-header-stats">
                {category.icon?.asset?.url && (
                  <Image
                    src={category.icon.asset.url}
                    alt={category.icon.alt || category.title}
                    width={64}
                    height={64}
                    className="category-icon"
                  />
                )}
                <div>
                  <h2 className="category-title-below">{category.title}</h2>
                  {category.tagline && (
                    <p className="category-desc">{category.tagline}</p>
                  )}
                </div>
              </div> */}

              {/* --- Extra Category Info Section --- */}
              <div className="styled-extra-info">
                <div className="styled-stats-row">
                  {category.jobsCompletedValue && (
                    <div className="styled-stat">
                      {category.jobsCompletedIconUrl && (
                        <img src={category.jobsCompletedIconUrl} alt="" className="styled-stat-icon" width={32} height={32} />
                      )}
                      <div className="styled-stat-value">{category.jobsCompletedValue}</div>
                      <div className="styled-stat-label">{isSpanish ? "Trabajos Completados" : "Jobs Completed"}</div>
                    </div>
                  )}
                  {category.customerRatingValue && (
                    <div className="styled-stat">
                      {category.customerRatingIconUrl && (
                        <img src={category.customerRatingIconUrl} alt="" className="styled-stat-icon" width={32} height={32} />
                      )}
                      <div className="styled-stat-value">{category.customerRatingValue}</div>
                      <div className="styled-stat-label">{isSpanish ? "Calificación de Clientes" : "Customer Rating"}</div>
                    </div>
                  )}
                  {category.yearsExperienceValue && (
                    <div className="styled-stat">
                      {category.yearsExperienceIconUrl && (
                        <img src={category.yearsExperienceIconUrl} alt="" className="styled-stat-icon" width={32} height={32} />
                      )}
                      <div className="styled-stat-value">{category.yearsExperienceValue}</div>
                      <div className="styled-stat-label">{isSpanish ? "Experiencia" : "Experience"}</div>
                    </div>
                  )}
                </div>
                {category.about && (
                  <div className="styled-about-features-row">
                    <div className="styled-about-box">
                      <div className="styled-about-title">{isSpanish ? "Sobre Este Servicio" : "About This Service"}</div>
                      <div className="styled-about-desc">
  <PortableText
    value={catAbout}
    components={{
      block: {
        normal: ({ children }) => (
          <p className="styled-about-paragraph">
            {children}
          </p>
        ),
        h2: ({ children }) => (
          <h2 className="styled-about-heading">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="styled-about-subheading">
            {children}
          </h3>
        ),
      },
      list: {
        bullet: ({ children }) => (
          <ul className="styled-about-list">
            {children}
          </ul>
        ),
      },
      listItem: {
        bullet: ({ children }) => (
          <li className="styled-about-list-item">
            {children}
          </li>
        ),
      },
      types: {
        // fallback safety in case something weird appears
        undefined: () => null,
      },
    }}
  />
</div>
                    </div>
                  </div>
                )}

                {catFeatures && catFeatures.length > 0 && (
                  <div className="styled-features-box">
                    <div className="styled-features-title">{isSpanish ? "Qué incluye" : "What&apos;s Included"}</div>
                    <ul className="styled-features-list">
                      {catFeatures.map((f: string, i: number) => (
                        <li key={i} className="styled-feature-item">
                          <SvgIcon name="checkmark-circle" size={20} color="#10b981" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {catBadges && catBadges.length > 0 && (
                  <div className="styled-badges-row">
                    {catBadges.map((badge: any, i: number) => (
                      <div className="styled-badge" key={i}>
                        {badge.iconUrl && (
                          <img src={badge.iconUrl} alt={badge.title} className="styled-badge-icon" width={32} height={32} />
                        )}
                        <div className="styled-badge-content">
                          <div className="styled-badge-title">{badge.title}</div>
                          <div className="styled-badge-desc">{badge.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {catFaqs && catFaqs.length > 0 && (
                  <div className="styled-category-faq">
                    <FaqAccordion
                      faqs={catFaqs.map((faq: any) => ({
                        q: faq.question,
                        a: faq.answer,
                      }))}
                    />
                  </div>
                )}
                {catWhyChoose && catWhyChoose.length > 0 && (
                  <div className="styled-whychoose-section">
                    <div className="styled-whychoose-title">
                      {isSpanish ? "¿Por qué elegir CallTechCare?" : "Why Choose CallTechCare?"}
                    </div>
                    <div className="styled-whychoose-grid">
                      {catWhyChoose.map((item: any, i: number) => (
                        <div className="styled-whychoose-card" key={i}>
                          {item.iconUrl && (
                            <img
                              src={item.iconUrl}
                              alt={item.title}
                              className="styled-whychoose-icon"
                              width={40}
                              height={40}
                            />
                          )}
                          <div className="styled-whychoose-content">
                            <div className="styled-whychoose-cardTitle">
                              {item.title}
                            </div>
                            <div className="styled-whychoose-cardDesc">
                              {item.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* CTA Section */}
                <div className="category-cta-section">
                  <div className="category-cta-title">
                    {isSpanish ? "¿Listo para empezar?" : "Ready to Get Started?"}
                  </div>
                  <div className="category-cta-desc">
                    {isSpanish
                      ? "Nuestros técnicos expertos están listos para ayudarte. Agenda tu servicio hoy y experimenta la diferencia de una instalación profesional."
                      : "Our expert technicians are ready to help. Book your service today and experience the difference professional installation makes."}
                  </div>
                  <div className="category-cta-btn-row">
                    <a
                      href={`tel:${settings.phoneTel}`}
                      className="category-cta-btn"
                      aria-label="Call CallTechCare now"
                    >
                      <SvgIcon
                        name="phone"
                        size={16}
                        color="#fff"
                        className="category-cta-btn-icon"
                      />
                      {isSpanish ? `Llama ahora: ${settings.phoneDisplay}` : `Call Now: ${settings.phoneDisplay}`}
                    </a>
                  </div>
                  <div className="category-cta-trust-row">
                    <div className="category-cta-trust-item">
                      <SvgIcon name="check" size={16} color="var(--brand-teal)" />
                      {isSpanish ? "Sin obligación" : "No obligation"}
                    </div>
                    <div className="category-cta-trust-item">
                      <SvgIcon name="check" size={16} color="var(--brand-teal)" />
                      {isSpanish ? "Inspección gratis" : "Free inspection"}
                    </div>
                    <div className="category-cta-trust-item">
                      <SvgIcon name="check" size={16} color="var(--brand-teal)" />
                      {isSpanish ? "Servicio el mismo día disponible" : "Same-day service available"}
                    </div>
                  </div>
                </div>

                {/* Quick lead form: prominent call button + short form posting to
                    the same /api/quote-request endpoint as the full quote flow. */}
                <QuickLeadForm
                  locale={locale}
                  service={{ category: slug }}
                  phoneTel={settings.phoneTel}
                  phoneDisplay={settings.phoneDisplay}
                />
              </div>
            </main>
          </div>
        </section>

        <RelatedLinksSection links={categoryCameraLinks} />
        <ServiceAreasSection />
        </>
      );
    }
    return notFound();
  }

  const sub: SubService[] = service.subservices ?? [];
  const hasSubServices = sub.length > 0;

  const install = sub.filter((s) => s.serviceType === "installation");
  const support = sub.filter((s) => s.serviceType === "support");

  const modeLabel =
    service.mode === "in-home"
      ? (isSpanish ? "A Domicilio" : "In-Home")
      : service.mode === "online"
      ? (isSpanish ? "En línea" : "Online")
      : service.mode === "both"
      ? (isSpanish ? "En línea + A domicilio" : "Online + In-Home")
      : null;

  if (hasSubServices) {
  return (
    <>
      {/* Breadcrumb schema */}
      {serviceBreadcrumbSchema && (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceBreadcrumbSchema),
        }}
      />
    )}
    {/* Service schema */}
{serviceSchema && (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(serviceSchema),
    }}
  />
)}



      {/* FAQ schema (only if FAQs exist) */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <section className="service-detail">
        <div className="site-container">
          <Link href="/services" className="back-btn">
            {isSpanish ? "← Volver a Servicios" : "← Back to Services"}
          </Link>

          <h1>{isSpanish ? `${displayTitle} en Miami, Broward y el Sur de Florida` : `${displayTitle} in Miami, Broward & South Florida`}</h1>


          {install.length > 0 && (
            <ServiceGroupList
              title={isSpanish ? "Instalación y configuración" : "Installation & Setup"}
              items={install}
              locale={locale}
            />
          )}

          {support.length > 0 && (
            <ServiceGroupList
              title={isSpanish ? "Soporte" : "Support"}
              items={support}
              locale={locale}
            />
          )}
        </div>
      </section>

      <RelatedLinksSection links={cameraRelatedLinks} />
      <ServiceAreasSection />
    </>
  );
}


  const includedList = displayDetails || [];

  return (
  <>
    {serviceBreadcrumbSchema && (
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceBreadcrumbSchema),
        }}
      />
    )}

        {serviceSchema && (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />
    )}

    {/* FAQ schema (only if FAQs exist) — same questions as the visible
        FAQ accordion below, which renders displayFaqs. The subservices
        branch above already emits this; this branch was missing it. */}
    {faqSchema && (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    )}

    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(speakableWebPageSchema),
      }}
    />


    <section className="service-detail">

      <div className="site-container">
        <div className="service-top">
          {service.image?.asset?.url && (
            <div className="service-image">
              <Image
                src={service.image.asset.url}
                alt={service.image.alt || service.title}
                width={700}
                height={400}
                className="service-hero"
                sizes="(max-width: 700px) 100vw, 50vw"
                priority
              />
            </div>
          )}

          <div className="service-card">
            <h1>{isSpanish ? `${displayTitle} en Miami, Broward y el Sur de Florida` : `${displayTitle} in Miami, Broward & South Florida`}</h1>


            {googleRatingSummary && (
              <ServiceRating
                rating={googleRatingSummary.rating}
                reviewsCount={googleRatingSummary.total}
              />
            )}

            {modeLabel && (
              <span className="service-tag">
                {modeLabel}
              </span>
            )}

            {displayDescription && (
              <p className="service-description">{displayDescription}</p>
            )}

            {displayWarranty && (
              <p className="service-warranty">
                {isSpanish
                  ? `Garantía: ${displayWarranty} cuando CallTechCare hace el trabajo y provee los materiales.`
                  : `Warranty: ${displayWarranty} when CallTechCare performs the work and provides the materials.`}
              </p>
            )}

            <hr />

            <div className="service-cta-row">
              <a href={`tel:${settings.phoneTel}`} className="btn-book">
                <span className="mobile-only">
                  {isSpanish ? "Llama ahora" : "Call Now"}
                </span>
                <span className="desktop-only">
                  {isSpanish ? `Llámanos al ${settings.phoneDisplay}` : `Call us at ${settings.phoneDisplay}`}
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Quick lead form: prominent call button + short form posting to
            the same /api/quote-request endpoint as the full quote flow. */}
        <QuickLeadForm
          locale={locale}
          service={{ service: slug }}
          phoneTel={settings.phoneTel}
          phoneDisplay={settings.phoneDisplay}
        />

        <ServiceGalleryClient
          serviceTitle={displayTitle}
          gallery={service.gallery}
          videos={service.videos}
        />

        {includedList.length > 0 && (
          <div className="included-box">
            <h2>{isSpanish ? "Qué incluye" : "What\u0027s Included"}</h2>

            <ul className="included-list">
              {includedList.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <BeforeAfterSection data={displayBeforeAfter} locale={locale} />


        {displayFaqs && <FaqAccordion faqs={displayFaqs} locale={locale} />}

        {/* Related sprinkler services, inside the main content (not just
            the pills at the bottom): the hub and every sprinkler page link
            visibly to the specific problem pages — leaks, valves, timer,
            pump — with a one-line description each. Same single template
            for EN/ES; only the text changes. */}
        {SPRINKLER_SERVICE_LINKS.some((s) => s.slug === slug) && (
          <div className="related-services-box">
            <h2>
              {isSpanish ? "Más servicios de sprinklers" : "More sprinkler services"}
            </h2>
            <p className="related-services-intro">
              {isSpanish
                ? "Reparamos e instalamos cada parte de tu sistema de riego:"
                : "We repair and install every part of your irrigation system:"}
            </p>
            <div className="related-services-grid">
              {relatedServices.map((s) => (
                <Link
                  key={s.slug}
                  href={serviceHref(s.slug, locale)}
                  className="related-service-card"
                >
                  <span className="related-service-title">{s.title}</span>
                  {s.description && (
                    <span className="related-service-desc">{s.description}</span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

      <ServiceReviewsWrapper slug={slug} locale={locale} />

      </div>

    </section>

    {SPRINKLER_SERVICE_LINKS.some((s) => s.slug === slug) && (
      <section className="service-areas-section">
        <div className="site-container">
          <div className="service-areas-inner">
            <h2 className="service-areas-title">
              {isSpanish ? "Servicios relacionados de sprinklers" : "Related sprinkler services"}
            </h2>
            <div className="service-areas-pills">
              {SPRINKLER_SERVICE_LINKS.filter((s) => s.slug !== slug).map((s) => {
                const pillTitle =
                  isSpanish && sprinklerTitlesEs[s.slug]
                    ? sprinklerTitlesEs[s.slug]
                    : s.title;
                return (
                  <Link
                    key={s.slug}
                    href={serviceHref(s.slug, locale)}
                    className="service-area-pill"
                    aria-label={pillTitle}
                  >
                    {pillTitle}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    )}

    <RelatedLinksSection links={cameraRelatedLinks} />
    <ServiceAreasSection />
  </>
  );
}
