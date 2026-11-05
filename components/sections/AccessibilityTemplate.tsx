import Link from "next/link";
import SvgIcon from "@/components/common/SvgIcons";
import type { SvgIconName } from "@/components/common/SvgIcons";
import {
  getAccessibilityPage,
  type AccessibilityPage,
  type AccessibilitySection,
} from "@/lib/sanityAccessibility";
import { resolveSiteSettings } from "@/lib/sanitySettings";

// Single accessibility template for both languages: the same sections,
// in the same order, with the same classes. Copy comes from the Sanity
// `accessibilityPage` document; the fallbacks below are the exact
// pre-migration texts, used only if the document is missing a field.
// The feedback card's contact line (email + phone) comes from the
// siteSettings document, exactly as the current page shows it.

type Locale = "en" | "es";

type SectionCopy = {
  icon: SvgIconName;
  heading: string;
  paragraphs: string[];
  highlight?: string;
  list?: string[];
  isContactCard?: boolean;
};

type AccessibilityCopy = {
  title: string;
  updated: string;
  backText: string;
  intro: string;
  sections: SectionCopy[];
};

const FALLBACK_EN: AccessibilityCopy = {
  title: "Accessibility Statement",
  updated: "Last Updated: February 2, 2026",
  backText: "Back to Home",
  intro:
    "At CallTechCare, we are committed to making our website and digital services accessible to as many people as possible, including users with disabilities.",
  sections: [
    {
      icon: "checkmark-circle",
      heading: "Our Commitment",
      paragraphs: [
        "We aim to meet or exceed the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA and to continuously improve usability for all visitors.",
        "Accessibility is an ongoing effort. We periodically review our site and update content and functionality to reduce barriers.",
      ],
    },
    {
      icon: "laptop",
      heading: "Accessibility Features & Best Practices",
      paragraphs: [],
      highlight: "We work to support:",
      list: [
        "Keyboard navigation for key site interactions",
        "Clear headings and readable content structure",
        "High-contrast styling and legible typography",
        "Meaningful link text and labels",
        "Responsive layouts for mobile and tablet devices",
      ],
    },
    {
      icon: "shield",
      heading: "Compatibility",
      paragraphs: [
        "We strive to ensure compatibility with modern browsers and assistive technologies, including screen readers and screen magnifiers.",
      ],
      highlight: "Recommended setup:",
      list: [
        "Latest version of Chrome, Edge, Firefox, or Safari",
        "Built-in OS accessibility features (Zoom, VoiceOver, Narrator)",
        "Updated assistive technology software when available",
      ],
    },
    {
      icon: "clipboard",
      heading: "Known Limitations",
      paragraphs: [
        "While we work hard to maintain an accessible experience, some content may not yet fully conform to WCAG 2.1 AA, especially on newly released features or third‑party embedded components.",
        "If you encounter any accessibility barriers, please let us know and we will prioritize a fix.",
      ],
    },
    {
      icon: "paper-plane",
      heading: "Feedback & Assistance",
      paragraphs: [
        "If you experience difficulty accessing any part of our website, we can help. Please reach out and include:",
      ],
      list: [
        "The page URL where you experienced the issue",
        "What you were trying to do",
        "Your browser/device and any assistive technology you use",
      ],
    },
    {
      icon: "alert-circle",
      heading: "Formal Concerns",
      paragraphs: [
        "If you believe we are not meeting accessibility requirements, please contact us directly so we can address your concern promptly.",
      ],
      isContactCard: true,
    },
  ],
};

const FALLBACK_ES: AccessibilityCopy = {
  title: "Declaración de Accesibilidad",
  updated: "Última actualización: 2 de febrero de 2026",
  backText: "Volver a la página principal",
  intro:
    "En CallTechCare, estamos comprometidos con hacer que nuestro sitio web y servicios digitales sean accesibles para la mayor cantidad de personas posible, incluyendo usuarios con discapacidades.",
  sections: [
    {
      icon: "checkmark-circle",
      heading: "Nuestro Compromiso",
      paragraphs: [
        "Nuestro objetivo es cumplir o superar las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.1 Nivel AA y mejorar continuamente la usabilidad para todos los visitantes.",
        "La accesibilidad es un esfuerzo continuo. Revisamos periódicamente nuestro sitio y actualizamos el contenido y la funcionalidad para reducir barreras.",
      ],
    },
    {
      icon: "laptop",
      heading: "Funciones de Accesibilidad y Mejores Prácticas",
      paragraphs: [],
      highlight: "Trabajamos para apoyar:",
      list: [
        "Navegación por teclado para las interacciones clave del sitio",
        "Encabezados claros y estructura de contenido legible",
        "Estilo de alto contraste y tipografía legible",
        "Texto de enlace y etiquetas con significado",
        "Diseños responsivos para dispositivos móviles y tabletas",
      ],
    },
    {
      icon: "shield",
      heading: "Compatibilidad",
      paragraphs: [
        "Nos esforzamos por garantizar la compatibilidad con navegadores modernos y tecnologías de asistencia, incluyendo lectores de pantalla y ampliadores de pantalla.",
      ],
      highlight: "Configuración recomendada:",
      list: [
        "La versión más reciente de Chrome, Edge, Firefox o Safari",
        "Funciones de accesibilidad integradas del sistema operativo (Zoom, VoiceOver, Narrator)",
        "Software de tecnología de asistencia actualizado, cuando esté disponible",
      ],
    },
    {
      icon: "clipboard",
      heading: "Limitaciones Conocidas",
      paragraphs: [
        "Aunque trabajamos arduamente para mantener una experiencia accesible, es posible que algunos contenidos aún no cumplan totalmente con WCAG 2.1 AA, especialmente en funciones recién lanzadas o componentes integrados de terceros.",
        "Si encuentras alguna barrera de accesibilidad, por favor avísanos y priorizaremos una corrección.",
      ],
    },
    {
      icon: "paper-plane",
      heading: "Comentarios y Asistencia",
      paragraphs: [
        "Si tienes dificultad para acceder a cualquier parte de nuestro sitio web, podemos ayudarte. Por favor, comunícate con nosotros e incluye:",
      ],
      list: [
        "La URL de la página donde experimentaste el problema",
        "Lo que estabas intentando hacer",
        "Tu navegador/dispositivo y cualquier tecnología de asistencia que uses",
      ],
    },
    {
      icon: "alert-circle",
      heading: "Inquietudes Formales",
      paragraphs: [
        "Si crees que no estamos cumpliendo con los requisitos de accesibilidad, por favor contáctanos directamente para que podamos atender tu inquietud con prontitud.",
      ],
      isContactCard: true,
    },
  ],
};

// The intro bolds the brand name, as the original page did.
function IntroText({ text }: { text: string }) {
  const parts = text.split("CallTechCare");
  if (parts.length < 2) return <>{text}</>;
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {i > 0 && <strong>CallTechCare</strong>}
          {part}
        </span>
      ))}
    </>
  );
}

export default async function AccessibilityTemplate({
  locale = "en",
}: {
  locale?: Locale;
}) {
  let doc: AccessibilityPage | null = null;
  try {
    doc = await getAccessibilityPage();
  } catch {
    doc = null;
  }
  const settings = await resolveSiteSettings();
  const isEs = locale === "es";
  const fb = isEs ? FALLBACK_ES : FALLBACK_EN;

  const title = (isEs ? doc?.titleEs : doc?.title) ?? fb.title;
  const updated = (isEs ? doc?.updatedEs : doc?.updated) ?? fb.updated;
  const backText = (isEs ? doc?.backTextEs : doc?.backText) ?? fb.backText;
  const intro = (isEs ? doc?.introEs : doc?.intro) ?? fb.intro;
  const rawSections: AccessibilitySection[] | undefined = doc?.sections;
  const sections: SectionCopy[] =
    rawSections && rawSections.length > 0
      ? rawSections.map((s, i) => ({
          icon: (s.icon ?? fb.sections[i]?.icon ?? "document") as SvgIconName,
          heading: (isEs ? s.headingEs : s.heading) ?? fb.sections[i]?.heading ?? "",
          paragraphs:
            (isEs ? s.paragraphsEs : s.paragraphs) ?? fb.sections[i]?.paragraphs ?? [],
          highlight: (isEs ? s.highlightEs : s.highlight) ?? fb.sections[i]?.highlight,
          list: (isEs ? s.listEs : s.list) ?? fb.sections[i]?.list,
          isContactCard: s.isContactCard ?? fb.sections[i]?.isContactCard,
        }))
      : fb.sections;

  const homeHref = isEs ? "/es/" : "/";

  return (
    <section className="legal-wrapper">
      <div className="legal-container">
        <Link href={homeHref} className="legal-back">
          <SvgIcon name="chevron-left" size={18} color="var(--brand-teal)" />
          {backText}
        </Link>

        <div className="legal-header">
          <SvgIcon
            name="document"
            size={76}
            color="var(--brand-teal)"
            className="legal-header-icon"
          />
          <h1>{title}</h1>
          <p className="legal-updated">{updated}</p>
          <p className="legal-intro">
            <IntroText text={intro} />
          </p>
        </div>

        {sections.map((section, i) => (
          <div
            className={`legal-card${section.isContactCard ? " legal-contact-card" : ""}`}
            key={i}
          >
            <div className="legal-card-header">
              <SvgIcon
                name={section.icon}
                size={section.isContactCard ? 22 : 38}
                className="legal-card-icon"
              />
              <h2>{section.heading}</h2>
            </div>
            {section.paragraphs.map((p, j) => (
              <p key={j}>{p}</p>
            ))}
            {section.highlight ? <p className="legal-highlight">{section.highlight}</p> : null}
            {section.list && section.list.length > 0 ? (
              <ul>
                {section.list.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            ) : null}
            {section.icon === "paper-plane" ? (
              <p>
                {isEs ? "Envíanos un correo a " : "Email us at "}
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
                {isEs ? " o llama al " : " or call "}
                <a href={`tel:${settings.phoneTel}`}>{settings.phoneDisplay}</a>.
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
