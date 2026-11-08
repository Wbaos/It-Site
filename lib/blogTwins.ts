// Spanish twin paths for blog posts, keyed by English slug.
// Used by the language switcher map, the blog index, the post template
// and the sitemap, so Spanish navigation lands on the Spanish twin
// whenever one exists. English slugs keep their /blog/<slug> URL when
// no twin exists. Mirrors lib/serviceTwins.ts and lib/cityTwins.ts.
export const BLOG_ES_PATHS: Record<string, string> = {
  "wireless-camera-installation-secure-your-home-or-business":
    "/es/blog/instalacion-de-camaras-inalambricas-para-tu-hogar-o-negocio",
  "how-to-choose-and-install-the-right-video-doorbell-for-your-home-or-small-business":
    "/es/blog/como-elegir-e-instalar-el-videoportero-adecuado-para-tu-hogar-o-pequeno-negocio",
  "sprinkler-repair-and-installation-in-miami-2026-guide":
    "/es/blog/reparacion-e-instalacion-de-sprinklers-en-miami-guia-2026",
  "how-often-should-you-run-your-sprinkler-system-in-miami-watering-guide-2026":
    "/es/blog/cada-cuanto-hacer-funcionar-tus-sprinklers-en-miami-guia-de-riego-2026",
  "security-camera-installation-near-me-miami":
    "/es/blog/instalacion-de-camaras-de-seguridad-cerca-de-mi-en-miami",
  "sprinkler-repair-near-me-in-miami-fix-your-irrigation-system-fast":
    "/es/blog/reparacion-de-sprinklers-cerca-de-mi-en-miami-arregla-tu-riego-rapido",
  "sprinkler-system-not-working-miami":
    "/es/blog/sistema-de-sprinklers-no-funciona-en-miami",
  "why-upgrade-from-an-intermatic-timer-to-a-smart-irrigation-controller-miami-guide-2026":
    "/es/blog/por-que-cambiar-de-un-temporizador-intermatic-a-un-controlador-inteligente-guia-miami-2026",
  "prepare-sprinkler-system-dry-season-miami":
    "/es/blog/prepara-tu-sistema-de-sprinklers-para-la-temporada-seca-en-miami",
  "smart-sprinkler-controllers-miami-wifi-timers":
    "/es/blog/controladores-inteligentes-de-sprinklers-en-miami-timers-wifi",
};

export function blogHref(slug: string, locale: "en" | "es"): string {
  if (locale === "es") return BLOG_ES_PATHS[slug] ?? `/blog/${slug}`;
  return `/blog/${slug}`;
}
