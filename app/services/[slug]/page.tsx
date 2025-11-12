import { notFound } from "next/navigation";
import { sanity } from "@/lib/sanity";
import Link from "next/link";
import Image from "next/image";
import TestimonialsList from "@/components/common/TestimonialsList";
import ServiceReviewsWrapper from "@/components/ServiceReviewsWrapper";

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
      description,
      image { asset -> { url } },
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
    <section className="section service-detail">
      <div className="site-container service-layout">
        {service.image?.asset?.url && (
          <Image
            src={service.image.asset.url}
            alt={service.title}
            width={800}
            height={450}
            className="service-hero"
            priority
          />
        )}

        {/* Service Information */}
        <div className="service-info">
          <h1 className="service-title">{service.title}</h1>

          {service.price && (
            <p className="service-price">${service.price} / setup</p>
          )}

          {service.description && <p>{service.description}</p>}

          <Link
            href={`/services/${slug}/book/step1`}
            className="btn btn-primary"
          >
            Book This Service
          </Link>

          {service.details && service.details.length > 0 && (
            <ul className="service-details">
              {service.details.map((d: string, i: number) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* FAQs Section */}
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

      {/* Testimonials Section */}
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

      {/* Dynamic Reviews */}
      <div className="site-container">
        <ServiceReviewsWrapper slug={slug} />
      </div>
    </section>
  );
}
