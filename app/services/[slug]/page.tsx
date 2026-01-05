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

type SubService = {
  title: string;
  slug: string;
  price?: number;
  serviceType?: "installation" | "support";
  showPrice?: boolean;
  popular?: boolean;
  description?: string;
};

export const revalidate = 60;

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
        popular,
        description
      }
    }`,
    { slug }
  );


  if (!service) {
    const [category, allCategories] = await Promise.all([
      sanity.fetch(
        `*[_type == "category" && slug.current == $slug][0]{
          title,
          description,
          tagline,
          jobsCompleted,
          customerRating,
          yearsExperience,
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
          },
          "services": *[
            _type == "service" &&
            references(^._id) &&
            !defined(parentService)
          ]|order(title asc){
            title,
            slug,
            description,
            price,
            showPrice,
            popular,
            serviceType,
            "subservices": *[_type == "service" && parentService._ref == ^._id]{
              title,
              "slug": slug.current,
              price,
              serviceType,
              showPrice,
              popular,
              description
            }
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
      )
    ]);
    if (category) {
      const categoryServices = category.services || [];
      return (
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
                  <h1 className="category-title">{category.title}</h1>
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
              {categoryServices.length > 0 ? (
                <CategoryServicesAccordion services={categoryServices} />
              ) : (
                <p className="category-no-services">No services found in this category.</p>
              )}
              {/* --- Extra Category Info Section --- */}
              <div className="styled-extra-info">
                <div className="styled-stats-row">
                  {category.jobsCompleted && (
                    <div className="styled-stat">
                      <SvgIcon name="user-avatar" size={32} color="#10b981" className="styled-stat-icon" />
                      <div className="styled-stat-value">{category.jobsCompleted}</div>
                      <div className="styled-stat-label">Jobs Completed</div>
                    </div>
                  )}
                  {category.customerRating && (
                    <div className="styled-stat">
                      <SvgIcon name="star" size={32} color="#fbbf24" className="styled-stat-icon" />
                      <div className="styled-stat-value">{category.customerRating}</div>
                      <div className="styled-stat-label">Customer Rating</div>
                    </div>
                  )}
                  {category.yearsExperience && (
                    <div className="styled-stat">
                      <SvgIcon name="verified-check" size={32} color="#38bdf8" className="styled-stat-icon" />
                      <div className="styled-stat-value">{category.yearsExperience}</div>
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
                        <div className="styled-features-title">What's Included</div>
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
      <section className="service-detail">
        <div className="site-container">
          <Link href="/services" className="back-btn">
            ← Back to Services
          </Link>

          <h1>{service.title}</h1>

          {install.length > 0 && (
            <ServiceGroupList title="Installation & Setup" items={install} />
          )}

          {support.length > 0 && (
            <ServiceGroupList title="Support" items={support} />
          )}
        </div>
      </section>
    );
  }

  const includedList = service.details || [];

  return (
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
            <h1>{service.title}</h1>

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
                <span>${service.price}</span> <small>/ setup</small>
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
            title={`What Clients Say About ${service.title}`}
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
  );
}
