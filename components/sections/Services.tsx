import Link from "next/link";
import { sanity } from "@/lib/sanity";

export const revalidate = 60;

export default async function Services() {
  const services = await sanity.fetch(`
    *[_type == "service" && popular == true] | order(title asc)[0...8]{
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
          Helping seniors stay connected, safe, and confident with technology.
        </p>

        {services.length === 0 ? (
          <p className="no-services">No services available yet.</p>
        ) : (
          <div className="services-grid">
            {services.map((s: any) => (
              <Link
                key={s._id}
                href={`/services/${s.slug}`}
                className="service-card"
              >
                <div className="service-icon">  {s.icon ? s.icon : "💻"}
                </div>
                <h3 className="service-title">{s.title}</h3>
                {s.description && (
                  <p className="service-desc">{s.description}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
