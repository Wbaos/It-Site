import Link from "next/link";
import Image from "next/image";
import { sanity } from "@/lib/sanity";
import { urlFor } from "@/lib/sanityImage";

export const revalidate = 0;

export default async function Services() {
  const services = await sanity.fetch(`
    *[_type == "service" && popular == true && enabled == true] | order(title asc)[0...12]{
      _id,
      title,
      "slug": slug.current,
      price,
      showPrice,
      description,
      mode,
      icon
    }
  `);

  return (
    <section id="services" className="section services">
      <div className="site-container-services">
        <h2 className="services-heading">Popular Tech Services</h2>
        <p className="services-sub">
          Helping customers stay connected, safe, and confident with technology.
        </p>

       <div className="services-grid">
        {services.map((s: any) => (
          <Link key={s._id} href={`/services/${s.slug}`} className="service-card">

            <div className="service-card-icon">
              <Image
                src={urlFor(s.icon).width(90).height(90).url()}
                alt={s.title}
                width={90}
                height={90}
              />
            </div>

            <h3 className="service-card-title">{s.title}</h3>

            {s.description && (
              <p className="service-card-desc">{s.description}</p>
            )}

            <div className="service-card-bottom">
              <p className="service-card-price">${s.price}</p>

              {s.mode && (
                <span className="service-card-mode">
                  {s.mode === "in-home" && "In-Home"}
                  {s.mode === "online" && "Online"}
                  {s.mode === "both" && "Online / In-Home"}
                </span>
              )}
            </div>

            <div className="service-card-btn">View Details</div>

          </Link>
        ))}
      </div>


      </div>
    </section>
  );
}
