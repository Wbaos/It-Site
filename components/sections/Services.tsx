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

  const getServicePriority = (value: unknown) => {
    const text = typeof value === "string" ? value.toLowerCase() : "";
    if (text.includes("sprinkler") || text.includes("irrigation")) return 0;
    if (text.includes("camera") || text.includes("cctv") || text.includes("security")) return 1;
    if (text.includes("wifi") || text.includes("wi-fi") || text.includes("computer") || text.includes("printer") || text.includes("tech")) return 2;
    return 3;
  };

  const sortedServices = (Array.isArray(services) ? services : []).slice().sort((a: any, b: any) => {
    const aPriority = getServicePriority(a?.title);
    const bPriority = getServicePriority(b?.title);
    if (aPriority !== bPriority) return aPriority - bPriority;
    return String(a?.title ?? "").localeCompare(String(b?.title ?? ""));
  });

  return (
    <section
      id="services"
      className="section services"
      role="region"
      aria-labelledby="services-title"
    >
      <div className="site-container-services">
        <h2 id="services-title" className="services-heading">Popular Services in Miami & Broward</h2>
        <p className="services-sub">
          From sprinkler repair and irrigation troubleshooting to security camera installation and expert tech support (Wi-Fi,
          computers, and printers), we help homes and small businesses across Miami and Broward with reliable, on-site service.
        </p>

       <div className="services-grid">
        {sortedServices.map((s: any) => (
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
