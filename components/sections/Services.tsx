import Link from "next/link";

type Service = {
  title: string;
  desc: string;
  icon: string;
  slug: string;
};

type Props = {
  items: Service[];
  id?: string;
};

export default function Services({ items, id = "services" }: Props) {
  return (
    <section id={id} className="section services">
      <div className="site-container-services">
        <h2 className="services-heading">Popular Tech Services</h2>
        <p className="services-sub">
          Helping seniors stay connected, safe, and confident with technology.
        </p>

        <div className="services-grid">
          {items.map((s, i) => (
            <Link key={i} href={`/services/${s.slug}`} className="service-card">
              <div className="service-icon">{s.icon}</div>
              <h3 className="service-title">{s.title}</h3>
              <p className="service-desc">{s.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
