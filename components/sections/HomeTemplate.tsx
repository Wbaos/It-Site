import { getHomeSections, type HomeLocale } from "@/lib/pageSections";
import {
  HOME_VIDEO_URL,
  HOME_VIDEO_POSTER_URL,
  HOME_VIDEO_UPLOAD_DATE,
} from "@/components/sections/HomeVideo";

// Single home template for both languages: the same sections, in the same
// order, with the same components and icons. Only the text changes, via
// `locale`. app/page.tsx renders this with locale="en" and app/es/page.tsx
// renders this same component with locale="es".
export default async function HomeTemplate({ locale = "en" }: { locale?: HomeLocale }) {
  const { sections, doc } = await getHomeSections(locale);
  const isSpanish = locale === "es";
  // VideoObject for the home video (there was no video schema before).
  // Name/description mirror the visible heading/subtitle, including the
  // Sanity values when set; the URLs come from HomeVideo's constants so
  // the schema and the <video> element can never drift apart.
  const videoJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name:
      (isSpanish ? doc?.videoHeadingEs : doc?.videoHeading) ??
      (isSpanish ? "Mira tu sistema trabajando" : "See your system at work"),
    description:
      (isSpanish ? doc?.videoSubtitleEs : doc?.videoSubtitle) ??
      (isSpanish
        ? "Sistema de sprinklers optimizado para una cobertura del 100% en Fort Lauderdale."
        : "Optimized sprinkler system for 100% coverage in Fort Lauderdale."),
    thumbnailUrl: HOME_VIDEO_POSTER_URL,
    contentUrl: HOME_VIDEO_URL,
    uploadDate: HOME_VIDEO_UPLOAD_DATE,
  };
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
      />
      {sections.map(({ key, Component, props }) => (
        <Component key={key} {...(props ?? {})} />
      ))}
    </main>
  );
}
