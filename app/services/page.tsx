import { sanity } from "@/lib/sanity";
import { urlFor } from "@/lib/sanityImage";
import Image from "next/image";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import type { Metadata } from "next";
import { serviceHref } from "@/lib/serviceTwins";

// Fixed display order for the services list: the main repair service first,
// then repairs, then installs/controls, then the maintenance plan, cameras
// last. Services not listed here sort last, alphabetically by title.
const SERVICE_ORDER = [
  "sprinkler-repair-and-installation",
  "emergency-sprinkler-repair",
  "sprinkler-leak-repair",
  "sprinkler-valve-repair",
  "sprinkler-pump-replacement",
  "new-irrigation-well-installation",
  "sprinkler-timer-installation",
  "wifi-sprinkler-controller-upgrade",
  "rain-sensor-installation",
  "new-irrigation-installation",
  "sprinkler-maintenance-plan",
  "commercial-irrigation-hoa-services",
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
  return String(a?.title ?? "").localeCompare(String(b?.title ?? ""));
};

// Hub cards show a SHORT excerpt of the service description (first 1–2
// sentences, ~150 chars max, ending with an ellipsis) — never the full
// description. The full text stays in Sanity untouched: it is the service
// page's SEO content. The card only teases it, so all cards stay short
// and roughly the same height. Same helper as the related-services cards.
function shortExcerpt(text: string | undefined, maxLen = 150): string | undefined {
  if (!text) return undefined;
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLen) return clean;
  // Accumulate whole sentences while they fit within maxLen.
  const sentences = clean.match(/[^.!?]+[.!?]+["”)]?/g) ?? [clean];
  let out = "";
  for (const s of sentences) {
    const next = out ? `${out} ${s.trim()}` : s.trim();
    if (next.length <= maxLen) out = next;
    else break;
  }
  // First sentence alone is longer than maxLen: cut it at a word boundary.
  if (!out) {
    const cut = clean.slice(0, maxLen);
    const lastSpace = cut.lastIndexOf(" ");
    out = lastSpace > 40 ? cut.slice(0, lastSpace) : cut;
  }
  return `${out.trimEnd()}…`;
}

export const metadata: Metadata = {
  title: "Sprinkler Repair & Irrigation Services | CallTechCare",

  description: "Explore CallTechCare services in Miami and Broward: sprinkler repair, irrigation installation, valve and timer replacement, leak repair, and new systems.",

  alternates: {
    canonical: "https://www.calltechcare.com/services",
    languages: {
      es: "https://www.calltechcare.com/es/servicios",
      en: "https://www.calltechcare.com/services",
      "x-default": "https://www.calltechcare.com/services",
    },
  },

  openGraph: {
    title: "Sprinkler Repair & Irrigation Services | CallTechCare",
    description: "Explore CallTechCare services in Miami and Broward: sprinkler repair, irrigation installation, valve and timer replacement, leak repair, and new systems.",
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
    *[_type == "service" && enabled == true] {
        _id,
        title,
        slug,
        category->{ title, slug },
        description,
        navDescription,
        image
    }
  `);

  // Display order is fixed (SERVICE_ORDER above), not alphabetical.
  services.sort(compareServiceOrder);

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
    areaServed: "Miami and Broward County, Florida",
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
      const categoryTitle = service.category?.title || "Other Services";
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

          <h1>Sprinkler Repair, Irrigation & Security Cameras in Miami</h1>

          <p className="services-list-hero-subtitle">
            Sprinkler repair & irrigation services in Miami and Broward, plus security camera installation.
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

              {sortedCategoryEntries.map(
                ([category, categoryServices]) => {
                const categorySlug =
                  categoryServices[0]?.category?.slug?.current;

                return (

                <div key={category} className="services-list-category-section">

                  <h2 className="services-list-category-title">
                    {categorySlug ? (
                      <Link
                        href={serviceHref(categorySlug, "en")}
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
                            {shortExcerpt(service.description)}
                          </p>

                          <div className="services-list-card-footer">

                            <span className="services-list-card-price-call">
                              Call for a Free Inspection
                            </span>

                            <span className="services-list-card-link">
                              Learn More →
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

      {/* About our services */}
      <section className="services-list-about">
        <div className="services-list-about-container">
          <h2>
            Sprinkler Repair, Irrigation and Security Cameras in Miami and
            Broward
          </h2>

          <p>
            CallTechCare repairs and installs sprinkler systems across
            Miami-Dade and Broward County. We fix leaks, broken heads, bad
            coverage, faulty valves and zones that do not turn on. We also
            install new sprinkler systems, drip irrigation, backflow devices,
            new irrigation wells, WiFi controllers, timers and rain sensors.
          </p>

          <p>
            We install new pumps. And we install wireless security cameras
            for homes and businesses. Every job is done on site, at your
            property.
          </p>

          <p>
            A sprinkler system is only good if it waters evenly. A head that
            sprays the driveway wastes water. A zone that stays dry kills the
            grass.
          </p>

          <p>
            A leak under the lawn can run for weeks before anyone sees
            it. That is what we look for on every visit: the heads, the
            valves, the pipes, the pressure and the controller. We find the
            problem, we fix it, and we test the system before we leave.
          </p>

          <h3>How a visit works</h3>

          <ol>
            <li>
              Call <a href="tel:+17863662729">(786) 366-2729</a> or send us
              a message. Tell us your name, your phone number and what you
              need.
            </li>
            <li>
              We call you back to set up the visit. You do not pick a day or
              time — we coordinate it with you.
            </li>
            <li>
              We come to your property, inspect the system and give you the
              price on site. The inspection is free.
            </li>
            <li>
              Most repairs are done the same day, within business hours. The
              work carries a 1-year warranty when we do the work and provide
              the materials.
            </li>
          </ol>

          <h3>Where we work</h3>

          <p>
            We serve Miami-Dade and Broward County — 32 cities in all. That
            includes Miami, Fort Lauderdale, Weston, Coral Springs, Miramar,
            Pembroke Pines, Sunrise, Davie, Doral, Coral Gables and
            Plantation. See the full list on our{" "}
            <Link href="/locations">service areas page</Link>.
          </p>

          <h3>Common questions</h3>

          <h4>Do you charge for the inspection?</h4>
          <p>
            No. The inspection is free. We come to your property, look at
            the system and tell you what it needs and what it costs. There is
            no charge for the visit itself.
          </p>

          <h4>How fast can you come?</h4>
          <p>
            Most visits happen the same day, within business hours, when the
            schedule allows. Call us first and we will tell you the earliest
            time we can be there.
          </p>

          <h4>Do you repair pumps and timers?</h4>
          <p>
            We install new pumps and timers — replacement and upgrades. We
            repair sprinkler systems: heads, valves, pipes, leaks and zones.
          </p>

          <h4>Do you work with HOAs and property managers?</h4>
          <p>
            Yes. We work with HOAs, property managers and short-term
            rentals. We offer a free irrigation audit first, and a recurring
            maintenance plan with monthly wet checks and a written report.
          </p>

          <p>
            Call <a href="tel:+17863662729">(786) 366-2729</a> or send us a
            quick message. Tell us what you need and we will call you back
            to set up the visit.
          </p>
        </div>
      </section>
    </>
  );
}
