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
      description
    }`,
    { slug }
  );

    if (service) {
    return {
      title: `${service.title} | CallTechCare`,
      description:
        service.description ||
        "Professional in-home service provided by CallTechCare across South Florida.",
      alternates: { canonical: url },
      openGraph: {
        title: `${service.title} | CallTechCare`,
        description: service.description,
        url,
      },
      twitter: {
        title: `${service.title} | CallTechCare`,
        description: service.description,
      },
    };
  }

  // Otherwise category
  const category = await sanity.fetch(
    `*[_type == "category" && slug.current == $slug][0]{
      title,
      description
    }`,
    { slug }
  );

    if (category) {
    const title = `${category.title} Services`;
    const description =
      category.description ||
      `Explore ${category.title} services offered by CallTechCare across South Florida.`;

    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: { title, description, url },
      twitter: { title, description },
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


  const faqSchema =
    service?.faqs?.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: service.faqs.map((faq: any) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
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
          tagline,
          "jobsCompletedValue": jobsCompleted.value,
          "jobsCompletedIconUrl": jobsCompleted.icon.asset->url,
          "customerRatingValue": customerRating.value,
          "customerRatingIconUrl": customerRating.icon.asset->url,
          "yearsExperienceValue": yearsExperience.value,
          "yearsExperienceIconUrl": yearsExperience.icon.asset->url,
          about,
          features,
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

      return (
        <>
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(categoryBreadcrumbSchema),
    }}
  />

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
                    {category.title} Services in South Florida
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

              <div className="category-header-stats">
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
              </div>

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
                {(category.about || (category.features && category.features.length > 0)) && (
                  <div className="styled-about-features-row">
                    {category.about && (
                      <div className="styled-about-box">
                        <div className="styled-about-title">About This Service</div>
                        <div className="styled-about-desc">{category.about}</div>
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
                {/* CTA Section */}
                <div className="category-cta-section">
                  <div className="category-cta-title">
                    Ready to Get Started?
                  </div>
                  <div className="category-cta-desc">
                    Our expert technicians are ready to help. Book your service today and experience the difference professional installation makes.
                  </div>
                  <div className="category-cta-btn-row">
                    <Link href="/#contact" className="category-cta-btn">Contact Us</Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </section>
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

          <h1>{service.title} in South Florida</h1>

          {install.length > 0 && (
            <ServiceGroupList title="Installation & Setup" items={install} />
          )}

          {support.length > 0 && (
            <ServiceGroupList title="Support" items={support} />
          )}
        </div>
      </section>
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
            <h1>{service.title} in South Florida</h1>

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

            {service.showPrice && service.price && (
              <div className="service-price">
                <span>${service.price}</span>{" "}
                <small>{service.pricingModel === "hourly" ? "/ hr" : "/ setup"}</small>
              </div>
            )}

            <Link href={`/services/${slug}/book/step1`} className="btn-book">
              BOOK THIS SERVICE
            </Link>
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
        <Link href={`/services/${slug}/book/step1`} className="floating-book-btn">
          BOOK THIS SERVICE
        </Link>
      </div>
    </section>
  </>
  );
}
