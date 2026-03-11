import { sanity } from "@/lib/sanity";
import { urlFor } from "@/lib/sanityImage";
import Image from "next/image";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home, Outdoor & Tech Services in South Florida | CallTechCare",

  description:
    "Explore CallTechCare services across South Florida including security camera installation, TV mounting, WiFi & internet troubleshooting, computer and printer support, phone & tablet help, senior-friendly tech support, sprinkler & irrigation service, and tree trimming.",

  alternates: {
    canonical: "https://www.calltechcare.com/services",
  },

  openGraph: {
    title: "CallTechCare Services | Home, Outdoor & Tech Help",
    description:
      "Browse professional services from CallTechCare including TV mounting, security cameras, Wi-Fi troubleshooting, computer help, and outdoor services.",
    url: "https://www.calltechcare.com/services",
    siteName: "CallTechCare",
    images: [
      {
        url: "https://www.calltechcare.com/logo-schema.png",
        width: 512,
        height: 512,
      },
    ],
  },
};

export default async function ServicesPage() {

  const services = await sanity.fetch(`
    *[_type == "service" && enabled == true] | order(title asc) {
        _id,
        title,
        slug,
        category->{ title, slug },
        description,
        navDescription,
        price,
        showPrice,
        image
    }
  `);

  const pageUrl = "https://www.calltechcare.com/services";

  const breadcrumbSchema = {
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
        item: pageUrl,
      },
    ],
  };

  const servicesItemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: (Array.isArray(services) ? services : [])
      .map((service: any, index: number) => {
        const slug = service?.slug?.current;
        const title = typeof service?.title === "string" ? service.title : "";
        if (!slug || !title) return null;

        const url = `https://www.calltechcare.com/services/${slug}`;

        return {
          "@type": "ListItem",
          position: index + 1,
          url,
          name: title,
        };
      })
      .filter(Boolean),
  };

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "CallTechCare Services",
    url: pageUrl,
    provider: {
      "@type": "Organization",
      name: "CallTechCare",
      url: "https://www.calltechcare.com",
    },
    areaServed: "South Florida",
  };

  // Group services by category
  const servicesByCategory = (Array.isArray(services) ? services : []).reduce(
    (acc: Record<string, any[]>, service: any) => {
      const categoryTitle = service.category?.title || "Other Services";
      if (!acc[categoryTitle]) {
        acc[categoryTitle] = [];
      }
      acc[categoryTitle].push(service);
      return acc;
    },
    {}
  );

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesItemListSchema) }}
      />

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />

      {/* Hero Section */}
      <section className="services-list-hero">
        <div className="services-list-hero-container">
          <div className="services-list-icon-wrapper">
            <Briefcase />
          </div>

          <h1>Our Services</h1>

          <p className="services-list-hero-subtitle">
            Professional home, outdoor, and tech services across South Florida
          </p>

          <p className="services-list-hero-badge">
            {services.length} Services Available
          </p>
        </div>
      </section>

      {/* Services Content */}
      <section className="services-list-content">
        <div className="services-list-container">

          {services.length === 0 ? (
            <p className="services-list-empty">
              No services available yet.
            </p>
          ) : (
            <div className="services-list-categories">

              {Object.entries(servicesByCategory).map(
                ([category, categoryServices]: [string, any]) => (

                <div key={category} className="services-list-category-section">

                  <h2 className="services-list-category-title">
                    {category}
                  </h2>

                  <div className="services-list-grid">

                    {categoryServices.map((service: any, index: number) => (

                      <Link
                        key={service._id}
                        href={`/services/${service.slug.current}`}
                        className="services-list-card"
                      >

                        {service.image && (
                          <div className="services-list-card-image-wrapper">
                            <Image
                              src={urlFor(service.image)
                                .width(400)
                                .height(250)
                                .auto("format")
                                .url()}
                              alt={`${service.title} service`}
                              width={400}
                              height={250}
                              className="services-list-card-image"
                              priority={index === 0}
                              fetchPriority={index === 0 ? "high" : "auto"}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                            />
                          </div>
                        )}

                        <div className="services-list-card-content">

                          <h3 className="services-list-card-title">
                            {service.title}
                          </h3>

                          <p className="services-list-card-description">
                            {service.description}
                          </p>

                          <div className="services-list-card-footer">

                            {service.showPrice && service.price != null ? (
                              <span className="services-list-card-price">
                                ${service.price}
                              </span>
                            ) : (
                              <span className="services-list-card-price-call">
                                Call for Quote
                              </span>
                            )}

                            <span className="services-list-card-link">
                              Learn More →
                            </span>

                          </div>

                        </div>
                      </Link>

                    ))}

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>
      </section>
    </>
  );
}