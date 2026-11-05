import Link from "next/link";
import { getAboutPage, type AboutPage } from "@/lib/sanityAbout";

// Single about template for both languages: the same sections, in the
// same order, with the same classes. Copy comes from the Sanity
// `aboutPage` document; the fallbacks below are the exact pre-migration
// texts, used only if the document is missing a field.

type Locale = "en" | "es";

type AboutCopy = {
  title: string;
  heroSubtitle: string;
  missionHeading: string;
  missionBefore: string;
  missionLinkText: string;
  missionAfter: string;
  storyHeading: string;
  storyParagraphs: string[];
  valuesHeading: string;
  values: { title: string; text: string }[];
  ctaHeading: string;
  ctaBefore: string;
  ctaLinkText: string;
  ctaAfter: string;
  ctaButtonText: string;
};

const FALLBACK_EN: AboutCopy = {
  title: "About CallTechCare",
  heroSubtitle: "Sprinkler Repair & Irrigation Services in Miami & Broward",
  missionHeading: "Our Mission",
  missionBefore:
    "At CallTechCare, our mission is to make service simple, safe, and accessible for homeowners and small businesses. Our primary focus is ",
  missionLinkText: "sprinkler repair and irrigation troubleshooting in Miami and Broward",
  missionAfter: ". We also provide security camera installation when you need help beyond irrigation.",
  storyHeading: "Our Story",
  storyParagraphs: [
    "We started CallTechCare after seeing how many homeowners struggled to find reliable help for their sprinkler systems and cameras. Whether it’s a sprinkler system that won’t run, a leak in the yard, or cameras that need placing, we’re here to help with honesty and patience.",
    "As our clients continued to trust us, we focused on what we do best: sprinkler repair and irrigation, plus security camera installation. Based in Miami, we proudly serve homeowners across Miami-Dade and Broward, including Miami, Miramar, Pembroke Pines, Hollywood, and Fort Lauderdale.",
  ],
  valuesHeading: "Our Values",
  values: [
    {
      title: "🧑‍🤝‍🧑 Compassion",
      text: "We treat every client like family — with patience, respect, and empathy.",
    },
    {
      title: "⚙️ Reliability",
      text: "We show up on time, solve problems efficiently, and stand behind our work.",
    },
    {
      title: "🔒 Trust",
      text: "Your privacy and security matter. We handle every device with care and discretion.",
    },
  ],
  ctaHeading: "Need Help Today?",
  ctaBefore:
    "Book a trusted service visit for sprinkler repair and irrigation troubleshooting in Miami and Broward. We also provide security camera installation. If you're looking for ",
  ctaLinkText: "Sprinkler Repair Miami",
  ctaAfter: ", start here.",
  ctaButtonText: "Book a Service",
};

const FALLBACK_ES: AboutCopy = {
  title: "Sobre CallTechCare",
  heroSubtitle: "Servicios de Reparación de Sprinklers e Irrigación en Miami y Broward",
  missionHeading: "Nuestra Misión",
  missionBefore:
    "En CallTechCare, nuestra misión es hacer que el servicio sea simple, seguro y accesible para propietarios de viviendas y pequeños negocios. Nuestro enfoque principal es ",
  missionLinkText: "la reparación de sprinklers y la solución de problemas de irrigación en Miami y Broward",
  missionAfter: ". También prestamos instalación de cámaras de seguridad cuando necesitas ayuda más allá de la irrigación.",
  storyHeading: "Nuestra Historia",
  storyParagraphs: [
    "Comenzamos CallTechCare después de ver cuántos propietarios tenían dificultad para encontrar ayuda confiable para sus sistemas de sprinklers y cámaras. Ya sea un sistema de sprinklers que no funciona, una fuga en el jardín o cámaras que necesitan colocación, estamos aquí para ayudar con honestidad y paciencia.",
    "A medida que nuestros clientes siguieron confiando en nosotros, nos enfocamos en lo que mejor hacemos: reparación de sprinklers e irrigación, además de instalación de cámaras de seguridad. Con sede en Miami, servimos con orgullo a propietarios en Miami-Dade y Broward, incluyendo Miami, Miramar, Pembroke Pines, Hollywood y Fort Lauderdale.",
  ],
  valuesHeading: "Nuestros Valores",
  values: [
    {
      title: "🧑‍🤝‍🧑 Compasión",
      text: "Tratamos a cada cliente como familia, con paciencia, respeto y empatía.",
    },
    {
      title: "⚙️ Confiabilidad",
      text: "Llegamos a tiempo, resolvemos problemas de forma eficiente y respaldamos nuestro trabajo.",
    },
    {
      title: "🔒 Confianza",
      text: "Tu privacidad y seguridad importan. Manejamos cada dispositivo con cuidado y discreción.",
    },
  ],
  ctaHeading: "¿Necesitas ayuda hoy?",
  ctaBefore:
    "Reserva una visita de servicio de confianza para reparación de sprinklers y solución de problemas de irrigación en Miami y Broward. También prestamos instalación de cámaras de seguridad. Si buscas ",
  ctaLinkText: "Reparación de Sprinklers en Miami",
  ctaAfter: ", comienza aquí.",
  ctaButtonText: "Reserva un servicio",
};

export default async function AboutTemplate({ locale = "en" }: { locale?: Locale }) {
  let doc: AboutPage | null = null;
  try {
    doc = await getAboutPage();
  } catch {
    doc = null;
  }
  const isEs = locale === "es";
  const fb = isEs ? FALLBACK_ES : FALLBACK_EN;

  const title = (isEs ? doc?.titleEs : doc?.title) ?? fb.title;
  const heroSubtitle = (isEs ? doc?.heroSubtitleEs : doc?.heroSubtitle) ?? fb.heroSubtitle;
  const missionHeading = (isEs ? doc?.missionHeadingEs : doc?.missionHeading) ?? fb.missionHeading;
  const missionBefore = (isEs ? doc?.missionBeforeEs : doc?.missionBefore) ?? fb.missionBefore;
  const missionLinkText = (isEs ? doc?.missionLinkTextEs : doc?.missionLinkText) ?? fb.missionLinkText;
  const missionAfter = (isEs ? doc?.missionAfterEs : doc?.missionAfter) ?? fb.missionAfter;
  const storyHeading = (isEs ? doc?.storyHeadingEs : doc?.storyHeading) ?? fb.storyHeading;
  const storyParagraphs =
    (isEs ? doc?.storyParagraphsEs : doc?.storyParagraphs) ?? fb.storyParagraphs;
  const valuesHeading = (isEs ? doc?.valuesHeadingEs : doc?.valuesHeading) ?? fb.valuesHeading;
  const values =
    doc?.values && doc.values.length > 0
      ? doc.values.map((v, i) => ({
          title: (isEs ? v.titleEs : v.title) ?? fb.values[i]?.title ?? "",
          text: (isEs ? v.textEs : v.text) ?? fb.values[i]?.text ?? "",
        }))
      : fb.values;
  const ctaHeading = (isEs ? doc?.ctaHeadingEs : doc?.ctaHeading) ?? fb.ctaHeading;
  const ctaBefore = (isEs ? doc?.ctaBeforeEs : doc?.ctaBefore) ?? fb.ctaBefore;
  const ctaLinkText = (isEs ? doc?.ctaLinkTextEs : doc?.ctaLinkText) ?? fb.ctaLinkText;
  const ctaAfter = (isEs ? doc?.ctaAfterEs : doc?.ctaAfter) ?? fb.ctaAfter;
  const ctaButtonText = (isEs ? doc?.ctaButtonTextEs : doc?.ctaButtonText) ?? fb.ctaButtonText;

  const cityHref = isEs ? "/es/reparacion-de-sprinklers-miami" : "/sprinkler-repair-miami";
  const quoteHref = isEs ? "/es/solicita-una-cotizacion" : "/request-quote";

  return (
    <main className="about-page-container">
      <div className="about-page">
        <section className="about-hero">
          <h1 className="about-title">{title}</h1>
          <p className="about-subtitle">{heroSubtitle}</p>
        </section>

        <section className="about-section">
          <h2 className="about-heading">{missionHeading}</h2>
          <p className="about-text">
            {missionBefore}
            <Link href={cityHref}>{missionLinkText}</Link>
            {missionAfter}
          </p>
        </section>

        <section className="about-section">
          <h2 className="about-heading">{storyHeading}</h2>
          {storyParagraphs.map((p, i) => (
            <p className="about-text" key={i}>
              {p}
            </p>
          ))}
        </section>

        <section className="about-values">
          <h2 className="about-heading">{valuesHeading}</h2>
          <div className="values-grid">
            {values.map((v, i) => (
              <div className="value-card" key={i}>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="about-cta">
          <h2>{ctaHeading}</h2>
          <p>
            {ctaBefore}
            <Link href={cityHref}>{ctaLinkText}</Link>
            {ctaAfter}
          </p>
          <Link href={quoteHref} className="about-button">
            {ctaButtonText}
          </Link>
        </section>
      </div>
    </main>
  );
}
