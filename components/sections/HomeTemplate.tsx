import { getHomeSections, type HomeLocale } from "@/lib/pageSections";

// Single home template for both languages: the same sections, in the same
// order, with the same components and icons. Only the text changes, via
// `locale`. app/page.tsx renders this with locale="en" and app/es/page.tsx
// renders this same component with locale="es".
export default async function HomeTemplate({ locale = "en" }: { locale?: HomeLocale }) {
  const sections = await getHomeSections(locale);
  return (
    <main>
      {sections.map(({ key, Component, props }) => (
        <Component key={key} {...(props ?? {})} />
      ))}
    </main>
  );
}
