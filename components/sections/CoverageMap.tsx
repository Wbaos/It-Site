"use client";

// Service-area section with the interactive city map. Used in two places
// with the same component and copy: the home (after How It Works) and the
// top of /locations. Client component so the /locations client page can
// render it too. The Leaflet map itself loads with ssr: false.
// `showCityList` hides the text list of the 32 cities on /locations,
// where that list already exists further down the page.
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { MAP_CITIES } from "@/lib/cityCoordinates";
import { cityHref } from "@/lib/cityTwins";

const CityMap = dynamic(() => import("./CityMap"), { ssr: false });

export default function CoverageMap({
  locale = "en",
  showCityList = true,
}: {
  locale?: "en" | "es";
  showCityList?: boolean;
}) {
  const isSpanish = locale === "es";
  // The text list starts collapsed: the map + search already find the
  // city, so the full 32-city list below it reads as a repeat.
  const [listOpen, setListOpen] = useState(false);
  return (
    <section className="section coverage-map-section" aria-labelledby="coverage-map-title">
      <div className="site-container">
        <p className="coverage-map-eyebrow">
          {isSpanish ? "Área de servicio" : "Service Area"}
        </p>
        <h2 id="coverage-map-title" className="coverage-map-title">
          {isSpanish ? "Dónde Trabajamos" : "Where We Work"}
        </h2>
        <p className="coverage-map-sub">
          {isSpanish
            ? "Toca tu ciudad en el mapa — o búscala — para ver la reparación de sprinklers e irrigación en tu zona."
            : "Tap your city on the map — or search it — to see sprinkler repair and irrigation in your area."}
        </p>
        <CityMap locale={locale} />
        {showCityList ? (
          <>
            <button
              type="button"
              className="coverage-map-list-toggle"
              aria-expanded={listOpen}
              aria-controls="coverage-map-list"
              onClick={() => setListOpen((v) => !v)}
            >
              {listOpen
                ? isSpanish
                  ? "Ver menos"
                  : "See fewer"
                : isSpanish
                  ? "Ver todas las ciudades"
                  : "See all cities"}
            </button>
            {listOpen ? (
              <ul id="coverage-map-list" className="coverage-map-list" aria-label={isSpanish ? "Las 32 ciudades que atendemos" : "All 32 cities we serve"}>
                {MAP_CITIES.map((city) => (
                  <li key={city.slug}>
                    <Link href={cityHref(city.slug, locale)} className="coverage-map-chip">
                      {city.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        ) : null}
        <p className="coverage-map-count">
          {isSpanish
            ? "32 ciudades en Miami-Dade y Broward"
            : "32 cities across Miami-Dade & Broward"}
        </p>
      </div>
    </section>
  );
}
