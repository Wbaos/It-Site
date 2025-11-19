import { notFound } from "next/navigation";
import { sanity } from "@/lib/sanity";
import Link from "next/link";
import Image from "next/image";
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
  return notFound();
}


  const sub: SubService[] = service.subservices ?? [];
  const hasSubServices = sub.length > 0;

  const install = sub.filter((s) => s.serviceType === "installation");
  const support = sub.filter((s) => s.serviceType === "support");

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

            <Link href={`/services/${slug}/book/step1`} className="btn-book">
              BOOK THIS SERVICE
            </Link>
          </div>
        </div>

        {includedList.length > 0 && (
          <div className="included-box">
            <h2>What's Included</h2>

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
