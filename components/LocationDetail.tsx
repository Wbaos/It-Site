
const BADGE_ES: Record<string, string> = {
  "5-Star Rated": "Calificación 5 estrellas",
  "Locally Owned": "Negocio local",
};

const SERVICE_SLUG_ES: Record<string, string> = {
  "sprinkler-repair-and-installation": "reparacion-e-instalacion-de-sprinklers",
  "wireless-camera-installation": "instalacion-de-camaras-inalambricas",
  "new-irrigation-installation": "instalacion-nueva-de-irrigacion",
  "rain-sensor-installation": "instalacion-de-sensores-de-lluvia",
  "sprinkler-leak-repair": "reparacion-de-fugas-de-sprinklers",
  "sprinkler-pump-replacement": "reemplazo-de-bombas-de-sprinklers",
  "sprinkler-timer-installation": "instalacion-de-temporizadores-de-sprinklers",
  "sprinkler-valve-repair": "reparacion-de-valvulas-de-sprinklers",
  "wifi-sprinkler-controller-upgrade": "actualizacion-a-controlador-wifi-de-sprinklers",
  "commercial-irrigation-hoa-services": "riego-comercial-y-para-hoa",
  "new-irrigation-well-installation": "instalacion-de-pozos-nuevos-de-irrigacion",
};

const esCityHref = (href: string) => {
  const m = href.match(/^\/sprinkler-repair-(.+)$/);
  return m ? `/es/reparacion-de-sprinklers-${m[1]}` : href;
};

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getLocationBySlug, getAllLocationSlugs } from "@/lib/sanityLocations";
import { resolveSiteSettings } from "@/lib/sanitySettings";
import GoogleReviewsCTA from "@/components/sections/GoogleReviewsCTA";
import { urlFor } from "@/lib/sanityImage";
import {
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle2,
  ArrowLeft,
  ArrowUpRight,
  Droplets,
  Clock,
  Monitor,
  Home,
  Tv,
  Lock,
  Thermometer,
  Wifi,
  type LucideIcon,
} from "lucide-react";


// Icon mapping function
const getIcon = (iconName?: string) => {
  const icons: Record<string, LucideIcon> = {
    tv: Tv,
    home: Home,
    monitor: Monitor,
    wifi: Wifi,
    lock: Lock,
    thermometer: Thermometer,
  };
  return icons[iconName?.toLowerCase() || 'monitor'] || Monitor;
};

const SPRINKLER_CITY_LINKS: Record<string, { label: string; href: string }[]> = {
  "fort-lauderdale": [
    { label: "Pembroke Pines", href: "/sprinkler-repair-pembroke-pines" },
    { label: "Hollywood", href: "/sprinkler-repair-hollywood" },
    { label: "Miramar", href: "/sprinkler-repair-miramar" },
    { label: "Weston", href: "/sprinkler-repair-weston" },
    { label: "Sunrise", href: "/sprinkler-repair-sunrise" },
    { label: "Davie", href: "/sprinkler-repair-davie" },
    { label: "Dania Beach", href: "/sprinkler-repair-dania-beach" },
    { label: "West Park", href: "/sprinkler-repair-west-park" },
    { label: "Southwest Ranches", href: "/sprinkler-repair-southwest-ranches" },
    { label: "Fort Lauderdale", href: "/sprinkler-repair-fort-lauderdale" },
    { label: "Plantation", href: "/sprinkler-repair-plantation" },
  ],
  miami: [
    { label: "Aventura", href: "/sprinkler-repair-aventura" },
    { label: "Hialeah", href: "/sprinkler-repair-hialeah" },
    { label: "Doral", href: "/sprinkler-repair-doral" },
    { label: "Kendall", href: "/sprinkler-repair-kendall" },
    { label: "Cutler Bay", href: "/sprinkler-repair-cutler-bay" },
    { label: "North Miami", href: "/sprinkler-repair-north-miami" },
    { label: "Miami Gardens", href: "/sprinkler-repair-miami-gardens" },
    { label: "Miami Lakes", href: "/sprinkler-repair-miami-lakes" },
    { label: "Country Club", href: "/sprinkler-repair-country-club" },
    { label: "Fontainebleau", href: "/sprinkler-repair-fontainebleau" },
    { label: "Tamiami", href: "/sprinkler-repair-tamiami" },
    { label: "Kendale Lakes", href: "/sprinkler-repair-kendale-lakes" },
    { label: "Country Walk", href: "/sprinkler-repair-country-walk" },
    { label: "Key Biscayne", href: "/sprinkler-repair-key-biscayne" },
    { label: "North Bay Village", href: "/sprinkler-repair-north-bay-village" },
    { label: "Surfside", href: "/sprinkler-repair-surfside" },
    { label: "Sunny Isles Beach", href: "/sprinkler-repair-sunny-isles-beach" },
    { label: "Coral Gables", href: "/sprinkler-repair-coral-gables" },
    { label: "Miami Beach", href: "/sprinkler-repair-miami-beach" },
    { label: "Miami", href: "/sprinkler-repair-miami" },
  ],
};


export default async function LocationDetail({ slug, locale = "en" }: { slug: string; locale?: "en" | "es" }) {
  const isSpanish = locale === "es";
  const location = await getLocationBySlug(slug, locale);
  const settings = await resolveSiteSettings();

  if (!location) {
    notFound();
  }
  const pageUrl = isSpanish ? `https://www.calltechcare.com/es/areas-de-servicio/${slug}` : `https://www.calltechcare.com/locations/${slug}`;
  // The page itself is already about this city, so the nearby-cities grid
  // must not list the city again.
  const sprinklerCityLinks = (SPRINKLER_CITY_LINKS[slug] || []).filter(
    (city) => city.label.trim().toLowerCase() !== location.city.trim().toLowerCase()
  );

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: isSpanish ? "Página Principal" : "Home",
        item: isSpanish ? "https://www.calltechcare.com/es/" : "https://www.calltechcare.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: isSpanish ? "Áreas de Servicio" : "Locations",
        item: isSpanish ? "https://www.calltechcare.com/es/areas-de-servicio" : "https://www.calltechcare.com/locations",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${location.city}, ${location.state}`,
        item: pageUrl,
      },
    ],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": pageUrl + "#localbusiness",
    name: "CallTechCare",
    url: pageUrl,
    areaServed: {
      "@type": "City",
      name: `${location.city}, ${location.state}`,
    },
    telephone: settings.phoneIntl,
    email: location.email || settings.email,
  };

  const locationServiceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: isSpanish ? `Reparación de Sprinklers, Irrigación y Cámaras de Seguridad en ${location.city}, ${location.state}` : `Sprinkler Repair, Irrigation & Security Cameras in ${location.city}, ${location.state}`,
    url: pageUrl,
    description: isSpanish ? (location.descriptionEs || location.description) : (location.metaDescription || location.description),
    areaServed: {
      "@type": "City",
      name: `${location.city}, ${location.state}`,
    },
    provider: {
      "@id": "https://www.calltechcare.com/#business",
    },
  };
  const isPrimaryOffice = location.slug?.current === "miami";
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(locationServiceSchema) }}
      />

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />

      <div className="location-detail-page">
      {/* Hero Section with Background Image */}
      <section className="location-hero-section">
        {location.heroImage && (
          <Image
            src={urlFor(location.heroImage).width(1920).height(600).url()}
            alt={location.city}
            fill
            sizes="100vw"
            className="location-hero-image"
            priority
          />
        )}
        <div className="location-hero-overlay" />

        {/* Back Button */}
        <Link href={isSpanish ? "/es/areas-de-servicio" : "/locations"} className="location-back-button">
          <ArrowLeft className="location-back-button-icon" />
          {isSpanish ? "Volver a Áreas de Servicio" : "Back to Locations"}
        </Link>

        {/* Hero Content */}
        <div className="location-hero-content">
          <div className="location-hero-city-badge">
            <MapPin />
            {/* Single expression on purpose (audit fix 2026-11-10): the
                split {city}, {state} made React emit "Miami<!-- -->, <!--
                -->Florida", which text extractors read as "Miami ,
                Florida". One string renders exactly "Miami, Florida". */}
            <span>{`${location.city}, ${location.state}`}</span>
          </div>
          <h1 className="location-hero-title">
            {`${location.city}, ${location.state}`}
          </h1>
          <p className="location-hero-subtitle">
            {isSpanish ? `Reparación Profesional de Sprinklers, Irrigación y Cámaras de Seguridad en ${location.city}` : `Professional Sprinkler Repair, Irrigation & Security Cameras in ${location.city}`}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="location-main-content">
        <div className="location-content-grid">
          {/* Left Column - Main Content */}
          <div className="location-left-column">
            {/* Services */}
            <div className="location-section-card">
              <h2 className="location-section-title">
                {isSpanish ? `Servicios en ${location.city}` : `Services in ${location.city}`}
              </h2>
              <p className="location-section-text">{isSpanish ? (location.descriptionEs || location.description) : location.description}</p>
              <p className="location-section-text">
                {isSpanish ? `Nuestro equipo en ${location.city} ayuda con la instalación de cámaras de seguridad y el trabajo de sprinklers e irrigación. Nos enorgullece ofrecer servicio el mismo día dentro del horario, estimados claros tras la inspección y un servicio al cliente excepcional en el área de ${location.city}, ${location.state}.` : `Our ${location.city} team helps with security camera installation and sprinkler & irrigation work. We pride ourselves on providing same-day service within business hours, clear estimates after inspection, and exceptional customer service to the ${location.city}, ${location.state} area.`}
              </p>
            </div>

            {/* Stats */}
            {location.stats && location.stats.length > 0 && (
              <div className="location-section-card">
                <div className="location-stats-grid">
                  {location.stats.map((stat, index) => (
                    <div key={index} className="location-stat-item">
                      <div className="location-stat-value">{isSpanish ? (stat.valueEs ?? (stat.value === "Same-Day" ? "Mismo Día" : stat.value)) : stat.value}</div>
                      <div className="location-stat-label">
                        {isSpanish && stat.labelEs ? stat.labelEs : stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Why Choose Us */}
            {location.whyChooseUs && location.whyChooseUs.length > 0 && (
              <div className="location-section-card">
                <h2 className="location-section-title">
                  {isSpanish ? `Por Qué Elegirnos en ${location.city}` : `Why Choose Us in ${location.city}`}
                </h2>
                <div className="location-reasons-grid">
                  {(isSpanish && location.whyChooseUsEs ? location.whyChooseUsEs : location.whyChooseUs).map((reason, index) => (
                    <div key={index} className="location-reason-item">
                      <CheckCircle2 />
                      <span className="location-reason-text">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Services */}
            {location.popularServices && location.popularServices.length > 0 && (
              <div className="location-section-card">
                <h2 className="location-section-title">
                  {isSpanish ? `Servicios Populares en ${location.city}` : `Popular Services in ${location.city}`}
                </h2>
                <div className="location-services-grid">
                  {location.popularServices.map((service, index) => {
                    const iconImage = typeof service.icon === "object" ? service.icon : undefined;
                    const Icon = getIcon(typeof service.icon === "string" ? service.icon : undefined);
                    return (
                      <Link 
                        key={index} 
                        href={service.slug ? (isSpanish ? `/es/${SERVICE_SLUG_ES[service.slug] || service.slug}` : `/services/${service.slug}`) : (isSpanish ? "/es/" : '/services')}
                        className="location-service-item"
                      >
                        <div className="location-service-content">
                          <div className="location-service-icon">
                            {iconImage?.asset?.url ? (
                              <Image
                                src={iconImage.asset.url}
                                alt={iconImage.alt || `${service.name} service icon`}
                                width={28}
                                height={28}
                                style={{ objectFit: "contain" }}
                              />
                            ) : (
                              <Icon />
                            )}
                          </div>
                          <span className="location-service-name">
                            {service.name}
                          </span>
                        </div>
                        <span className="location-service-price">
                          {service.price}
                        </span>
                      </Link>
                    );
                  })}
                </div>
                {!isSpanish && (
                  <div className="location-view-services">
                    <Link href="/services" className="location-view-services-btn">
                      View All Services
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* {isSpanish ? "Área de Cobertura del Servicio" : "Service Coverage Area"} */}
            {location.neighborhoods && location.neighborhoods.length > 0 && (
              <div className="location-section-card">
                <h2 className="location-section-title">
                  {isSpanish ? "Área de Cobertura del Servicio" : "Service Coverage Area"}
                </h2>
                <div className="location-coverage-text">
                  <MapPin />
                  <p className="location-section-text">
                    {isSpanish ? `Servimos con orgullo a ${location.city} y áreas cercanas dentro de un radio de ${location.serviceRadius?.miles || 45} millas.` : `We proudly serve ${location.city} and surrounding areas within a ${location.serviceRadius?.miles || 45}-mile radius.`}
                    {location.serviceRadius?.population && (
                      <>
                        {isSpanish ? ` Atendemos a una población de aproximadamente ${location.serviceRadius.population} residentes con servicios profesionales de sprinklers, irrigación y cámaras de seguridad.` : ` We serve a population of approximately ${location.serviceRadius.population} residents with professional sprinkler, irrigation and security camera services.`}
                      </>
                    )}
                  </p>
                </div>

                <div className="location-coverage-wrapper">
                  <p className="location-zip-codes-label">
                    {isSpanish ? "Áreas Atendidas:" : "Areas Served:"}
                  </p>
                  <div className="location-zip-codes">
                    {location.neighborhoods.map((area, index) => (
                      <span key={index} className="location-zip-code">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
                {location.zipCodes && location.zipCodes.length > 0 && (
                  <div className="location-coverage-wrapper">
                    <p className="location-zip-codes-label">
                      {isSpanish ? "Códigos Postales Atendidos:" : "ZIP Codes Served:"}
                    </p>
                    <div className="location-zip-codes">
                      {location.zipCodes.map((zip, index) => (
                        <span key={index} className="location-zip-code">
                          {zip}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Sprinkler Repair by City */}
            {sprinklerCityLinks.length > 0 && (
              <section className="location-section-card location-sprinkler-cities" aria-labelledby="sprinkler-cities-title">
                <div className="location-sprinkler-eyebrow">
                  <Droplets size={18} aria-hidden="true" />
                  <span>{isSpanish ? "Servicios locales de irrigación" : "Local irrigation services"}</span>
                </div>
                <h2 id="sprinkler-cities-title" className="location-section-title">
                  {isSpanish ? `Reparación de Sprinklers en Ciudades del Área de ${location.city}` : `Sprinkler Repair in ${location.city} Area Cities`}
                </h2>
                <p className="location-section-text">
                  {isSpanish ? "¿Buscas reparación de sprinklers en una ciudad específica? Mira nuestras páginas dedicadas a la reparación de sprinklers:" : "Looking for sprinkler repair in a specific city? See our dedicated sprinkler repair pages:"}
                </p>
                <div className="location-sprinkler-city-grid">
                  {sprinklerCityLinks.map((city) => (
                    <Link key={city.href} href={isSpanish ? esCityHref(city.href) : city.href} className="location-sprinkler-city-link">
                      <MapPin size={18} aria-hidden="true" />
                      <span>{city.label}</span>
                      <ArrowUpRight size={18} aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Google reviews aggregate (real Google data, same card as the home page) */}
            <GoogleReviewsCTA locale={locale} />
          </div>

          {/* Right Column - Contact Card (Sticky) */}
          <div>
            <div className="location-sidebar">
             <h3 className="location-sidebar-title">
                {isPrimaryOffice
                  ? (isSpanish ? `Contactar a la Oficina de ${location.city}` : `Contact ${location.city} Office`)
                  : (isSpanish ? `Equipo de Servicio de ${location.city}` : ` ${location.city} Service Team`)}
              </h3>


              <div className="location-sidebar-info">
               {location.address && location.slug?.current === "miami" && (
                  <div className="location-sidebar-info-item">
                    <MapPin />
                    <div>
                      <p className="location-sidebar-info-label">{isSpanish ? "Dirección" : "Address"}</p>
                      <p className="location-sidebar-info-value">
                        {location.address.street}
                        {location.address.suite && `, ${location.address.suite}`},{" "}
                        {location.city}, {location.state} {location.address.zipCode}
                      </p>
                    </div>
                  </div>
                )}
                {location.phone && (
                  <div className="location-sidebar-info-item">
                    <Phone />
                    <div>
                      <p className="location-sidebar-info-label">{isSpanish ? "Teléfono" : "Phone"}</p>
                      <a
                        href={`tel:${settings.phoneTel}`}
                        className="location-sidebar-info-value"
                      >
                        {settings.phoneDisplay}
                      </a>
                    </div>
                  </div>
                )}

                {location.email && (
                  <div className="location-sidebar-info-item">
                    <Mail />
                    <div>
                      <p className="location-sidebar-info-label">{isSpanish ? "Correo electrónico" : "Email"}</p>
                      <a
                        href={`mailto:${location.email}`}
                        className="location-sidebar-info-value location-sidebar-email"
                      >
                        {location.email}
                      </a>
                    </div>
                  </div>
                )}

                {location.hours && (
                  <div className="location-sidebar-info-item">
                    <Clock />
                    <div>
                      <p className="location-sidebar-info-label">{isSpanish ? "Horario" : "Hours"}</p>
                      <div className="location-sidebar-hours">
                        {location.hours.weekday && (
                          <p className="location-sidebar-info-value">
                            {isSpanish ? "lun–sáb: 8:00 AM – 7:00 PM" : location.hours.weekday}
                          </p>
                        )}
                        {location.hours.weekend && (
                          <p className="location-sidebar-info-value">
                            {isSpanish ? "dom: 9:00 AM – 6:00 PM" : location.hours.weekend}
                          </p>
                        )}
                        {location.hours.emergency && (
                          <p className="location-sidebar-emergency">
                            {isSpanish ? "Reparación de sprinklers el mismo día e instalación de cámaras de seguridad disponibles." : location.hours.emergency}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="location-sidebar-buttons">
                {location.phone && (
                  <a
                    href={`tel:${settings.phoneTel}`}
                    className="location-call-button"
                  >
                    {isSpanish ? "Llama Ahora" : "Call Now"}
                  </a>
                )}
                <Link href={isSpanish ? "/es/#contact" : "/#contact"} className="location-request-button">
                  {isSpanish ? "Solicitar Servicio" : "Request Service"}
                </Link>
              </div>

              {location.badges && location.badges.length > 0 && (
                <div className="location-badges">
                  {location.badges.map((badge, index) => (
                    <div key={index} className="location-badge-item">
                      <div className="location-badge-icon">
                        {badge.toLowerCase().includes('star') ? (
                          <Star />
                        ) : (
                          <CheckCircle2 />
                        )}
                      </div>
                      <p className="location-badge-label">{isSpanish ? (BADGE_ES[badge] || badge) : badge}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content - Full Width */}
      <section className="location-seo-section">
        <div className="location-section-card">
          <h2 className="location-section-title">
            {isSpanish ? `Reparación Profesional de Sprinklers, Irrigación y Cámaras de Seguridad en ${location.city}, ${location.state}` : `Professional Sprinkler Repair, Irrigation & Security Cameras in ${location.city}, ${location.state}`}
          </h2>
          <div className="location-seo-content">
            {isSpanish ? (
              <>
                <p>
                  ¿Buscas un servicio confiable en {location.city}? CallTechCare es un proveedor local de confianza para el servicio de sprinklers e irrigación y la instalación de cámaras de seguridad. Nuestro equipo en {location.city} está aquí para ayudarte.
                </p>
                <p>
                  Entendemos las necesidades únicas de los residentes y negocios de {location.city}. Por eso ofrecemos programación flexible y 1 año de garantía cuando CallTechCare hace el trabajo y provee los materiales. Desde reparaciones de sprinklers hasta instalaciones de sistemas nuevos y configuraciones de cámaras de seguridad, tenemos la experiencia para manejar una amplia gama de proyectos.
                </p>
                <p>
                  <strong>
                    Los servicios que ofrecemos en {location.city} incluyen:</strong>{" "}servicio de sprinklers e irrigación e instalación de cámaras de seguridad. Contáctanos hoy para programar un servicio en {location.city}, {location.state}.
                </p>
              </>
            ) : (
              <>
                <p>
                  Looking for reliable service in {location.city}? CallTechCare is a trusted local provider for sprinkler and irrigation service and security camera installation. Our team in {location.city} is here to help.
                </p>
                <p>
                  We understand the unique needs of {location.city} residents and businesses. That is why we offer flexible scheduling and a 1-year warranty when CallTechCare performs the work and provides the materials. From sprinkler repairs to new system installations and security camera setups, we have the experience to handle a wide range of projects.
                </p>
                <p>
                  <strong>
                    The services we offer in {location.city} include:</strong>{" "}sprinkler and irrigation service and security camera installation. Contact us today to schedule service in {location.city}, {location.state}.
                </p>
              </>
            )}
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
