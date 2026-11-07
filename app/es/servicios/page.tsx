import { sanity } from "@/lib/sanity";
import { urlFor } from "@/lib/sanityImage";
import Image from "next/image";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import { serviceHref } from "@/lib/serviceTwins";
import type { Metadata } from "next";

// Fixed display order for the services list, shared with /services: the main
// repair service first, then repairs, then installs/controls, then the
// maintenance plan, cameras last. Services not listed here sort last,
// alphabetically by title.
const SERVICE_ORDER = [
  "sprinkler-repair-and-installation",
  "emergency-sprinkler-repair",
  "sprinkler-leak-repair",
  "sprinkler-valve-repair",
  "sprinkler-pump-replacement",
  "sprinkler-timer-installation",
  "wifi-sprinkler-controller-upgrade",
  "rain-sensor-installation",
  "new-irrigation-installation",
  "sprinkler-maintenance-plan",
  "wireless-camera-installation",
];

const serviceOrderIndex = (slug: unknown) =>
  typeof slug === "string" ? SERVICE_ORDER.indexOf(slug) : -1;

const compareServiceOrder = (a: any, b: any) => {
  const aIndex = serviceOrderIndex(a?.slug?.current);
  const bIndex = serviceOrderIndex(b?.slug?.current);
  if (aIndex !== bIndex) {
    return (
      (aIndex === -1 ? SERVICE_ORDER.length : aIndex) -
      (bIndex === -1 ? SERVICE_ORDER.length : bIndex)
    );
  }
  return String(a?.titleEs ?? a?.title ?? "").localeCompare(
    String(b?.titleEs ?? b?.title ?? "")
  );
};

export const metadata: Metadata = {
  title: "Servicios de Sprinklers e Irrigación | CallTechCare",

  description: "Explora los servicios de CallTechCare en Miami y Broward: reparación de sprinklers, instalación de irrigación, reemplazo de válvulas y temporizadores, reparación de fugas y sistemas nuevos.",

  alternates: {
    canonical: "https://www.calltechcare.com/es/servicios",
  languages: {
    es: "https://www.calltechcare.com/es/servicios",
    en: "https://www.calltechcare.com/services",
    "x-default": "https://www.calltechcare.com/services",
  },
  },

  openGraph: {
    title: "Servicios de Sprinklers e Irrigación | CallTechCare",
    description: "Explora los servicios de CallTechCare en Miami y Broward: reparación de sprinklers, instalación de irrigación, reemplazo de válvulas y temporizadores, reparación de fugas y sistemas nuevos.",
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

export default async function ServicesPageEs() {

  const services = await sanity.fetch(`
    *[_type == "service" && enabled == true] {
        _id,
        title,
        titleEs,
        slug,
        category->{ title, titleEs, slug },
        description,
        descriptionEs,
        navDescription,
        image
    }
  `);

  // Display order is fixed (SERVICE_ORDER above), not alphabetical.
  services.sort(compareServiceOrder);

  const pageUrl = "https://www.calltechcare.com/es/servicios";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "https://www.calltechcare.com/es",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Servicios",
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
        const title = typeof service?.titleEs === "string" && service.titleEs ? service.titleEs : service?.title;
        if (!slug || !title) return null;

        const url = `https://www.calltechcare.com${serviceHref(slug, "es")}`;

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
    name: "Servicios de CallTechCare",
    url: pageUrl,
    provider: {
      "@type": "Organization",
      name: "CallTechCare",
      url: "https://www.calltechcare.com",
    },
    areaServed: "Miami y Broward, Florida",
  };

  const getServicePriority = (value: unknown) => {
    const text = typeof value === "string" ? value.toLowerCase() : "";
    if (text.includes("sprinkler") || text.includes("irrigation")) return 0;
    if (text.includes("camera") || text.includes("cctv") || text.includes("security")) return 1;
    if (text.includes("wifi") || text.includes("wi-fi") || text.includes("computer") || text.includes("printer") || text.includes("tech")) return 2;
    return 3;
  };

  // Group services by category
  const servicesByCategory = (Array.isArray(services) ? services : []).reduce(
    (acc: Record<string, any[]>, service: any) => {
      const categoryTitle = service.category?.titleEs ?? service.category?.title ?? "Otros Servicios";
      if (!acc[categoryTitle]) {
        acc[categoryTitle] = [];
      }
      acc[categoryTitle].push(service);
      return acc;
    },
    {}
  );

  const sortedCategoryEntries = Object.entries(servicesByCategory)
    .map(([category, categoryServices]) => {
      const sortedServices = (Array.isArray(categoryServices) ? categoryServices : []).slice().sort((a: any, b: any) => {
        const aPriority = Math.min(getServicePriority(a?.title), getServicePriority(a?.category?.title));
        const bPriority = Math.min(getServicePriority(b?.title), getServicePriority(b?.category?.title));
        if (aPriority !== bPriority) return aPriority - bPriority;
        return compareServiceOrder(a, b);
      });

      return [category, sortedServices] as const;
    })
    .sort(([aCategory], [bCategory]) => {
      const aPriority = getServicePriority(aCategory);
      const bPriority = getServicePriority(bCategory);
      if (aPriority !== bPriority) return aPriority - bPriority;
      return aCategory.localeCompare(bCategory);
    });

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

          <h1>Servicios de Sprinklers, Irrigación y Cámaras de Seguridad en Miami</h1>

          <p className="services-list-hero-subtitle">
            Servicios de reparación de sprinklers e irrigación en Miami y Broward, más instalación de cámaras de seguridad.
          </p>

          <p className="services-list-hero-subtitle">
            ¿Buscas <Link href="/es/reparacion-de-sprinklers-miami">Reparación de Sprinklers en Miami</Link>?
          </p>

          <p className="services-list-hero-badge">
            {services.length} servicios disponibles
          </p>
        </div>
      </section>

      {/* Services Content */}
      <section className="services-list-content">
        <div className="services-list-container">

          {services.length === 0 ? (
            <p className="services-list-empty">
              Aún no hay servicios disponibles.
            </p>
          ) : (
            <div className="services-list-categories">

              {sortedCategoryEntries.map(
                ([category, categoryServices]) => {
                const categorySlug =
                  categoryServices[0]?.category?.slug?.current;

                return (

                <div key={category} className="services-list-category-section">

                  <h2 className="services-list-category-title">
                    {categorySlug ? (
                      <Link
                        href={serviceHref(categorySlug, "es")}
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        {category}
                      </Link>
                    ) : (
                      category
                    )}
                  </h2>

                  <div className="services-list-grid">

                    {categoryServices.map((service: any, index: number) => (

                      <Link
                        key={service._id}
                        href={serviceHref(service.slug.current, "es")}
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
                              alt={`${service.titleEs || service.title} servicio`}
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
                            {service.titleEs || service.title}
                          </h3>

                          <p className="services-list-card-description">
                            {service.descriptionEs || service.description}
                          </p>

                          <div className="services-list-card-footer">

                            <span className="services-list-card-price-call">
                              Llama para cotización
                            </span>

                            <span className="services-list-card-link">
                              Saber más →
                            </span>

                          </div>

                        </div>
                      </Link>

                    ))}

                  </div>

                </div>
              );
            }
          )}

            </div>
          )}

        </div>
      </section>
    </>
  );
}
