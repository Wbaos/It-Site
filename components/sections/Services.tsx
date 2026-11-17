import Link from "next/link";
import Image from "next/image";
import { sanity } from "@/lib/sanity";
import { urlFor } from "@/lib/sanityImage";
import { serviceHref } from "@/lib/serviceTwins";
import { serviceCardText } from "@/lib/serviceCardText";

export const revalidate = 0;

// Home cards show a SHORT excerpt of the service description (first 1–2
// sentences, ~150 chars max, ending with an ellipsis) — never the full
// description. The full text stays in Sanity untouched: it is the service
// page's SEO content. The card only teases it, so all cards stay short
// and roughly the same height. Same helper as the Services hub cards.
function shortExcerpt(text: string | undefined, maxLen = 150): string | undefined {
  if (!text) return undefined;
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLen) return clean;
  // Accumulate whole sentences while they fit within maxLen.
  const sentences = clean.match(/[^.!?]+[.!?]+["”)]?/g) ?? [clean];
  let out = "";
  for (const s of sentences) {
    const next = out ? `${out} ${s.trim()}` : s.trim();
    if (next.length <= maxLen) out = next;
    else break;
  }
  // First sentence alone is longer than maxLen: cut it at a word boundary.
  if (!out) {
    const cut = clean.slice(0, maxLen);
    const lastSpace = cut.lastIndexOf(" ");
    out = lastSpace > 40 ? cut.slice(0, lastSpace) : cut;
  }
  return `${out.trimEnd()}…`;
}

// Spanish titles/descriptions reused from the former Spanish home page,
// keyed by service slug. The service list itself still comes from Sanity
// (same fetch, same order, same icons); only the displayed text is
// overridden for slugs that have a Spanish entry, so the card structure
// is identical in both languages.
const SERVICES_ES: Record<string, { title: string; description: string }> = {
  "sprinkler-repair-and-installation": {
    title: "Reparación de Sprinklers",
    description:
      "Reparación de sprinklers e irrigación, y sistemas nuevos, en Miami y Broward.",
  },
  "sprinkler-leak-repair": {
    title: "Reparación de Fugas de Sprinklers",
    description: "Detectamos y reparamos fugas en líneas, cabezales y válvulas de tu sistema.",
  },
  "sprinkler-valve-repair": {
    title: "Reparación de Válvulas de Sprinklers",
    description:
      "Válvulas que no abren, no cierran o dejan una zona sin regar: las diagnosticamos y reparamos.",
  },
  "sprinkler-pump-replacement": {
    title: "Reemplazo de Bombas de Sprinklers",
    description: "Bombas para sistemas de irrigación: reemplazo e instalación.",
  },
  "sprinkler-timer-installation": {
    title: "Instalación de Temporizadores de Sprinklers",
    description: "Temporizadores y controladores para que tu sistema riegue en el horario correcto.",
  },
  "wifi-sprinkler-controller-upgrade": {
    title: "Actualización a Controlador WiFi de Sprinklers",
    description: "Controla tu sistema desde el teléfono con un controlador WiFi moderno.",
  },
  "rain-sensor-installation": {
    title: "Instalación de Sensores de Lluvia",
    description: "Sensores que detienen el riego cuando llueve, para no desperdiciar agua.",
  },
  "new-irrigation-installation": {
    title: "Instalación Nueva de Irrigación",
    description: "Sistemas de irrigación nuevos, diseñados e instalados desde cero.",
  },
  "commercial-irrigation-hoa-services": {
    title: "Riego Comercial y para HOA",
    description:
      "Riego comercial y para HOA en Miami y Broward: auditoría gratis, chequeos mensuales con reporte escrito y plan de mantenimiento.",
  },
  "new-irrigation-well-installation": {
    title: "Instalación de Pozos Nuevos de Irrigación",
    description:
      "Instalación de pozos nuevos de irrigación en Miami y Broward para casas y negocios.",
  },
  "home-security": {
    title: "Instalación de Cámaras de Seguridad",
    description: "Cámaras de seguridad para casas y pequeños negocios.",
  },
  // Live popular-services slug for the camera card (verified on the live
  // home page); the duplicate's home-security entry is kept as a fallback.
  "wireless-camera-installation": {
    title: "Instalación de Cámaras Inalámbricas",
    description:
      "Instalación y configuración profesional de cámaras de seguridad inalámbricas en Miami y Broward para tu casa o pequeño negocio. Incluye montaje, optimización de ubicación, configuración de la app y pruebas de conexión.",
  },
};

export default async function Services({ locale = "en" }: { locale?: "en" | "es" }) {
  const isSpanish = locale === "es";
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
      },
      image {
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
        <h2 id="services-title" className="services-heading">{isSpanish ? "Servicios Populares en Miami y Broward" : "Popular Services in Miami & Broward"}</h2>
        <p className="services-sub">
          {isSpanish
            ? "Desde la reparación de sprinklers y la solución de problemas de irrigación hasta la instalación de cámaras de seguridad, ayudamos a casas y pequeños negocios en Miami y Broward."
            : "From sprinkler repair and irrigation troubleshooting to security camera installation, we help homes and small businesses across Miami and Broward."}
        </p>

       <div className="services-grid">
        {sortedServices.map((s: any) => {
          const es = isSpanish ? SERVICES_ES[s.slug] : undefined;
          const title = es?.title ?? s.title;
          const description = es?.description ?? s.description;
          return (
          <Link key={s._id} href={serviceHref(s.slug, locale)} className="service-card">

            {s.image?.asset && (
              <div className="service-card-photo">
                <Image
                  src={urlFor(s.image).width(480).height(270).url()}
                  alt={s.image?.alt || title}
                  width={480}
                  height={270}
                  sizes="(max-width: 760px) 90vw, 480px"
                />
              </div>
            )}


            <h3 className="service-card-title">{title}</h3>

            {description && (
              <p className="service-card-desc">{serviceCardText(s.slug, isSpanish ? "es" : "en") ?? shortExcerpt(description)}</p>
            )}

            <div className="service-card-bottom">
              {s.showPrice && s.price && (
                <p className="service-card-price">${s.price}</p>
              )}
              {/* No badge for in-home services: every job is done at the
                  customer's property by definition, so the "In-Home" tag
                  was redundant. The Online / Online + In-Home labels stay
                  for services that use them. */}
              {s.mode === "online" && (
                <span className="service-card-mode">
                  {isSpanish ? "En Línea" : "Online"}
                </span>
              )}
              {s.mode === "both" && (
                <span className="service-card-mode">
                  {isSpanish ? "En Línea / A Domicilio" : "Online / In-Home"}
                </span>
              )}
            </div>

            <div className="service-card-btn">{isSpanish ? "Ver Detalles" : "View Details"}</div>

          </Link>
          );
        })}
      </div>


      </div>
    </section>
  );
}
