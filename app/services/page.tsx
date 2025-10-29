import { sanity } from "@/lib/sanity";
import { urlFor } from "@/lib/sanityImage";
import Image from "next/image";

export default async function ServicesPage() {
    const services = await sanity.fetch(`*[_type == "service" && enabled == true] | order(title asc) {
    _id,
    title,
    slug,
    category->{ title },
    description,
    price,
    image
  }`);

    return (
        <section className="services-page">
            <div className="services-container">
                <h1 className="services-title">Our Services</h1>

                {services.length === 0 ? (
                    <p className="no-services">No services available yet.</p>
                ) : (
                    <div className="services-grid">
                        {services.map((service: any, index: number) => (
                            <div key={service._id} className="service-card">
                                {service.image && (
                                    <Image
                                        src={urlFor(service.image).width(400).height(250).auto("format").url()}
                                        alt={service.title}
                                        width={400}
                                        height={250}
                                        className="service-image"
                                        priority={index === 0}
                                        fetchPriority={index === 0 ? "high" : "auto"}
                                        sizes="(max-width: 768px) 100vw, 400px"
                                    />
                                )}

                                <div className="service-content">
                                    <h2 className="service-title">{service.title}</h2>
                                    <p className="service-category">
                                        {service.category?.title || "Uncategorized"}
                                    </p>
                                    <p className="service-description">{service.description}</p>
                                    <p className="service-price">${service.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
