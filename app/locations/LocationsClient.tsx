"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllActiveLocations, Location } from "@/lib/sanityLocations";
import { urlFor } from "@/lib/sanityImage";
import { FALLBACK_SETTINGS } from "@/lib/sanitySettings";
import { MapPin, Phone, Search, ArrowRight } from "lucide-react";

const DESCRIPTION_ES: Record<string, string> = {
  miami: "CallTechCare ofrece reparación profesional de sprinklers e instalación de irrigación en Miami para propiedades residenciales y comerciales. También ofrecemos instalación de cámaras de seguridad. Atendemos todos los barrios de Miami con servicio rápido y confiable y estimados claros.",
  "fort-lauderdale": "CallTechCare ofrece reparación profesional de sprinklers e instalación de irrigación en Fort Lauderdale para propiedades residenciales y comerciales. También ofrecemos instalación de cámaras de seguridad en todo el condado de Broward con servicio rápido y confiable.",
};

const CITY_LINKS: Array<{ name: string; en: string; es: string }> = [
  { name: "Sunrise", en: "/sprinkler-repair-sunrise", es: "/es/reparacion-de-sprinklers-sunrise" },
  { name: "Fort Lauderdale", en: "/sprinkler-repair-fort-lauderdale", es: "/es/areas-de-servicio/fort-lauderdale" },
  { name: "Dania Beach", en: "/sprinkler-repair-dania-beach", es: "/es/reparacion-de-sprinklers-dania-beach" },
  { name: "Weston", en: "/sprinkler-repair-weston", es: "/es/reparacion-de-sprinklers-weston" },
  { name: "Davie", en: "/sprinkler-repair-davie", es: "/es/reparacion-de-sprinklers-davie" },
  { name: "Southwest Ranches", en: "/sprinkler-repair-southwest-ranches", es: "/es/reparacion-de-sprinklers-southwest-ranches" },
  { name: "Hollywood", en: "/sprinkler-repair-hollywood", es: "/es/reparacion-de-sprinklers-hollywood" },
  { name: "West Park", en: "/sprinkler-repair-west-park", es: "/es/reparacion-de-sprinklers-west-park" },
  { name: "Pembroke Pines", en: "/sprinkler-repair-pembroke-pines", es: "/es/reparacion-de-sprinklers-pembroke-pines" },
  { name: "Miramar", en: "/sprinkler-repair-miramar", es: "/es/reparacion-de-sprinklers-miramar" },
  { name: "Miami Gardens", en: "/sprinkler-repair-miami-gardens", es: "/es/reparacion-de-sprinklers-miami-gardens" },
  { name: "Miami Lakes", en: "/sprinkler-repair-miami-lakes", es: "/es/reparacion-de-sprinklers-miami-lakes" },
  { name: "Country Club", en: "/sprinkler-repair-country-club", es: "/es/reparacion-de-sprinklers-country-club" },
  { name: "Aventura", en: "/sprinkler-repair-aventura", es: "/es/reparacion-de-sprinklers-aventura" },
  { name: "Sunny Isles Beach", en: "/sprinkler-repair-sunny-isles-beach", es: "/es/reparacion-de-sprinklers-sunny-isles-beach" },
  { name: "North Miami", en: "/sprinkler-repair-north-miami", es: "/es/reparacion-de-sprinklers-north-miami" },
  { name: "Surfside", en: "/sprinkler-repair-surfside", es: "/es/reparacion-de-sprinklers-surfside" },
  { name: "North Bay Village", en: "/sprinkler-repair-north-bay-village", es: "/es/reparacion-de-sprinklers-north-bay-village" },
  { name: "Miami Beach", en: "/sprinkler-repair-miami-beach", es: "/es/reparacion-de-sprinklers-miami-beach" },
  { name: "Hialeah", en: "/sprinkler-repair-hialeah", es: "/es/reparacion-de-sprinklers-hialeah" },
  { name: "Doral", en: "/sprinkler-repair-doral", es: "/es/reparacion-de-sprinklers-doral" },
  { name: "Fontainebleau", en: "/sprinkler-repair-fontainebleau", es: "/es/reparacion-de-sprinklers-fontainebleau" },
  { name: "Tamiami", en: "/sprinkler-repair-tamiami", es: "/es/reparacion-de-sprinklers-tamiami" },
  { name: "Miami", en: "/sprinkler-repair-miami", es: "/es/areas-de-servicio/miami" },
  { name: "Coral Gables", en: "/sprinkler-repair-coral-gables", es: "/es/reparacion-de-sprinklers-coral-gables" },
  { name: "Key Biscayne", en: "/sprinkler-repair-key-biscayne", es: "/es/reparacion-de-sprinklers-key-biscayne" },
  { name: "Kendall", en: "/sprinkler-repair-kendall", es: "/es/reparacion-de-sprinklers-kendall" },
  { name: "Kendale Lakes", en: "/sprinkler-repair-kendale-lakes", es: "/es/reparacion-de-sprinklers-kendale-lakes" },
  { name: "Country Walk", en: "/sprinkler-repair-country-walk", es: "/es/reparacion-de-sprinklers-country-walk" },
  { name: "Cutler Bay", en: "/sprinkler-repair-cutler-bay", es: "/es/reparacion-de-sprinklers-cutler-bay" },
];

const COUNTY_LABEL: Record<string, { en: string; es: string }> = {
  miami: { en: "Miami-Dade County, Florida", es: "Condado de Miami-Dade, Florida" },
  "fort-lauderdale": { en: "Broward County, Florida", es: "Condado de Broward, Florida" },
};

export default function LocationsClient({
  locale = "en",
  phoneDisplay = FALLBACK_SETTINGS.phoneDisplay,
}: {
  locale?: "en" | "es";
  // Business phone from site-settings (passed by the server page). The
  // structured phone field on the Sanity location doc is only a presence
  // flag; the number shown always comes from settings.
  phoneDisplay?: string;
}) {
  const isSpanish = locale === "es";
  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllActiveLocations()
      .then((data) => {
        setLocations(data);
        setFilteredLocations(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = locations;

    if (searchTerm) {
      filtered = filtered.filter(
        (loc) =>
          loc.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          loc.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLocations(filtered);
  }, [searchTerm, locations]);

  const cityQuery = searchTerm.trim().toLowerCase();
  const cityMatches = cityQuery
    ? CITY_LINKS.filter((city) => city.name.toLowerCase().includes(cityQuery))
    : [];

  return (
    <div className="locations-page">
      {/* Hero Section */}
      <section className="locations-hero">
        <div className="locations-hero-container">
          <div className="locations-icon-wrapper">
            <MapPin />
          </div>
          <h1>{isSpanish ? "Áreas de Servicio de Reparación de Sprinklers en Miami y Broward" : "Sprinkler Repair Service Areas in Miami & Broward"}</h1>
          <p className="locations-hero-subtitle">
            {isSpanish ? "Explora las ciudades y comunidades que CallTechCare atiende en Miami-Dade, Broward y áreas cercanas del sur de Florida." : "Browse the cities and communities CallTechCare serves across Miami-Dade, Broward County, and surrounding South Florida areas."}
          </p>
          <p className="locations-hero-badge">
            {isSpanish ? "✦ Atendemos 30 ciudades en Miami-Dade y Broward" : "✦ Serving 30 cities across Miami-Dade & Broward"}
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      {locations.length > 1 && (
        <section className="locations-search-section">
          <div className="locations-search-container">
            <div className="locations-search-wrapper">
              <div className="locations-search-input-wrapper">
                <Search className="locations-search-icon" />
                <input
                  type="text"
                  placeholder={isSpanish ? "Buscar por ciudad..." : "Search by city..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="locations-search-input"
                />
              </div>
            </div>

            <p className="locations-count">
              {isSpanish ? `Mostrando ${filteredLocations.length} área${filteredLocations.length !== 1 ? "s" : ""} de servicio` : <>Showing {filteredLocations.length} service area{filteredLocations.length !== 1 ? "s" : ""}</>}
            </p>
          </div>
        </section>
      )}

      {/* Matching Cities */}
      {cityMatches.length > 0 && (
        <section className="locations-coverage-section">
          <div className="locations-coverage-container">
            <div className="locations-coverage-card">
              <h2 className="locations-coverage-title">
                {isSpanish
                  ? `${cityMatches.length} ${cityMatches.length === 1 ? "ciudad" : "ciudades"} que coinciden con “${searchTerm.trim()}”`
                  : `${cityMatches.length} ${cityMatches.length === 1 ? "city" : "cities"} matching “${searchTerm.trim()}”`}
              </h2>
              <p className="locations-coverage-description">
                {cityMatches.map((city, i) => (
                  <span key={city.en}>
                    {i > 0 && ", "}
                    <Link href={isSpanish ? city.es : city.en}>{city.name}</Link>
                  </span>
                ))}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Locations Grid */}
      <section className="locations-grid-section">
        <div className="locations-grid">
          {loading ? (
            <div className="locations-loading">{isSpanish ? "Cargando..." : "Loading..."}</div>
          ) : filteredLocations.length === 0 ? (
            <div className="locations-empty">
              {cityMatches.length > 0
                ? isSpanish
                  ? "Ningún área de servicio coincide con tu búsqueda — mira las ciudades que coinciden arriba."
                  : "No service areas match your search — see the matching cities above."
                : isSpanish
                  ? "No se encontraron ubicaciones que coincidan con tu criterio."
                  : "No locations found matching your criteria."}
            </div>
          ) : (
            filteredLocations.map((location) => (
              <Link
                key={location._id}
                href={isSpanish ? `/es/areas-de-servicio/${location.slug.current}` : `/locations/${location.slug.current}`}
                className="location-card"
              >
                {location.heroImage && (
                  <div className="location-card-image">
                    <Image
                      src={urlFor(location.heroImage)
                        .width(600)
                        .height(400)
                        .url()}
                      alt={`${location.city}, ${location.state}`}
                      fill
                      sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div className="location-card-gradient" />
                  </div>
                )}

                <div className="location-card-content">
                  <div>
                    <h3 className="location-card-title">{location.city}</h3>
                    <p className="location-card-state">
                      {isSpanish
                        ? COUNTY_LABEL[location.slug.current]?.es ?? location.state
                        : COUNTY_LABEL[location.slug.current]?.en ?? location.state}
                    </p>
                  </div>

                  <p className="location-card-description">
                    {isSpanish ? (DESCRIPTION_ES[location.slug.current] || location.description) : location.description}
                  </p>

                  <div className="location-card-info">
                    {location.phone && (
                      <div className="location-card-info-item">
                        <Phone />
                        <span>{phoneDisplay}</span>
                      </div>
                    )}
                    <div className="location-card-info-item">
                      <MapPin />
                      <span>{isSpanish ? "Radio de servicio: 45 millas" : "Service Radius: 45 miles"}</span>
                    </div>
                  </div>

                  <div className="location-card-footer">
                    <span className="location-card-link">{isSpanish ? "Ver Detalles" : "View Details"}</span>
                    <ArrowRight className="location-card-arrow" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Coverage Section */}
      <section className="locations-coverage-section">
        <div className="locations-coverage-container">
          <div className="locations-coverage-card">
            <h2 className="locations-coverage-title">{isSpanish ? "Cobertura del Sur de Florida" : "South Florida Coverage"}</h2>
            <p className="locations-coverage-description">
{isSpanish ? "Atendemos comunidades en Miami-Dade y Broward en el sur de Florida. Selecciona tu ciudad arriba para ver detalles y disponibilidad del servicio local." : "Serving communities across Miami-Dade and Broward County in South Florida. Select your city above to view local service details and availability."}
            </p>

            <div className="locations-coverage-stats">
              <div>
                <div className="location-stat-value">Miami-Dade</div>
                <div className="location-stat-label">{isSpanish ? "Condado" : "County"}</div>
              </div>
              <div>
                <div className="location-stat-value">Broward</div>
                <div className="location-stat-label">{isSpanish ? "Condado" : "County"}</div>
              </div>
              <div>
                <div className="location-stat-value">30</div>
                <div className="location-stat-label">{isSpanish ? "Ciudades Atendidas" : "Cities Served"}</div>
              </div>
              <div>
                <div className="location-stat-value">{isSpanish ? "45 Millas" : "45 Miles"}</div>
                <div className="location-stat-label">{isSpanish ? "Radio de Servicio" : "Service Radius"}</div>
              </div>
            </div>

            <p className="locations-services-link">
                {isSpanish ? "¿Buscas detalles del servicio?" : "Looking for service details?"}
            </p>
            {!isSpanish && (
              <div className="locations-services-view" >
                  <Link href="/services" className="locations-cta-button">
                      View our services
                  </Link>
              </div>
            )}

            <Link href={isSpanish ? "/es/#contact" : "/#contact"} className="locations-cta-button">
              {isSpanish ? "Solicitar un Servicio Específico" : "Request Specific Service"}
            </Link>
          </div>
        </div>
      </section>

      {/* All Cities Section */}
      <section className="locations-coverage-section">
        <div className="locations-coverage-container">
          <div className="locations-coverage-card">
            <h2 className="locations-coverage-title">{isSpanish ? "Las 30 Ciudades que Atendemos" : "All 30 Cities We Serve"}</h2>
            <p className="locations-coverage-description">
              {isSpanish ? "Reparación de sprinklers e irrigación en Miami-Dade y Broward: " : "Sprinkler repair and irrigation across Miami-Dade and Broward: "}
              {CITY_LINKS.map((city, i) => (
                <span key={city.en}>
                  {i > 0 && (i === CITY_LINKS.length - 1 ? (isSpanish ? " y " : " and ") : ", ")}
                  <Link href={isSpanish ? city.es : city.en}>{city.name}</Link>
                </span>
              ))}
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
