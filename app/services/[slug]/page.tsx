import { notFound } from "next/navigation";
import { SERVICES } from "@/lib/serviceCatalog";
import TestimonialsList from "@/components/common/TestimonialsList";
import Link from "next/link";

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = SERVICES[slug];
  if (!service) return notFound();

  return (
    <section className="section service-detail">
      <div className="site-container service-layout">
        <img src={service.image} alt={service.title} className="service-hero" />
        <div className="service-info">
          <h1 className="service-title">{service.title}</h1>
          <p className="service-price">${service.price} / setup</p>

          {service.description && <p>{service.description}</p>}

          <Link href={`/services/${slug}/book/step1`} className="btn btn-primary">
            Book This Service
          </Link>


          {(service.details ?? []).length > 0 && (
            <ul>
              {(service.details ?? []).map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {service.faqs && service.faqs.length > 0 && (
        <div className="service-faq">
          <h2 className="faq-heading">❓ Frequently Asked Questions</h2>
          <ul className="faq-list">
            {service.faqs.map((faq, i) => (
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

      {service.testimonials && (
        <TestimonialsList
          items={service.testimonials}
          title={`What Clients Say About ${service.title}`}
          carousel={true}
        />
      )}
    </section>
  );
}
