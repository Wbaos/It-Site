import { sanity } from "@/lib/sanity";
import { urlFor } from "@/lib/sanityImage";
import Image from "next/image";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Explore CallTechCare services including TV mounting, security camera installation, WiFi troubleshooting, and in-home IT support across South Florida.",
  alternates: {
    canonical: "https://www.calltechcare.com/services",
  },
};


export default async function ServicesPage() {
    const services = await sanity.fetch(`*[_type == "service" && enabled == true] | order(title asc) {
    _id,
    title,
    slug,
    category->{ title, slug },
    description,
    navDescription,
    price,
    image
  }`);

    // Group services by category
    const servicesByCategory = services.reduce((acc: any, service: any) => {
        const categoryTitle = service.category?.title || "Other Services";
        if (!acc[categoryTitle]) {
            acc[categoryTitle] = [];
        }
        acc[categoryTitle].push(service);
        return acc;
    }, {});

    return (
        <>
            {/* Hero Section */}
            <section className="services-list-hero">
                <div className="services-list-hero-container">
                    <div className="services-list-icon-wrapper">
                        <Briefcase />
                    </div>
                    <h1>Our Services</h1>
                    <p className="services-list-hero-subtitle">
                        Professional tech support and smart home solutions for homes and small businesses
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
                        <p className="services-list-empty">No services available yet.</p>
                    ) : (
                        <div className="services-list-categories">
                            {Object.entries(servicesByCategory).map(([category, categoryServices]: [string, any]) => (
                                <div key={category} className="services-list-category-section">
                                    <h2 className="services-list-category-title">{category}</h2>
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
                                                            src={urlFor(service.image).width(400).height(250).auto("format").url()}
                                                            alt={service.title}
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
                                                    <h3 className="services-list-card-title">{service.title}</h3>
                                                    <p className="services-list-card-description">
                                                        {service.description}
                                                    </p>
                                                    <div className="services-list-card-footer">
                                                        <span className="services-list-card-price">${service.price}</span>
                                                        <span className="services-list-card-link">Learn More →</span>
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
