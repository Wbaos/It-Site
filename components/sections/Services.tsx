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
      icon {
        asset->{url},
        alt
      }
    }
  `);

  return (
    <section
      id="services"
      className="section services"
      role="region"
      aria-labelledby="services-title"
    >
      <div className="site-container-services">
        <h2 id="services-title" className="services-heading">Popular Home, Outdoor & Tech Services in South Florida</h2>
        <p className="services-sub">
          From security camera installation and TV mounting to Wi-Fi & internet
          troubleshooting, computer and printer support, phone & tablet help, and
          sprinkler & irrigation service, we serve homes, seniors, and small
          businesses across South Florida with reliable, on-site service you can
          trust.
        </p>

       <div className="services-grid">
        {services.map((s: any) => (
          <Link key={s._id} href={`/services/${s.slug}`} className="service-card">

            <div className="service-card-icon">
              {s.icon?.asset && (
                <Image
                  src={urlFor(s.icon).url()}
                  alt={s.icon?.alt || `${s.title} service icon`}
                  width={40}
                  height={40}
                />
              )}
            </div>


            <h3 className="service-card-title">{s.title}</h3>

            {s.description && (
              <p className="service-card-desc">{s.description}</p>
            )}

            <div className="service-card-bottom">
              {s.showPrice && s.price && (
                <p className="service-card-price">${s.price}</p>
              )}
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
