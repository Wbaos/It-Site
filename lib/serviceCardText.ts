// Short card text for service cards (services hub, home popular-services
// section and related-services cards). Most services use a short excerpt
// of their Sanity description; a service listed here overrides that
// excerpt with fixed text, because the excerpt of its description would
// mislead: the backflow description opens with the leak symptom and the
// excerpt cuts off before the scope ("we check the device, fix everything
// after it"), so the card used to read as if we fix the backflow device
// itself. Testing, installing or replacing a backflow preventer is a
// licensed plumber's job; we diagnose whether it is bad, repair everything
// after it, and explain what the device needs. Keep both languages in
// this one file so EN/ES can never drift apart.
export const SERVICE_CARD_TEXT: Record<string, { en: string; es: string }> = {
  "backflow-testing": {
    en: "We check whether your backflow is bad, repair everything after it, and explain what the device needs. The device itself is a licensed plumber's job.",
    es: "Revisamos si tu backflow está malo, reparamos todo después de él y te explicamos qué necesita. El dispositivo mismo es trabajo de un plomero licenciado.",
  },
};

// Card text for a service slug in a locale: the override above when one
// exists, otherwise undefined (the caller falls back to the short excerpt
// of the Sanity description).
export function serviceCardText(
  slug: string | undefined,
  locale: "en" | "es"
): string | undefined {
  if (!slug) return undefined;
  return SERVICE_CARD_TEXT[slug]?.[locale];
}
