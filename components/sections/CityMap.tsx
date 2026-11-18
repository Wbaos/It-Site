"use client";

// Interactive service-area map (Leaflet + OpenStreetMap, no API key).
// Loaded with ssr: false from CoverageMap, so Leaflet never runs on the
// server. 32 city pins with lightweight grid clustering (no extra
// dependency): nearby cities group into numbered gold bubbles that split
// open when tapped/zoomed. County filter buttons, a city search, and a
// popup card per city linking to that city's page in the current locale.
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MAP_CITIES, type MapCity } from "@/lib/cityCoordinates";
import { cityHref } from "@/lib/cityTwins";

type CountyFilter = "all" | "Broward" | "Miami-Dade";

// Pixels between pins before they merge into one cluster bubble.
const CLUSTER_CELL_PX = 64;

export default function CityMap({ locale = "en" }: { locale?: "en" | "es" }) {
  const isSpanish = locale === "es";
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const filterRef = useRef<CountyFilter>("all");
  const [filter, setFilter] = useState<CountyFilter>("all");
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const popupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const t = {
    searchPlaceholder: isSpanish ? "Busca tu ciudad…" : "Search your city…",
    all: isSpanish ? "Todas" : "All cities",
    noResults: isSpanish
      ? "Ninguna ciudad coincide con esa búsqueda."
      : "No city matches that search.",
    viewPage: isSpanish ? "Ver la página" : "View city page",
    mapLabel: isSpanish
      ? "Mapa de las ciudades atendidas en Miami-Dade y Broward"
      : "Map of the cities served in Miami-Dade and Broward",
  };

  const visibleCities = (f: CountyFilter): MapCity[] =>
    f === "all"
      ? MAP_CITIES
      : MAP_CITIES.filter((c) => c.county === f || c.county === "both");

  const openCityPopup = (city: MapCity) => {
    const map = mapRef.current;
    if (!map) return;
    L.popup({ className: "city-map-popup", closeButton: true, maxWidth: 240 })
      .setLatLng([city.lat, city.lng])
      .setContent(
        `<strong class="city-map-popup-name">${city.name}</strong>` +
          `<a class="city-map-popup-link" href="${cityHref(city.slug, locale)}">${t.viewPage} →</a>`
      )
      .openOn(map);
  };

  const flyToCity = (city: MapCity) => {
    const map = mapRef.current;
    if (!map) return;
    setSearch("");
    setSearchOpen(false);
    map.flyTo([city.lat, city.lng], 13, { duration: 0.8 });
    if (popupTimer.current) clearTimeout(popupTimer.current);
    popupTimer.current = setTimeout(() => openCityPopup(city), 850);
  };

  // (Re)draw pins + cluster bubbles for the current filter and zoom.
  const renderMarkers = () => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    const cities = visibleCities(filterRef.current);
    // Group by 64px grid cell at the current zoom.
    const cells = new Map<string, MapCity[]>();
    cities.forEach((city) => {
      const p = map.latLngToContainerPoint([city.lat, city.lng]);
      const key = `${Math.floor(p.x / CLUSTER_CELL_PX)}:${Math.floor(p.y / CLUSTER_CELL_PX)}`;
      const group = cells.get(key) ?? [];
      group.push(city);
      cells.set(key, group);
    });
    cells.forEach((group) => {
      if (group.length === 1) {
        const city = group[0]!;
        const marker = L.marker([city.lat, city.lng], {
          icon: L.divIcon({
            className: "city-map-div-icon",
            html: `<span class="city-map-pin" aria-hidden="true"></span>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          }),
          title: city.name,
          keyboard: true,
        });
        marker.on("click", () => openCityPopup(city));
        layer.addLayer(marker);
        return;
      }
      const lat = group.reduce((s, c) => s + c.lat, 0) / group.length;
      const lng = group.reduce((s, c) => s + c.lng, 0) / group.length;
      const marker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: "city-map-div-icon",
          html: `<span class="city-map-cluster" aria-hidden="true">${group.length}</span>`,
          iconSize: [38, 38],
          iconAnchor: [19, 19],
        }),
        title: isSpanish
          ? `${group.length} ciudades — toca para ampliar`
          : `${group.length} cities — tap to zoom in`,
        keyboard: true,
      });
      marker.on("click", () => {
        const map = mapRef.current;
        if (!map) return;
        map.flyTo([lat, lng], Math.min(map.getZoom() + 2, 15), { duration: 0.6 });
      });
      layer.addLayer(marker);
    });
  };

  useEffect(() => {
    if (!mapEl.current || mapRef.current) return;
    const map = L.map(mapEl.current, {
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true,
    });
    mapRef.current = map;
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    const bounds = L.latLngBounds(MAP_CITIES.map((c) => [c.lat, c.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [28, 28] });
    renderMarkers();
    map.on("moveend zoomend", renderMarkers);
    // The map mounts inside a Reveal wrapper; invalidate once layout settles.
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    return () => {
      clearTimeout(t1);
      if (popupTimer.current) clearTimeout(popupTimer.current);
      map.off("moveend zoomend", renderMarkers);
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilter = (f: CountyFilter) => {
    filterRef.current = f;
    setFilter(f);
    const map = mapRef.current;
    if (!map) return;
    const cities = visibleCities(f);
    const bounds = L.latLngBounds(cities.map((c) => [c.lat, c.lng] as [number, number]));
    map.flyToBounds(bounds, { padding: [28, 28], duration: 0.6 });
    renderMarkers();
  };

  const query = search.trim().toLowerCase();
  const matches = query
    ? MAP_CITIES.filter((c) => c.name.toLowerCase().includes(query))
        .sort((a, b) => {
          const aExact = a.name.toLowerCase() === query ? 0 : 1;
          const bExact = b.name.toLowerCase() === query ? 0 : 1;
          return aExact - bExact;
        })
        .slice(0, 6)
    : [];

  return (
    <div className="city-map-wrap">
      <div className="city-map-controls">
        <div className="city-map-search">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && matches.length > 0) flyToCity(matches[0]!);
            }}
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
            className="city-map-search-input"
          />
          {searchOpen && query && (
            <ul className="city-map-search-results" role="listbox">
              {matches.length === 0 ? (
                <li className="city-map-search-empty">{t.noResults}</li>
              ) : (
                matches.map((city) => (
                  <li key={city.slug}>
                    <button
                      type="button"
                      className="city-map-search-result"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        flyToCity(city);
                      }}
                    >
                      {city.name}
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
        <div className="city-map-filters" role="group" aria-label={t.all}>
          {(
            [
              ["all", t.all],
              ["Miami-Dade", "Miami-Dade"],
              ["Broward", "Broward"],
            ] as [CountyFilter, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className="city-map-filter"
              aria-pressed={filter === value}
              onClick={() => applyFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div ref={mapEl} className="city-map" role="application" aria-label={t.mapLabel} />
    </div>
  );
}
