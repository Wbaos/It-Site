"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllActiveLocations, Location } from "@/lib/sanityLocations";
import { urlFor } from "@/lib/sanityImage";
import { MapPin, Phone, Search, ArrowRight } from "lucide-react";

export default function LocationsClient() {
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
          <h1>Sprinkler Repair Service Areas in Miami & Broward</h1>
          <p className="locations-hero-subtitle">
            Browse the cities and communities CallTechCare serves across
            Miami-Dade, Broward County, and surrounding South Florida areas.
          </p>
          <p className="locations-hero-badge">
            ✦ Serving 30 cities across Miami-Dade & Broward
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
                  placeholder="Search by city or state..."
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
                <option value="All States">All States</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <p className="locations-count">
              Showing {filteredLocations.length} location
              {filteredLocations.length !== 1 ? "s" : ""}
            </p>
          </div>
        </section>
      )}

      {/* Locations Grid */}
      <section className="locations-grid-section">
        <div className="locations-grid">
          {loading ? (
            <div className="locations-loading">Loading...</div>
          ) : filteredLocations.length === 0 ? (
            <div className="locations-empty">
              No locations found matching your criteria.
            </div>
          ) : (
            filteredLocations.map((location) => (
              <Link
                key={location._id}
                href={`/locations/${location.slug.current}`}
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
                    {location.description}
                  </p>

                  <div className="location-card-info">
                    {location.phone && (
                      <div className="location-card-info-item">
                        <Phone />
                        <span>{location.phone}</span>
                      </div>
                    )}
                    <div className="location-card-info-item">
                      <MapPin />
                      <span>Service Radius: 45 miles</span>
                    </div>
                  </div>

                  <div className="location-card-footer">
                    <span className="location-card-link">View Details</span>
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
            <h2 className="locations-coverage-title">South Florida Coverage</h2>
            <p className="locations-coverage-description">
              Serving communities across Miami-Dade and Broward County in South
              Florida. Select your city above to view local service details and
              availability.
            </p>

            <div className="locations-coverage-stats">
              <div>
                <div className="location-stat-value">Miami-Dade</div>
                <div className="location-stat-label">County</div>
              </div>
              <div>
                <div className="location-stat-value">Broward</div>
                <div className="location-stat-label">County</div>
              </div>
              <div>
                <div className="location-stat-value">30</div>
                <div className="location-stat-label">Cities Served</div>
              </div>
              <div>
                <div className="location-stat-value">45 Miles</div>
                <div className="location-stat-label">Service Radius</div>
              </div>
            </div>

            <p className="locations-services-link">
                Looking for service details?
            </p>
            <div className="locations-services-view" >
                <Link href="/services" className="locations-cta-button">
                    View our services
                </Link>
            </div>

            <Link href="/#contact" className="locations-cta-button">
              Request Specific Service
            </Link>
          </div>
        </div>
      </section>

      {/* All Cities Section */}
      <section className="locations-coverage-section">
        <div className="locations-coverage-container">
          <div className="locations-coverage-card">
            <h2 className="locations-coverage-title">All 30 Cities We Serve</h2>
            <p className="locations-coverage-description">
              Sprinkler repair and irrigation across Miami-Dade and Broward: <Link href="/sprinkler-repair-sunrise">Sunrise</Link>, <Link href="/locations/fort-lauderdale">Fort Lauderdale</Link>, <Link href="/sprinkler-repair-dania-beach">Dania Beach</Link>, <Link href="/sprinkler-repair-weston">Weston</Link>, <Link href="/sprinkler-repair-davie">Davie</Link>, <Link href="/sprinkler-repair-southwest-ranches">Southwest Ranches</Link>, <Link href="/sprinkler-repair-hollywood">Hollywood</Link>, <Link href="/sprinkler-repair-west-park">West Park</Link>, <Link href="/sprinkler-repair-pembroke-pines">Pembroke Pines</Link>, <Link href="/sprinkler-repair-miramar">Miramar</Link>, <Link href="/sprinkler-repair-miami-gardens">Miami Gardens</Link>, <Link href="/sprinkler-repair-miami-lakes">Miami Lakes</Link>, <Link href="/sprinkler-repair-country-club">Country Club</Link>, <Link href="/sprinkler-repair-aventura">Aventura</Link>, <Link href="/sprinkler-repair-sunny-isles-beach">Sunny Isles Beach</Link>, <Link href="/sprinkler-repair-north-miami">North Miami</Link>, <Link href="/sprinkler-repair-surfside">Surfside</Link>, <Link href="/sprinkler-repair-north-bay-village">North Bay Village</Link>, <Link href="/sprinkler-repair-miami-beach">Miami Beach</Link>, <Link href="/sprinkler-repair-hialeah">Hialeah</Link>, <Link href="/sprinkler-repair-doral">Doral</Link>, <Link href="/sprinkler-repair-fontainebleau">Fontainebleau</Link>, <Link href="/sprinkler-repair-tamiami">Tamiami</Link>, <Link href="/locations/miami">Miami</Link>, <Link href="/sprinkler-repair-coral-gables">Coral Gables</Link>, <Link href="/sprinkler-repair-key-biscayne">Key Biscayne</Link>, <Link href="/sprinkler-repair-kendall">Kendall</Link>, <Link href="/sprinkler-repair-kendale-lakes">Kendale Lakes</Link>, <Link href="/sprinkler-repair-country-walk">Country Walk</Link> y <Link href="/sprinkler-repair-cutler-bay">Cutler Bay</Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
