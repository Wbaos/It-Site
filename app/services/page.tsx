import { sanity } from "@/lib/sanity";
import Image from "next/image";

export default async function ServicesPage() {
    const services = await sanity.fetch(`*[_type == "service"] | order(title asc) {
    _id,
    title,
    slug,
    category,
    description,
    price,
    image { asset -> { url } }
  }`);
    console.log("Fetched services:", services);

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
                                {service.image?.asset?.url && (
                                    <Image
                                        src={service.image.asset.url}
                                        alt={service.title}
                                        width={400}
                                        height={250}
                                        className="service-image"
                                        priority={index === 0}
                                        fetchPriority={index === 0 ? "high" : "auto"}
                                    />
                                )}
                                <div className="service-content">
                                    <h2 className="service-title">{service.title}</h2>
                                    <p className="service-category">{service.category}</p>
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
