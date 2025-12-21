"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllActiveLocations, Location } from "@/lib/sanityLocations";
import { urlFor } from "@/lib/sanityImage";
import { MapPin, Phone, Search, ArrowRight } from "lucide-react";

export default function LocationsPage() {
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
  const totalStates = states.length;
  const totalCities = locations.length;

  return (
    <div className="locations-page">
      {/* Hero Section */}
      <section className="locations-hero">
        <div className="locations-hero-container">
          <div className="locations-icon-wrapper">
            <MapPin />
          </div>
          <h1>Service Area</h1>
          <p className="locations-hero-subtitle">
            Professional tech support and smart home services for homes and small businesses throughout
            Miami-Dade, Broward County, and surrounding South Florida areas
          </p>
          <p className="locations-hero-badge">
            ✦ Serving Miami, Fort Lauderdale & 15+ surrounding cities
          </p>
        </div>
      </section>

      {/* Search and Filter */}
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
            <>
              {filteredLocations.map((location) => (
                <Link
                  key={location._id}
                  href={`/locations/${location.slug.current}`}
                  className="location-card"
                >
                  {/* Image */}
                  {location.heroImage && (
                    <div className="location-card-image">
                      <Image
                        src={urlFor(location.heroImage).width(600).height(400).url()}
                        alt={location.city}
                        fill
                        className="object-cover"
                      />
                      <div className="location-card-gradient" />
                    </div>
                  )}

                  {/* Content */}
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
                        <span>Service Radius: 50 miles</span>
                      </div>
                    </div>

                    <div className="location-card-footer">
                      <span className="location-card-link">View Details</span>
                      <ArrowRight className="location-card-arrow" />
                    </div>
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>
      </section>

      {/* Nationwide Coverage */}
      <section className="locations-coverage-section">
        <div className="locations-coverage-container">
          <div className="locations-coverage-card">
            <h2 className="locations-coverage-title">South Florida Coverage</h2>
            <p className="locations-coverage-description">
              Serving homes and small businesses in Miami, Fort Lauderdale, Pembroke Pines, and all surrounding
              South Florida communities. If you&apos;re in the Miami-Dade or Broward County area,
              we&apos;ve got you covered with fast, reliable tech support.
            </p>

            <div className="locations-coverage-stats">
              <div>
                <div className="location-stat-value">Same Day</div>
                <div className="location-stat-label">Service</div>
              </div>
              <div>
                <div className="location-stat-value">Expert</div>
                <div className="location-stat-label">Tech Support</div>
              </div>
              <div>
                <div className="location-stat-value">15+ Cities</div>
                <div className="location-stat-label">South Florida</div>
              </div>
              <div>
                <div className="location-stat-value">Fair Rates</div>
                <div className="location-stat-label">No Hidden Fees</div>
              </div>
            </div>

            <Link href="/#contact" className="locations-cta-button">
              Request Service in Your Area
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
