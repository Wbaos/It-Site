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

const CITY_LINKS_ES: Array<[string, string]> = [
  ["Sunrise", "/es/reparacion-de-sprinklers-sunrise"],
  ["Fort Lauderdale", "/es/areas-de-servicio/fort-lauderdale"],
  ["Dania Beach", "/es/reparacion-de-sprinklers-dania-beach"],
  ["Weston", "/es/reparacion-de-sprinklers-weston"],
  ["Davie", "/es/reparacion-de-sprinklers-davie"],
  ["Southwest Ranches", "/es/reparacion-de-sprinklers-southwest-ranches"],
  ["Hollywood", "/es/reparacion-de-sprinklers-hollywood"],
  ["West Park", "/es/reparacion-de-sprinklers-west-park"],
  ["Pembroke Pines", "/es/reparacion-de-sprinklers-pembroke-pines"],
  ["Miramar", "/es/reparacion-de-sprinklers-miramar"],
  ["Miami Gardens", "/es/reparacion-de-sprinklers-miami-gardens"],
  ["Miami Lakes", "/es/reparacion-de-sprinklers-miami-lakes"],
  ["Country Club", "/es/reparacion-de-sprinklers-country-club"],
  ["Aventura", "/es/reparacion-de-sprinklers-aventura"],
  ["Sunny Isles Beach", "/es/reparacion-de-sprinklers-sunny-isles-beach"],
  ["North Miami", "/es/reparacion-de-sprinklers-north-miami"],
  ["Surfside", "/es/reparacion-de-sprinklers-surfside"],
  ["North Bay Village", "/es/reparacion-de-sprinklers-north-bay-village"],
  ["Miami Beach", "/es/reparacion-de-sprinklers-miami-beach"],
  ["Hialeah", "/es/reparacion-de-sprinklers-hialeah"],
  ["Doral", "/es/reparacion-de-sprinklers-doral"],
  ["Fontainebleau", "/es/reparacion-de-sprinklers-fontainebleau"],
  ["Tamiami", "/es/reparacion-de-sprinklers-tamiami"],
  ["Miami", "/es/areas-de-servicio/miami"],
  ["Coral Gables", "/es/reparacion-de-sprinklers-coral-gables"],
  ["Key Biscayne", "/es/reparacion-de-sprinklers-key-biscayne"],
  ["Kendall", "/es/reparacion-de-sprinklers-kendall"],
  ["Kendale Lakes", "/es/reparacion-de-sprinklers-kendale-lakes"],
  ["Country Walk", "/es/reparacion-de-sprinklers-country-walk"],
  ["Cutler Bay", "/es/reparacion-de-sprinklers-cutler-bay"],
];

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
  const [selectedState, setSelectedState] = useState("All States");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllActiveLocations().then((data) => {
      setLocations(data);
      setFilteredLocations(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let filtered = locations;

    if (selectedState !== "All States") {
      filtered = filtered.filter((loc) => loc.state === selectedState);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (loc) =>
          loc.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          loc.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLocations(filtered);
  }, [searchTerm, selectedState, locations]);

  const states = Array.from(new Set(locations.map((loc) => loc.state)));

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
                  placeholder={isSpanish ? "Buscar por ciudad o estado..." : "Search by city or state..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="locations-search-input"
                />
              </div>

              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="locations-select"
              >
                <option value="All States">{isSpanish ? "Todos los Estados" : "All States"}</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <p className="locations-count">
              {isSpanish ? `Mostrando ${filteredLocations.length} ubicación${filteredLocations.length !== 1 ? "es" : ""}` : <>Showing {filteredLocations.length} location{filteredLocations.length !== 1 ? "s" : ""}</>}
            </p>
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
              {isSpanish ? "No se encontraron ubicaciones que coincidan con tu criterio." : "No locations found matching your criteria."}
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
                    <p className="location-card-state">{location.state}</p>
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
{isSpanish ? (
            <p className="locations-coverage-description">
              Reparación de sprinklers e irrigación en Miami-Dade y Broward: {CITY_LINKS_ES.map(([label, href], i) => (
                <span key={href}>
                  {i > 0 && (i === CITY_LINKS_ES.length - 1 ? " y " : ", ")}
                  <Link href={href}>{label}</Link>
                </span>
              ))}.
            </p>
            ) : (
            <p className="locations-coverage-description">
              Sprinkler repair and irrigation across Miami-Dade and Broward: <Link href="/sprinkler-repair-sunrise">Sunrise</Link>, <Link href="/sprinkler-repair-fort-lauderdale">Fort Lauderdale</Link>, <Link href="/sprinkler-repair-dania-beach">Dania Beach</Link>, <Link href="/sprinkler-repair-weston">Weston</Link>, <Link href="/sprinkler-repair-davie">Davie</Link>, <Link href="/sprinkler-repair-southwest-ranches">Southwest Ranches</Link>, <Link href="/sprinkler-repair-hollywood">Hollywood</Link>, <Link href="/sprinkler-repair-west-park">West Park</Link>, <Link href="/sprinkler-repair-pembroke-pines">Pembroke Pines</Link>, <Link href="/sprinkler-repair-miramar">Miramar</Link>, <Link href="/sprinkler-repair-miami-gardens">Miami Gardens</Link>, <Link href="/sprinkler-repair-miami-lakes">Miami Lakes</Link>, <Link href="/sprinkler-repair-country-club">Country Club</Link>, <Link href="/sprinkler-repair-aventura">Aventura</Link>, <Link href="/sprinkler-repair-sunny-isles-beach">Sunny Isles Beach</Link>, <Link href="/sprinkler-repair-north-miami">North Miami</Link>, <Link href="/sprinkler-repair-surfside">Surfside</Link>, <Link href="/sprinkler-repair-north-bay-village">North Bay Village</Link>, <Link href="/sprinkler-repair-miami-beach">Miami Beach</Link>, <Link href="/sprinkler-repair-hialeah">Hialeah</Link>, <Link href="/sprinkler-repair-doral">Doral</Link>, <Link href="/sprinkler-repair-fontainebleau">Fontainebleau</Link>, <Link href="/sprinkler-repair-tamiami">Tamiami</Link>, <Link href="/sprinkler-repair-miami">Miami</Link>, <Link href="/sprinkler-repair-coral-gables">Coral Gables</Link>, <Link href="/sprinkler-repair-key-biscayne">Key Biscayne</Link>, <Link href="/sprinkler-repair-kendall">Kendall</Link>, <Link href="/sprinkler-repair-kendale-lakes">Kendale Lakes</Link>, <Link href="/sprinkler-repair-country-walk">Country Walk</Link> and <Link href="/sprinkler-repair-cutler-bay">Cutler Bay</Link>.
            </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
