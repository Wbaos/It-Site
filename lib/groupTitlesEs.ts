// Spanish titles for the two service groups in the services dropdown.
// Group titles live in Sanity (serviceGroup docs) with no Spanish field;
// these two labels are UI chrome, translated here like the rest of the
// Navbar strings. Service titles themselves come from titleEs in Sanity.
export const GROUP_TITLE_ES: Record<string, string> = {
  "security-camera": "Cámaras de Seguridad",
  "irrigation-and-sprinkler-services": "Servicios de Irrigación y Sprinklers",
};

export function groupTitleEs(slug: string | undefined, fallback: string) {
  return (slug && GROUP_TITLE_ES[slug]) || fallback;
}
