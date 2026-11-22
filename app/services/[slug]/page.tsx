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
import { serviceCardText } from "@/lib/serviceCardText";
import BeforeAfterSection from "@/components/BeforeAfterSection";
import CoverageMap from "@/components/sections/CoverageMap";
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

export const revalidate = 3600;

// Prerender every service page at build time so the HTML is served from
// the edge cache (same pattern as /locations/[slug]). Without this the
// route stays dynamic even with revalidate=3600: Vercel answers every
// request with Cache-Control: no-store and X-Vercel-Cache: MISS. A Sanity
// blip at build time returns [] instead of failing the build — unlisted
// slugs still render on demand.
export async function generateStaticParams() {
  try {
    const services = await sanity.fetch<{ slug: string }[]>(
      `*[_type == "service" && defined(slug.current)]{ "slug": slug.current }`
    );
    return (services ?? [])
      .map((s) => ({ slug: s.slug }))
      .filter((s) => s.slug);
  } catch {
    return [];
  }
}

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
  { slug: "drip-irrigation-installation", title: "Drip Irrigation Installation" },
  { slug: "backflow-testing", title: "Backflow Testing" },
  { slug: "sprinkler-head-replacement", title: "Sprinkler Head Replacement" },
  { slug: "commercial-irrigation-hoa-services", title: "Commercial Irrigation & HOA Services" },
];

// Splits a service description into a short hero intro and the remainder,
// from the SAME text, so a sentence is never shown twice and none is lost.
// The hero shows the first 1–2 sentences (~maxLen, ending with an
// ellipsis when cut); the "About this service" section shows the rest,
// keeping its paragraph breaks. When the whole description fits in the
// intro, the remainder is empty and the About section hides (nothing
// left to say). Works for EN and ES alike.
function splitDescription(
  text: string | undefined,
  maxLen = 300
): { excerpt: string | undefined; remainder: string[] } {
  if (!text) return { excerpt: undefined, remainder: [] };
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((para) => para.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const flat = paragraphs.join(" ");
  if (!flat) return { excerpt: undefined, remainder: [] };
  if (flat.length <= maxLen) return { excerpt: flat, remainder: [] };
  // Accumulate whole sentences while they fit within maxLen.
  const sentences = flat.match(/[^.!?]+[.!?]+["”)]?/g) ?? [flat];
  let out = "";
  for (const s of sentences) {
    const next = out ? `${out} ${s.trim()}` : s.trim();
    if (next.length <= maxLen) out = next;
    else break;
  }
  // First sentence alone is longer than maxLen: cut it at a word boundary.
  if (!out) {
    const cut = flat.slice(0, maxLen);
    const lastSpace = cut.lastIndexOf(" ");
    out = lastSpace > 40 ? cut.slice(0, lastSpace) : cut;
  }
  const excerpt = `${out.trimEnd()}…`;
  // Remainder: everything after the excerpt, keeping paragraph breaks.
  // The excerpt (minus "…") is a prefix of flat, so its length is the
  // exact split point; walk the paragraphs to find where it lands.
  const remainder: string[] = [];
  let offset = 0;
  for (let i = 0; i < paragraphs.length; i++) {
    const para = paragraphs[i];
    const paraEnd = offset + para.length;
    if (out.length <= paraEnd) {
      const rest = para.slice(out.length - offset).trim();
      if (rest) remainder.push(rest);
      for (let j = i + 1; j < paragraphs.length; j++) {
        remainder.push(paragraphs[j]);
      }
      break;
    }
    offset = paraEnd + 1; // +1 for the space joining paragraphs in flat
  }
  return { excerpt, remainder };
}

// Related-services cards show a SHORT excerpt of the service description
// (first 1–2 sentences, ~150 chars max, ending with an ellipsis) —
// never the full description. The full text stays in Sanity untouched:
// it is the page's SEO content. The card only teases it, so all cards
// stay short and roughly the same height. Works for EN and ES alike.
function shortExcerpt(text: string | undefined, maxLen = 150): string | undefined {
  return splitDescription(text, maxLen).excerpt;
}

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

    // Spanish twin exists for the home-security group (its ES page
    // already emits hreflang back to this URL); other categories keep
    // canonical only so no false hreflang is emitted.
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
  const settings = await resolveSiteSettings();

  const pageUrl =
    locale === "es"
      ? `https://www.calltechcare.com${serviceHref(slug, "es")}`
      : `https://www.calltechcare.com/services/${slug}`;
  // Plain WebPage block (no speakable): Google only supports the
  // speakable feature for news content, and these service pages are
  // not news — the SpeakableSpecification markup was flagged invalid
  // in the SEMrush Site Audit, so it was removed 15 Nov 2026.
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: pageUrl,
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

  // The city pills used to live here (featured locations + the 33
  // sprinkler-city links), repeating the same cities the interactive
  // map already shows. Removed 19 Nov 2026, and the leftover title
  // block went with them: a bare "Service Areas" heading over an
  // empty dark band. The section is now just the map itself, with
  // its own "Where We Work" heading — the same block as the home
  // page, title and map together in one panel.
  const ServiceAreasSection = () => (
    serviceAreas.length > 0 ? (
      <CoverageMap locale={locale} showHeading={true} />
    ) : null
  );

  const service = await sanity.fetch(
    `*[_type == "service" && slug.current == $slug][0]{
      title,
      titleEs,
      h1,
      h1Es,
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
          titleEs,
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
  // Testimonials, gallery and videos have no Spanish counterpart by
  // design (customer words and media stay verbatim); before/after
  // comparison TITLES do (titleEs on each comparison, English fallback).
  const displayTitle =
    isSpanish && service?.titleEs ? service.titleEs : service?.title;
  // Optional H1 override (Sanity h1/h1Es). When empty, the H1 falls back
  // to the service title plus the location line.
  const displayH1 =
    (isSpanish ? service?.h1Es || service?.h1 : service?.h1) ||
    (isSpanish
      ? `${displayTitle} en Miami, Broward y el Sur de Florida`
      : `${displayTitle} in Miami, Broward & South Florida`);
  const displayDescription =
    isSpanish && service?.descriptionEs
      ? service.descriptionEs
      : service?.description;
  // Hero/About split, computed once: the hero shows the intro, the About
  // section shows the rest — same text, split once, so no sentence is
  // repeated (PR #469 showed the intro verbatim in both places).
  // Cap 250: competitor heroes run 1–2 sentences (20–100 words), and no
  // competitor puts the full description in the hero.
  const descriptionSplit = splitDescription(displayDescription, 250);
  const displayWarranty =
    isSpanish && service?.warrantyEs ? service.warrantyEs : service?.warranty;
  const displayDetails =
    isSpanish && service?.detailsEs?.length
      ? service.detailsEs
      : service?.details;
  const displayFaqs =
    isSpanish && service?.faqsEs?.length ? service.faqsEs : service?.faqs;
  const displayBeforeAfter = (() => {
    const base = service?.beforeAfter;
    if (!isSpanish || !service?.beforeAfterEs) return base;
    return {
      ...base,
      heading:
        service.beforeAfterEs.heading || base?.heading,
      subheading:
        service.beforeAfterEs.subheading || base?.subheading,
      comparisons: (base?.comparisons ?? []).map((c: any) => ({
        ...c,
        title: c?.titleEs?.trim() ? c.titleEs : c?.title,
      })),
    };
  })();
  // Related sprinkler services: title + short description per service, in
  // both languages, for the related-services cards inside the main content
  // (below). One fetch serves both locales; the current service is
  // excluded at render time.
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
      `*[_type == "service" && slug.current in ["sprinkler-repair-and-installation", "emergency-sprinkler-repair", "sprinkler-leak-repair", "sprinkler-valve-repair", "sprinkler-timer-installation", "sprinkler-pump-replacement", "new-irrigation-well-installation", "rain-sensor-installation", "wifi-sprinkler-controller-upgrade", "new-irrigation-installation", "wireless-camera-installation", "sprinkler-maintenance-plan", "drip-irrigation-installation", "backflow-testing", "sprinkler-head-replacement", "commercial-irrigation-hoa-services"]]{ "slug": slug.current, title, titleEs, description, descriptionEs }`
    );
    for (const t of (related as any[]) ?? []) {
      if (t?.slug) relatedServiceInfo[t.slug] = t;
    }
  }
  // Cards for the related-services section: every sprinkler service except
  // the current one, title + short excerpt in the page locale (see
  // shortExcerpt above — the full description stays on the service page).
  const relatedServices = SPRINKLER_SERVICE_LINKS.filter(
    (s) => s.slug !== slug
  ).map((s) => {
    const info = relatedServiceInfo[s.slug];
    return {
      slug: s.slug,
      title:
        isSpanish && info?.titleEs ? info.titleEs : info?.title ?? s.title,
      description:
        serviceCardText(s.slug, isSpanish ? "es" : "en") ??
        shortExcerpt(
          isSpanish && info?.descriptionEs
            ? info.descriptionEs
            : info?.description
        ),
    };
  });

  // No related-services pills on the camera service page (9 Nov 2026):
  // the camera is the only service in the "Home Security" category, so
  // the only possible link was its own parent group — the section just
  // pointed back at the same thing. RelatedLinksSection renders nothing
  // for an empty list, so this removes the section from this page only;
  // the sprinkler pages keep their "More sprinkler services" cards and
  // the home-security group page keeps its own pills.
  const cameraRelatedLinks: { href: string; label: string }[] = [];

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
      __html: JSON.stringify(webPageSchema),
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
                  {/* 1-year warranty with the exact condition (audit fix
                      2026-11-10): the category page had no warranty mention. */}
                  <p className="category-warranty">
                    {isSpanish
                      ? "Garantía de mano de obra de 1 año cuando realizamos el trabajo y proveemos los materiales."
                      : "1-year workmanship warranty when we perform the work and provide the materials."}
                  </p>
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
                          <SvgIcon name="checkmark-circle" size={20} color="#c9a227" />
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
                    {/* The short form is at the bottom of this page: this
                        button scrolls to it instead of showing it above
                        the content. */}
                    <a href="#quick-lead" className="category-cta-btn category-cta-btn-dark">
                      {isSpanish ? "Pide tu inspección gratis" : "Get your free inspection"}
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

  // No badge for in-home services: every job is done at the customer's
  // property by definition, so the "In-Home" tag was redundant. The
  // Online / Online + In-Home labels stay for services that use them.
  const modeLabel =
    service.mode === "online"
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

          <h1>{displayH1}</h1>


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
        __html: JSON.stringify(webPageSchema),
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
            <h1>{displayH1}</h1>


            {googleRatingSummary && (
              <ServiceRating
                rating={googleRatingSummary.rating}
                reviewsCount={googleRatingSummary.total}
                locale={locale}
              />
            )}

            {modeLabel && (
              <span className="service-tag">
                {modeLabel}
              </span>
            )}

            {descriptionSplit.excerpt && (
              <p className="service-description">{descriptionSplit.excerpt}</p>
            )}

            {displayWarranty && (
              <p className="service-warranty">
                {isSpanish
                  ? `Garantía: ${displayWarranty} de garantía de mano de obra cuando CallTechCare hace el trabajo y provee los materiales.`
                  : `Warranty: ${displayWarranty} workmanship warranty when CallTechCare performs the work and provides the materials.`}
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
              {/* Emergency pages have no callback form (see the emergency
                  block below): the call button above is the action. Every
                  other service page scrolls to the short form at the
                  bottom instead of showing it above the content. */}
              {slug !== "emergency-sprinkler-repair" && (
                <a href="#quick-lead" className="btn-book btn-book--secondary">
                  {isSpanish ? "Pide tu inspección gratis" : "Get your free inspection"}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Remainder of the description, below the hero: the hero card
            shows only the short intro (first 1–2 sentences) so the wall
            of text no longer fills the screen. The rest of the text
            lives here — every word stays on the page exactly once,
            nothing repeated, nothing deleted. When the whole description
            fits in the intro, there is no remainder and this section
            hides. */}
        {descriptionSplit.remainder.length > 0 && (
          <div className="service-about-box">
            <h2>{isSpanish ? "Sobre este servicio" : "About this service"}</h2>
            {descriptionSplit.remainder.map((para: string, i: number) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        )}

        {/* Emergency pages: no slow callback form. A big call button, a
            real text-message link and the shut-off steps dominate
            instead — the page says "call or text", so both are one tap
            away. Every other service page shows the short form further
            down (after the service content, before the reviews). */}
        {slug === "emergency-sprinkler-repair" && (
          <section className="quick-lead" aria-labelledby="emergency-cta-title">
            <div className="quick-lead__card">
              <h2 className="quick-lead__title" id="emergency-cta-title">
                {isSpanish ? "¿Emergencia? Llámanos ahora" : "Emergency? Call us now"}
              </h2>
              <p className="quick-lead__sub">
                {isSpanish
                  ? "Te atendemos hoy dentro del horario."
                  : "We help you today within business hours."}
              </p>
              <a href={`tel:${settings.phoneTel}`} className="quick-lead__call">
                <SvgIcon name="phone" size={20} color="#fff" />
                <span>
                  {isSpanish ? `Llama ahora: ${settings.phoneDisplay}` : `Call now: ${settings.phoneDisplay}`}
                </span>
              </a>
              <p className="emergency-cta__sms">
                <a href={`sms:${settings.phoneTel}`}>
                  {isSpanish ? "o escríbenos por mensaje" : "or text us"}
                </a>
              </p>
              <p className="quick-lead__trust">
                {isSpanish
                  ? `${settings.hoursWeekdayLabelEs}: ${settings.hoursWeekdayTime} · ${settings.hoursWeekendLabelEs}: ${settings.hoursWeekendTime}`
                  : `${settings.hoursWeekdayLabel}: ${settings.hoursWeekdayTime} · ${settings.hoursWeekendLabel}: ${settings.hoursWeekendTime}`}
              </p>
              <p className="quick-lead__sub">
                {isSpanish
                  ? "Mientras tanto: cierra el agua en la llave principal y apaga el controlador."
                  : "While you wait: shut off the water at the main shutoff and turn off the controller."}
              </p>
            </div>
          </section>
        )}

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

        {/* What to Expect: 4 numbered steps, same on every service page,
            built only from already-approved business facts — free
            inspection, clear upfront estimate with no pressure, same-day
            work within business hours when possible, testing before
            leaving + the conditional 1-year workmanship warranty. No
            prices, no 24/7, no certified/licensed language. Follows the
            competitor consensus (Conserva / GroundLogic / Pacific all
            show the visit as numbered steps right after What's
            Included). */}
        <div className="service-expect-box">
          <h2>{isSpanish ? "Qué esperar" : "What to Expect"}</h2>
          <ol className="service-expect-list">
            {(isSpanish
              ? [
                  "Empezamos con una inspección gratis de tu sistema.",
                  "Revisamos todo y te damos un estimado claro por adelantado, sin presión.",
                  "Cuando es posible, hacemos el trabajo el mismo día, dentro del horario.",
                  "Probamos todo antes de irnos. El trabajo tiene garantía de mano de obra de 1 año cuando CallTechCare hace el trabajo y provee los materiales.",
                ]
              : [
                  "We start with a free inspection of your system.",
                  "We check everything and give you a clear upfront estimate — with no pressure.",
                  "When possible, we do the work the same day, within business hours.",
                  "We test everything before we leave. The work carries a 1-year workmanship warranty when CallTechCare performs the work and provides the materials.",
                ]
            ).map((step: string, i: number) => (
              <li key={i}>
                <span className="service-expect-num" aria-hidden="true">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <BeforeAfterSection data={displayBeforeAfter} locale={locale} />


        {displayFaqs && <FaqAccordion faqs={displayFaqs} locale={locale} />}

        {/* Related sprinkler services, inside the main content: the hub
            and every sprinkler page link visibly to the specific problem
            pages — leaks, valves, timer, pump — with a one-line
            description each. Same single template for EN/ES; only the
            text changes. */}
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
            {/* Editorial index rows (numbered, hairline-separated) instead
                of a card grid — same links and same text. */}
            <ol className="heritage-related-list">
              {relatedServices.map((s, i) => (
                <li key={s.slug} className="heritage-related-row">
                  <Link href={serviceHref(s.slug, locale)} className="heritage-related-link">
                    <span className="heritage-related-num" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="heritage-related-text">
                      <span className="heritage-related-title">{s.title}</span>
                      {s.description && (
                        <span className="heritage-related-desc">{s.description}</span>
                      )}
                    </span>
                    <span className="heritage-related-arrow" aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        )}

      {/* Quick lead form, AFTER the service content (not above it):
          prominent call button + short form posting to the same
          /api/quote-request endpoint as the full quote flow, firing the
          same Google Ads conversion. Emergency pages have no form (see
          the emergency block above). */}
      {slug !== "emergency-sprinkler-repair" && (
        <QuickLeadForm
          locale={locale}
          service={{ service: slug }}
          phoneTel={settings.phoneTel}
          phoneDisplay={settings.phoneDisplay}
        />
      )}

      <ServiceReviewsWrapper slug={slug} locale={locale} />

      </div>

    </section>

    <RelatedLinksSection links={cameraRelatedLinks} />
    <ServiceAreasSection />
  </>
  );
}
