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
  "landscaping": "/es/reparacion-de-sprinklers-e-irrigacion",
  "home-security": "/es/seguridad-del-hogar",
};

export function serviceHref(slug: string, locale: "en" | "es"): string {
  if (locale === "es") return SERVICE_ES_PATHS[slug] ?? `/services/${slug}`;
  return `/services/${slug}`;
}
