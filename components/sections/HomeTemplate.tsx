import { getHomeSections, type HomeLocale } from "@/lib/pageSections";
import Reveal from "@/components/common/Reveal";
import {
  HOME_VIDEO_DURATION,
  HOME_VIDEO_POSTER_URL,
  HOME_VIDEO_UPLOAD_DATE,
  HOME_VIDEO_URL,
} from "@/lib/homeVideo";

// Single home template for both languages: the same sections, in the same
// order, with the same components and icons. Only the text changes, via
// `locale`. app/page.tsx renders this with locale="en" and app/es/page.tsx
// renders this same component with locale="es".
export default async function HomeTemplate({ locale = "en" }: { locale?: HomeLocale }) {
  const { sections, doc } = await getHomeSections(locale);
  const isSpanish = locale === "es";
  // VideoObject for the home video (there was no video schema before).
  // Name/description mirror the visible heading/subtitle, including the
  // Sanity values when set; the URLs come from lib/homeVideo so the
  // schema and the <video> element can never drift apart.
  const videoJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name:
      (isSpanish ? doc?.videoHeadingEs : doc?.videoHeading) ??
      (isSpanish ? "Mira tu sistema trabajando" : "See your system at work"),
    description:
      (isSpanish ? doc?.videoSubtitleEs : doc?.videoSubtitle) ??
      (isSpanish
        ? "Sistema de sprinklers optimizado para una cobertura completa y uniforme en Fort Lauderdale."
        : "Optimized sprinkler system for full, even coverage in Fort Lauderdale."),
    thumbnailUrl: HOME_VIDEO_POSTER_URL,
    contentUrl: HOME_VIDEO_URL,
    uploadDate: HOME_VIDEO_UPLOAD_DATE,
    duration: HOME_VIDEO_DURATION,
  };
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
      />
      {/* Every section except the hero reveals softly on scroll. The hero
          stays as-is: it is above the fold and must render immediately. */}
      {sections.map(({ key, Component, props }) =>
        key === "hero" ? (
          <Component key={key} {...(props ?? {})} />
        ) : (
          <Reveal key={key}>
            <Component {...(props ?? {})} />
          </Reveal>
        )
      )}
    </main>
  );
}
