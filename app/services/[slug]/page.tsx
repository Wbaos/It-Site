import CategoryServicesAccordion from "./CategoryServicesAccordion";
import CategorySidebarClient from "./CategorySidebarClient";
import { notFound } from "next/navigation";
import { sanity } from "@/lib/sanity";
import Link from "next/link";
import Image from "next/image";
import SvgIcon from "@/components/common/SvgIcons";
import TestimonialsList from "@/components/common/TestimonialsList";
import ServiceReviewsWrapper from "@/components/ServiceReviewsWrapper";
import ServiceRating from "@/components/ServiceRating";
import BookButtonWatcher from "@/components/BookButtonWatcher";
import FaqAccordion from "@/components/FaqAccordion";
import ServiceGroupList from "@/components/ServiceGroupList";
import BeforeAfterSection from "@/components/BeforeAfterSection";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";


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
      image { asset->{ url }, alt }
    }`,
    { slug }
  );

    if (service) {
    return {
      title: `${service.title} in Miami & Broward | CallTechCare`,
      description:
        service.description ||
        `Professional ${service.title} service in Miami, Homestead, Fort Lauderdale, and Broward County.`,
      alternates: { canonical: url },
      openGraph: {
        title: `${service.title} in Miami & Broward | CallTechCare`,
        description:
          service.description ||
          `Professional ${service.title} service in Miami, Homestead, Fort Lauderdale, and Broward County.`,
        url,
        images: service.image?.asset?.url
          ? [{ url: service.image.asset.url, alt: service.image.alt || service.title }]
          : [],
      },
      twitter: {
        title: `${service.title} in Miami & Broward | CallTechCare`,
        description:
          service.description ||
          `Professional ${service.title} service in Miami, Homestead, Fort Lauderdale, and Broward County.`,
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
      `Professional ${category.title} services in Miami, Homestead, Fort Lauderdale, and Broward County.`;

    return {
      title,
      description,
      alternates: { canonical: url },
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
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const pageUrl = `https://www.calltechcare.com/services/${slug}`;
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
          <h2 className="service-areas-title">Service Areas</h2>
          <p className="service-areas-subtitle">
            Serving communities across Miami-Dade and Broward County.
          </p>
          <div className="service-areas-pills">
            {serviceAreas.map((area) => (
              <Link
                key={area.slug}
                href={`/locations/${area.slug}`}
                className="service-area-pill"
                aria-label={`View services in ${area.city}`}
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
        </div>
      </div>
    </section>
    ) : null
  );

  const service = await sanity.fetch(
    `*[_type == "service" && slug.current == $slug][0]{
      title,
      price,
      showPrice,
      pricingModel,
      hourlyConfig{minimumHours, maximumHours, billingIncrement},
      description,
      mode,
      category-> { title },
      rating,
      reviewsCount,
      image { asset->{ url }, alt },
      details,
      faqs,
      beforeAfter{
        heading,
        subheading,
        comparisons[]{
          title,
          beforeImage{asset->{url}, alt},
          afterImage{asset->{url}, alt}
        }
      },
      testimonials[] | order(date desc) {
        name,
        text,
        date,
        rating
      },

      "subservices": *[_type == "service" && parentService._ref == ^._id]{
        title,
        "slug": slug.current,
        price,
        serviceType,
        showPrice,
        pricingModel,
        hourlyConfig{minimumHours, maximumHours, billingIncrement},
        popular,
        description
      }
    }`,
    { slug }
  );

 const serviceBreadcrumbSchema = service
  ? {
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
          name: service.title,
          item: `https://www.calltechcare.com/services/${slug}`,
        },
      ],
    }
  : null;


  const faqSchema = (() => {
    if (!service?.faqs?.length) return null;

    const mainEntity = service.faqs
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
              name: service.title,
              url: `https://www.calltechcare.com/services/${slug}`,
              ...(service.image?.asset?.url && {
                image: service.image.asset.url,
              }),
              description:
                service.description ||
                `Professional ${service.title} service in Miami, Homestead, Fort Lauderdale, and Broward County.`,
              areaServed: {
                "@type": "Place",
                name: "Miami, Homestead, Fort Lauderdale, Broward County",
              },
              provider: {
                "@type": "LocalBusiness",
                "@id": "https://www.calltechcare.com/#business",
                name: "CallTechCare",
                url: "https://www.calltechcare.com",
              },
              ...(service.showPrice && service.price != null
                ? {
                    offers: {
                      "@type": "Offer",
                      priceCurrency: "USD",
                      price: service.price,
                      url: `https://www.calltechcare.com/services/${slug}`,
                      availability: "https://schema.org/InStock",
                    },
                  }
                : {}),
              ...(service.rating && service.reviewsCount
                ? {
                    aggregateRating: {
                      "@type": "AggregateRating",
                      ratingValue: service.rating,
                      reviewCount: service.reviewsCount,
                    },
                  }
                : {}),
            }
          : null;

  if (!service) {
    // Fetch serviceGroups for the category and their services
    const [serviceGroups, allCategories, category] = await Promise.all([
      sanity.fetch(
        `*[_type == "serviceGroup" && category->slug.current == $slug]|order(order asc){
          title,
          slug,
          description,
          "services": *[_type == "service" && group._ref == ^._id]{
            title,
            slug,
            description,
            price,
            showPrice,
            pricingModel,
            popular
          }
        }`,
        { slug }
      ),
      sanity.fetch(
        `*[_type == "category"]|order(title asc){
          title,
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
          description,
          seoTitle,
          metaDescription,
          tagline,
          "jobsCompletedValue": jobsCompleted.value,
          "jobsCompletedIconUrl": jobsCompleted.icon.asset->url,
          "customerRatingValue": customerRating.value,
          "customerRatingIconUrl": customerRating.icon.asset->url,
          "yearsExperienceValue": yearsExperience.value,
          "yearsExperienceIconUrl": yearsExperience.icon.asset->url,
          about,
          features,
          faqs[]{
            question,
            answer
          },
          whyChoose[]{
            title,
            description,
            "iconUrl": icon.asset->url
          },
          badges[]{
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
        name: `${category.title} in Miami & Broward`,
        description:
          category.metaDescription ||
          category.tagline ||
          category.description ||
          `Professional ${category.title} services in Miami, Homestead, Fort Lauderdale, and Broward County.`,

        areaServed: {
          "@type": "Place",
          name: "Miami, Homestead, Fort Lauderdale, Broward County",
        },

        provider: {
          "@type": "LocalBusiness",
          "@id": "https://www.calltechcare.com/#business",
          name: "CallTechCare",
          url: "https://www.calltechcare.com",
        },
      };

      const categoryFaqMainEntity = (category?.faqs || [])
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
                    {category.title} in Miami, Broward & South Florida
                  </h1>
                  {category.tagline && (
                    <p className="category-desc">{category.tagline}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Sidebar */}
          <CategorySidebarClient categories={allCategories} selectedSlug={slug} />
          <div className="category-main-layout">
            {/* Main Content */}
            <main className="category-main-content">
              {serviceGroups.length > 0 ? (
                <CategoryServicesAccordion serviceGroups={serviceGroups} />
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
                        <img src={category.jobsCompletedIconUrl} alt="Jobs Completed" className="styled-stat-icon" width={32} height={32} />
                      )}
                      <div className="styled-stat-value">{category.jobsCompletedValue}</div>
                      <div className="styled-stat-label">Jobs Completed</div>
                    </div>
                  )}
                  {category.customerRatingValue && (
                    <div className="styled-stat">
                      {category.customerRatingIconUrl && (
                        <img src={category.customerRatingIconUrl} alt="Customer Rating" className="styled-stat-icon" width={32} height={32} />
                      )}
                      <div className="styled-stat-value">{category.customerRatingValue}</div>
                      <div className="styled-stat-label">Customer Rating</div>
                    </div>
                  )}
                  {category.yearsExperienceValue && (
                    <div className="styled-stat">
                      {category.yearsExperienceIconUrl && (
                        <img src={category.yearsExperienceIconUrl} alt="Years Experience" className="styled-stat-icon" width={32} height={32} />
                      )}
                      <div className="styled-stat-value">{category.yearsExperienceValue}</div>
                      <div className="styled-stat-label">Experience</div>
                    </div>
                  )}
                </div>
                {category.about && (
                  <div className="styled-about-features-row">
                    <div className="styled-about-box">
                      <div className="styled-about-title">About This Service</div>
                      <div className="styled-about-desc">
  <PortableText
    value={category.about}
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

                {category.features && category.features.length > 0 && (
                  <div className="styled-features-box">
                    <div className="styled-features-title">What&apos;s Included</div>
                    <ul className="styled-features-list">
                      {category.features.map((f: string, i: number) => (
                        <li key={i} className="styled-feature-item">
                          <SvgIcon name="checkmark-circle" size={20} color="#10b981" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {category.badges && category.badges.length > 0 && (
                  <div className="styled-badges-row">
                    {category.badges.map((badge: any, i: number) => (
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

                {category.faqs && category.faqs.length > 0 && (
                  <div className="styled-category-faq">
                    <FaqAccordion
                      faqs={category.faqs.map((faq: any) => ({
                        q: faq.question,
                        a: faq.answer,
                      }))}
                    />
                  </div>
                )}
                {category.whyChoose && category.whyChoose.length > 0 && (
                  <div className="styled-whychoose-section">
                    <div className="styled-whychoose-title">
                      Why Choose CallTechCare?
                    </div>
                    <div className="styled-whychoose-grid">
                      {category.whyChoose.map((item: any, i: number) => (
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
                    Ready to Get Started?
                  </div>
                  <div className="category-cta-desc">
                    Our expert technicians are ready to help. Book your service today and experience the difference professional installation makes.
                  </div>
                  <div className="category-cta-btn-row">
                    <Link href="/request-quote" className="category-cta-btn">
                      Get Your Free Quote
                      <SvgIcon
                        name="arrow-right-simple"
                        size={16}
                        color="#fff"
                        className="category-cta-btn-icon"
                      />
                    </Link>
                    <a
                      href="tel:+17863662729"
                      className="category-cta-btn"
                      aria-label="Call CallTechCare now"
                    >
                      <SvgIcon
                        name="phone"
                        size={16}
                        color="#fff"
                        className="category-cta-btn-icon"
                      />
                      Call Now: (786) 366-2729
                    </a>
                  </div>
                  <div className="category-cta-trust-row">
                    <div className="category-cta-trust-item">
                      <SvgIcon name="check" size={16} color="var(--brand-teal)" />
                      No obligation
                    </div>
                    <div className="category-cta-trust-item">
                      <SvgIcon name="check" size={16} color="var(--brand-teal)" />
                      Free estimates
                    </div>
                    <div className="category-cta-trust-item">
                      <SvgIcon name="check" size={16} color="var(--brand-teal)" />
                      Same-day service available
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </section>

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
      ? "In-Home"
      : service.mode === "online"
      ? "Online"
      : service.mode === "both"
      ? "Online + In-Home"
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
            ← Back to Services
          </Link>

          <h1>{service.title} in Miami, Broward & South Florida</h1>


          {install.length > 0 && (
            <ServiceGroupList title="Installation & Setup" items={install} />
          )}

          {support.length > 0 && (
            <ServiceGroupList title="Support" items={support} />
          )}
        </div>
      </section>

      <ServiceAreasSection />
    </>
  );
}


  const includedList = service.details || [];

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
                priority
              />
            </div>
          )}

          <div className="service-card">
            <h1>{service.title} in Miami, Broward & South Florida</h1>


            {service.rating && (
              <ServiceRating
                rating={service.rating}
                reviewsCount={service.reviewsCount}
              />
            )}

            {modeLabel && (
              <span className="service-tag">
                {modeLabel}
              </span>
            )}

            {service.description && (
              <p className="service-description">{service.description}</p>
            )}

            <hr />

            {service.showPrice && service.price != null && (
              <div className="service-price">
                <span>${service.price}</span>
                <small>
                  / {service.pricingModel === "hourly" ? "hr (starting)" : "starting price"}
                </small>
              </div>
            )}

            {service.showPrice && service.price != null ? (
              <Link href={`/book/${slug}`} className="btn-book">
                Book Service Now
              </Link>
            ) : (
              <a href="tel:+17863662729" className="btn-book">
                Call for Free Quote
              </a>
            )}
          </div>
        </div>

        {includedList.length > 0 && (
          <div className="included-box">
            <h2>What&apos;s Included</h2>

            <ul className="included-list">
              {includedList.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {service.faqs && <FaqAccordion faqs={service.faqs} />}

        <BeforeAfterSection data={service.beforeAfter} />

        {service.testimonials?.length > 0 && (
          <TestimonialsList
            items={service.testimonials.map((t: any) => ({
              name: t.name,
              text: t.text,
              rating: t.rating ?? 5,
              verified: true,
              date: t.date,
            }))}
            title="Customer Reviews"
          />
        )}

        <ServiceReviewsWrapper slug={slug} />
      </div>

      <BookButtonWatcher />
      <div id="floating-book-container" className="floating-book-hidden">
        {service.showPrice && service.price != null ? (
          <Link href={`/book/${slug}`} className="floating-book-btn">
            Book Service
          </Link>
        ) : (
          <a href="tel:+17863662729" className="floating-book-btn">
            Call for Quote
          </a>
        )}
      </div>
    </section>

    <ServiceAreasSection />
  </>
  );
}
