import { notFound } from "next/navigation";
import { sanity } from "@/lib/sanity";
import Link from "next/link";
import Image from "next/image";
import TestimonialsList from "@/components/common/TestimonialsList";
import ServiceReviewsWrapper from "@/components/ServiceReviewsWrapper";
import ServiceRating from "@/components/ServiceRating";
import BookButtonWatcher from "@/components/BookButtonWatcher";

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
      }
    }`,
    { slug }
  );

  if (!service) return notFound();

  return (
    <section className="service-detail">
      <div className="site-container">
        {/* === Top Layout: Hero + Info Card === */}
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

            {(service.mode || service.category?.title) && (
              <span className="service-tag">
                {service.mode === "in-home"
                  ? "In-Home"
                  : service.mode === "online"
                  ? "Online"
                  : service.mode === "both"
                  ? "Online + In-Home"
                  : ""}
                {service.category?.title && ` · ${service.category.title}`}
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

            {/* Original static button */}
            <Link href={`/services/${slug}/book/step1`} className="btn-book">
              BOOK THIS SERVICE
            </Link>
          </div>
        </div>

        {/* What's Included */}
        {service.details && service.details.length > 0 && (
          <div className="included-box">
            <h2>What's Included</h2>
            <ul className="included-list">
              {service.details.map((d: string, i: number) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
        )}

        {/* FAQs */}
        {service.faqs && service.faqs.length > 0 && (
          <div className="service-faq">
            <h2 className="faq-heading">❓ Frequently Asked Questions</h2>
            <ul className="faq-list">
              {service.faqs.map((faq: { q: string; a: string }, i: number) => (
                <li key={i} className="faq-item">
                  <details>
                    <summary className="faq-question">
                      {faq.q}
                      <span className="faq-toggle">+</span>
                    </summary>
                    <p className="faq-answer">{faq.a}</p>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Testimonials */}
        {service.testimonials && service.testimonials.length > 0 && (
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

        {/* Reviews */}
        <div className="site-container">
          <ServiceReviewsWrapper slug={slug} />
        </div>
      </div>

      {/* Floating button + observer */}
      <BookButtonWatcher /> {/* 👈 watches the original */}
      <div id="floating-book-container" className="floating-book-hidden">
        <Link href={`/services/${slug}/book/step1`} className="btn-book">
          BOOK THIS SERVICE
        </Link>
      </div>
    </section>
  );
}
