// Spanish twin paths for service detail pages, keyed by English slug.
// Used by the language switcher map, the services menus (desktop submenu
// and mobile panels) and the service template, so Spanish navigation lands
// on the Spanish twin whenever one exists. English slugs keep their
// /services/<slug> URL when no twin exists.
export const SERVICE_ES_PATHS: Record<string, string> = {
  "sprinkler-repair-and-installation":
    "/es/reparacion-e-instalacion-de-sprinklers",
  "sprinkler-leak-repair": "/es/reparacion-de-fugas-de-sprinklers",
  "sprinkler-valve-repair": "/es/reparacion-de-valvulas-de-sprinklers",
  "sprinkler-pump-replacement": "/es/reemplazo-de-bombas-de-sprinklers",
  "sprinkler-timer-installation":
    "/es/instalacion-de-temporizadores-de-sprinklers",
  "wifi-sprinkler-controller-upgrade":
    "/es/actualizacion-a-controlador-wifi-de-sprinklers",
  "rain-sensor-installation": "/es/instalacion-de-sensores-de-lluvia",
  "new-irrigation-installation": "/es/instalacion-nueva-de-irrigacion",
  "wireless-camera-installation": "/es/instalacion-de-camaras-inalambricas",
  "sprinkler-maintenance-plan": "/es/plan-de-mantenimiento-de-sprinklers",
  "emergency-sprinkler-repair": "/es/reparacion-de-emergencia-de-sprinklers",
  "commercial-irrigation-hoa-services": "/es/riego-comercial-y-para-hoa",
  "new-irrigation-well-installation":
    "/es/instalacion-de-pozos-nuevos-de-irrigacion",
  "home-security": "/es/seguridad-del-hogar",
};

export function serviceHref(slug: string, locale: "en" | "es"): string {
  // Removed 2026-11-10: the "landscaping" category page no longer exists
  // (its content was sprinkler repair), so any link to it lands on the
  // main sprinkler service page instead, in the current locale.
  if (slug === "landscaping")
    return locale === "es"
      ? "/es/reparacion-e-instalacion-de-sprinklers"
      : "/services/sprinkler-repair-and-installation";
  if (locale === "es") return SERVICE_ES_PATHS[slug] ?? `/services/${slug}`;
  return `/services/${slug}`;
}
