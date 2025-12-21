import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getLocationBySlug, getAllLocationSlugs } from "@/lib/sanityLocations";
import { urlFor } from "@/lib/sanityImage";
import {
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle2,
  ArrowLeft,
  Clock,
  Monitor,
  Home,
  Tv,
  Lock,
  Thermometer,
  Wifi,
} from "lucide-react";

// Icon mapping function
const getIcon = (iconName?: string) => {
  const icons: Record<string, any> = {
    tv: Tv,
    home: Home,
    monitor: Monitor,
    wifi: Wifi,
    lock: Lock,
    thermometer: Thermometer,
  };
  return icons[iconName?.toLowerCase() || 'monitor'] || Monitor;
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllLocationSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const location = await getLocationBySlug(slug);

  if (!location) {
    return {
      title: "Location Not Found",
    };
  }

  return {
    title: location.metaTitle || `${location.title} | IT Services`,
    description: location.metaDescription || location.description,
    openGraph: {
      title: location.metaTitle || location.title,
      description: location.metaDescription || location.description,
      images: location.heroImage
        ? [{ url: urlFor(location.heroImage).width(1200).height(630).url() }]
        : [],
    },
  };
}

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;
  const location = await getLocationBySlug(slug);

  if (!location) {
    notFound();
  }

  return (
    <div className="location-detail-page">
      {/* Hero Section with Background Image */}
      <section className="location-hero-section">
        {location.heroImage && (
          <Image
            src={urlFor(location.heroImage).width(1920).height(600).url()}
            alt={location.city}
            fill
            className="location-hero-image"
            priority
          />
        )}
        <div className="location-hero-overlay" />

        {/* Back Button */}
        <Link href="/locations" className="location-back-button">
          <ArrowLeft className="location-back-button-icon" />
          Back to Locations
        </Link>

        {/* Hero Content */}
        <div className="location-hero-content">
          <div className="location-hero-city-badge">
            <MapPin />
            <span>
              {location.city}, {location.state}
            </span>
          </div>
          <h1 className="location-hero-title">
            {location.city}, {location.state}
          </h1>
          <p className="location-hero-subtitle">
            Professional Tech Support & Smart Home Services
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="location-main-content">
        <div className="location-content-grid">
          {/* Left Column - Main Content */}
          <div className="location-left-column">
            {/* Tech Support Services */}
            <div className="location-section-card">
              <h2 className="location-section-title">
                Tech Support Services in {location.city}
              </h2>
              <p className="location-section-text">{location.description}</p>
              <p className="location-section-text">
                Our {location.city} team consists of certified technicians who
                are experts in home technology, smart home automation, computer
                repair, and IT support. We pride ourselves on providing
                same-day service, transparent pricing, and exceptional customer
                service to the {location.city}, {location.state} area.
              </p>
            </div>

            {/* Why Choose Us */}
            {location.whyChooseUs && location.whyChooseUs.length > 0 && (
              <div className="location-section-card">
                <h2 className="location-section-title">
                  Why Choose Us in {location.city}
                </h2>
                <div className="location-reasons-grid">
                  {location.whyChooseUs.map((reason, index) => (
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
                  Popular Services in {location.city}
                </h2>
                <div className="location-services-grid">
                  {location.popularServices.map((service, index) => {
                    const Icon = getIcon(service.icon);
                    return (
                      <Link 
                        key={index} 
                        href={service.slug ? `/services/${service.slug}` : '/services'}
                        className="location-service-item"
                      >
                        <div className="location-service-content">
                          <div className="location-service-icon">
                            <Icon />
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
                <div className="location-view-services">
                  <Link href="/services" className="location-view-services-btn">
                    View All Services
                  </Link>
                </div>
              </div>
            )}

            {/* Service Coverage Area */}
            {location.neighborhoods && location.neighborhoods.length > 0 && (
              <div className="location-section-card">
                <h2 className="location-section-title">
                  Service Coverage Area
                </h2>
                <div className="location-coverage-text">
                  <MapPin />
                  <p className="location-section-text">
                    We proudly serve {location.city} and surrounding areas
                    within a {location.serviceRadius?.miles || 45} miles radius.
                    {location.serviceRadius?.population && (
                      <> Serving a population of approximately{" "}
                        {location.serviceRadius.population} residents with
                        professional technology support and smart home installation
                        services.
                      </>
                    )}
                  </p>
                </div>

                <div className="location-coverage-wrapper">
                  <p className="location-zip-codes-label">
                    ZIP Codes Served:
                  </p>
                  <div className="location-zip-codes">
                    {location.neighborhoods.slice(0, 5).map((zip, index) => (
                      <span key={index} className="location-zip-code">
                        {zip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Testimonials */}
            {location.testimonials && location.testimonials.length > 0 && (
              <div className="location-section-card">
                <h2 className="location-section-title">
                  What {location.city} Customers Say
                </h2>
                <div className="location-testimonials">
                  {location.testimonials.map((testimonial, index) => (
                    <div key={index} className="location-testimonial-card">
                      <div className="location-testimonial-stars">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={i < testimonial.rating ? "filled" : "empty"}
                          />
                        ))}
                      </div>
                      <p className="location-testimonial-text">
                        &quot;{testimonial.text}&quot;
                      </p>
                      <p className="location-testimonial-author">
                        - {testimonial.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Contact Card (Sticky) */}
          <div>
            <div className="location-sidebar">
              <h3 className="location-sidebar-title">
                Contact {location.city} Office
              </h3>

              <div className="location-sidebar-info">
                {location.address && (
                  <div className="location-sidebar-info-item">
                    <MapPin />
                    <div>
                      <p className="location-sidebar-info-label">Address</p>
                      <p className="location-sidebar-info-value">
                        {location.address.street}
                        {location.address.suite && `, ${location.address.suite}`},
                        {" "}{location.city}, {location.state}{" "}
                        {location.address.zipCode}
                      </p>
                    </div>
                  </div>
                )}

                {location.phone && (
                  <div className="location-sidebar-info-item">
                    <Phone />
                    <div>
                      <p className="location-sidebar-info-label">Phone</p>
                      <a
                        href={`tel:${location.phone}`}
                        className="location-sidebar-info-value"
                      >
                        {location.phone}
                      </a>
                    </div>
                  </div>
                )}

                {location.email && (
                  <div className="location-sidebar-info-item">
                    <Mail />
                    <div>
                      <p className="location-sidebar-info-label">Email</p>
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
                      <p className="location-sidebar-info-label">Hours</p>
                      <div className="location-sidebar-hours">
                        {location.hours.weekday && (
                          <p className="location-sidebar-info-value">
                            {location.hours.weekday}
                          </p>
                        )}
                        {location.hours.weekend && (
                          <p className="location-sidebar-info-value">
                            {location.hours.weekend}
                          </p>
                        )}
                        {location.hours.emergency && (
                          <p className="location-sidebar-emergency">
                            {location.hours.emergency}
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
                    href={`tel:${location.phone}`}
                    className="location-call-button"
                  >
                    Call Now
                  </a>
                )}
                <Link href="/#contact" className="location-request-button">
                  Request Service
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
                      <p className="location-badge-label">{badge}</p>
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
            Professional Tech Support in {location.city}, {location.state}
          </h2>
          <div className="location-seo-content">
            <p>
              Looking for reliable technology support in {location.city}?
              TechSupport Pro is your trusted local provider for all
              tech-related services. Whether you need help with smart home
              installation, computer repair, network setup, or home
              entertainment systems, our certified technicians in{" "}
              {location.city} are here to help.
            </p>
            <p>
              We understand the unique needs of {location.city} residents
              and businesses. That&apos;s why we offer flexible scheduling,
              transparent pricing, and guaranteed satisfaction on every
              service call. From simple TV mounting to complex whole-home
              automation, we have the expertise to handle any technology
              challenge.
            </p>
            <p>
              <strong>
                Services we provide in {location.city} include:
              </strong>{" "}
              Smart home installation and automation, TV mounting and home
              theater setup, computer repair and upgrades, WiFi and network
              configuration, security camera installation, smart thermostat
              setup, printer installation, smart lighting systems, home
              entertainment systems, and much more. Contact us today to
              schedule service in {location.city}, {location.state}.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
