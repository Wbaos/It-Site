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
  return String(a?.titleEs ?? a?.title ?? "").localeCompare(
    String(b?.titleEs ?? b?.title ?? "")
  );
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
  title: "Servicios de Sprinklers e Irrigación | CallTechCare",

  description: "Servicios de CallTechCare en Miami y Broward: reparación de sprinklers, instalación de irrigación, válvulas, temporizadores, fugas y sistemas.",

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
    description: "Servicios de CallTechCare en Miami y Broward: reparación de sprinklers, instalación de irrigación, válvulas, temporizadores, fugas y sistemas.",
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
                            {shortExcerpt(service.descriptionEs || service.description)}
                          </p>

                          <div className="services-list-card-footer">

                            <span className="services-list-card-price-call">
                              Pide tu inspección gratis
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

      {/* Sobre nuestros servicios */}
      <section className="services-list-about">
        <div className="services-list-about-container">
          <h2>
            Reparación de Sprinklers, Irrigación y Cámaras de Seguridad en
            Miami y Broward
          </h2>

          <p>
            CallTechCare repara e instala sistemas de sprinklers en
            Miami-Dade y Broward. Arreglamos fugas, cabezales rotos, mala
            cobertura, válvulas que fallan y zonas que no prenden. También
            instalamos sistemas nuevos de sprinklers, riego por goteo,
            pozos nuevos de irrigación, controladores WiFi, temporizadores
            y sensores de lluvia.
          </p>

          <p>
            Instalamos bombas nuevas. E instalamos cámaras inalámbricas de
            seguridad para casas y negocios.
          </p>

          <p>
            Un sistema de sprinklers solo sirve si riega parejo. Un cabezal
            que riega el driveway bota el agua. Una zona que se queda seca
            mata la grama.
          </p>

          <p>
            Una fuga bajo el césped puede correr semanas antes
            de que alguien la vea. Eso es lo que revisamos en cada visita:
            los cabezales, las válvulas, la tubería, la presión y el
            controlador. Encontramos el problema, lo arreglamos y probamos el
            sistema antes de irnos.
          </p>

          <h3>Cómo funciona una visita</h3>

          <ol>
            <li>
              Llama al <a href="tel:+17863662729">(786) 366-2729</a> o
              envíanos un mensaje. Dinos tu nombre, tu teléfono y qué
              necesitas.
            </li>
            <li>
              Te llamamos para coordinar la visita. Tú no escoges el día ni
              la hora — lo coordinamos contigo.
            </li>
            <li>
              Inspeccionamos el sistema y te damos el precio. La inspección
              es gratis.
            </li>
            <li>
              La mayoría de las reparaciones se hacen el mismo día, dentro
              del horario. El trabajo tiene garantía de 1 año cuando hacemos
              el trabajo y proveemos los materiales.
            </li>
          </ol>

          <h3>Dónde trabajamos</h3>

          <p>
            Atendemos Miami-Dade y Broward — 32 ciudades en total. Eso
            incluye Miami, Fort Lauderdale, Weston, Coral Springs, Miramar,
            Pembroke Pines, Sunrise, Davie, Doral, Coral Gables y Plantation.
            Mira la lista completa en nuestra{" "}
            <Link href="/es/areas-de-servicio">
              página de áreas de servicio
            </Link>
            .
          </p>

          <h3>Preguntas frecuentes</h3>

          <h4>¿Cobran por la inspección?</h4>
          <p>
            No. La inspección es gratis. Miramos el
            sistema y te decimos qué necesita y cuánto cuesta. La visita en
            sí no tiene costo.
          </p>

          <h4>¿Qué tan rápido pueden venir?</h4>
          <p>
            La mayoría de las visitas son el mismo día, dentro del horario,
            cuando la agenda lo permite. Llámanos primero y te decimos a qué
            hora podemos estar ahí.
          </p>

          <h4>¿Reparan bombas y temporizadores?</h4>
          <p>
            Instalamos bombas y temporizadores nuevos — reemplazo y mejoras.
            Reparamos sistemas de sprinklers: cabezales, válvulas, tubería,
            fugas y zonas.
          </p>

          <h4>¿Trabajan con HOAs y administradores de propiedades?</h4>
          <p>
            Sí. Trabajamos con HOAs, administradores de propiedades y
            alquileres de corto plazo. Ofrecemos una auditoría de irrigación
            gratis primero, y un plan de mantenimiento recurrente con
            revisiones mensuales y un reporte escrito.
          </p>

          <p>
            Llama al <a href="tel:+17863662729">(786) 366-2729</a> o
            envíanos un mensaje rápido. Dinos qué necesitas y te llamamos
            para coordinar la visita.
          </p>
        </div>
      </section>
    </>
  );
}
