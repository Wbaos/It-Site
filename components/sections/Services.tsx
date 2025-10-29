import Link from "next/link";
import Image from "next/image";
import { sanity } from "@/lib/sanity";
import { urlFor } from "@/lib/sanityImage";

export const revalidate = 0;

export default async function Services() {
  const services = await sanity.fetch(`
    *[_type == "service" && popular == true && enabled == true] | order(title asc)[0...8]{
      _id,
      title,
      "slug": slug.current,
      description,
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

        {services.length === 0 ? (
          <p className="no-services">No services available yet.</p>
        ) : (
          <div className="services-grid">
            {services.map((s: any) => (
              <Link key={s._id} href={`/services/${s.slug}`} className="service-card">
                <div className="service-icon">
                  {s.icon ? (
                    <Image
                      src={urlFor(s.icon).width(120).height(120).auto("format").url()}
                      alt={`${s.title} icon`}
                      width={120}
                      height={120}
                      className="icon-img"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 120px"
                    />
                  ) : (
                    "💻"
                  )}
                </div>

                <h3 className="service-title">{s.title}</h3>
                {s.description && <p className="service-desc">{s.description}</p>}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
