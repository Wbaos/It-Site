import Link from "next/link";
import { cityHref } from "@/lib/cityTwins";
import type { HomePage } from "@/lib/sanityHome";

function pick(en: string | undefined, es: string | undefined, isSpanish: boolean): string {
  if (isSpanish && es) return es;
  return en ?? "";
}

// Single template: the copy comes from the Sanity homePage document when
// present, with the current copy as fallback. Paragraph 4 was nested inside
// paragraph 3 in the old code; browsers already split nested <p> elements
// into siblings, so rendering them as separate paragraphs reproduces the
// visible output exactly.
export default function SEOIntro({ locale = "en", doc }: { locale?: "en" | "es"; doc?: HomePage | null }) {
  const isSpanish = locale === "es";
  const title = pick(doc?.seoIntroTitle, doc?.seoIntroTitleEs, isSpanish) ||
    (isSpanish
      ? "Servicios de Reparación de Sprinklers e Irrigación en Miami y Broward"
      : "Sprinkler Repair & Irrigation Services in Miami & Broward");
  const p1Before = pick(doc?.seoIntroP1Before, doc?.seoIntroP1BeforeEs, isSpanish) ||
    (isSpanish
      ? "CallTechCare es un equipo local de servicio enfocado en la "
      : "CallTechCare is a local service team focused on ");
  const p1LinkText = pick(doc?.seoIntroP1LinkText, doc?.seoIntroP1LinkTextEs, isSpanish) ||
    (isSpanish ? "reparación de sprinklers en Miami" : "Sprinkler Repair Miami");
  const p1After = pick(doc?.seoIntroP1After, doc?.seoIntroP1AfterEs, isSpanish) ||
    (isSpanish
      ? " y la solución de problemas de irrigación en Miami-Dade y Broward. Ayudamos con fugas, cabezales rotos, mala cobertura, problemas de temporizador o controlador y mantenimiento del sistema, con comunicación clara y servicio confiable a domicilio."
      : " and irrigation troubleshooting across Miami-Dade and Broward. We help with leaks, broken sprinkler heads, poor coverage, timer/controller issues, and system tune-ups—with clear communication and reliable on-site service.");
  const p2 = pick(doc?.seoIntroP2, doc?.seoIntroP2Es, isSpanish) ||
    (isSpanish
      ? "Después de la reparación de sprinklers y el servicio de irrigación, también ofrecemos instalación de cámaras de seguridad para casas y pequeños negocios."
      : "After sprinkler repair and irrigation service, we also provide security camera installation for homes and small businesses.");
  const p3 = pick(doc?.seoIntroP3, doc?.seoIntroP3Es, isSpanish) ||
    (isSpanish
      ? "Con disponibilidad el mismo día en muchas áreas de Miami y Broward, CallTechCare hace que agendar sea simple y sin estrés. Llama ahora para reparación de sprinklers o envíanos un mensaje rápido: confirmamos los detalles y reservamos la próxima visita disponible."
      : "With same-day availability in many Miami and Broward areas, CallTechCare makes scheduling simple and stress-free. Call now for sprinkler repair or send us a quick message—we’ll confirm details and book the next available visit.");
  const p4 = pick(doc?.seoIntroP4, doc?.seoIntroP4Es, isSpanish) ||
    (isSpanish
      ? "Todos los trabajos tienen 1 año de garantía cuando CallTechCare hace el trabajo y provee los materiales. Y si tienes una emergencia de sprinklers, como una fuga grande o una zona que no apaga, te atendemos el mismo día dentro del horario de servicio (lunes a sábado de 8am a 7pm, domingo de 9am a 6pm)."
      : "Every job carries a 1-year warranty when CallTechCare performs the work and provides the materials. And if you have a sprinkler emergency, like a major leak or a zone that won’t turn off, we’ll prioritize same-day service during business hours (Monday–Saturday 8am–7pm, Sunday 9am–6pm).");
  const linkHref = isSpanish ? cityHref("miami", "es") : "/sprinkler-repair-miami";
  return (
    <section className="seo-intro-section">
      <div className="seo-intro">
        <h2 className="seo-intro-title">{title}</h2>
        <p>
          {p1Before}
          <Link href={linkHref}>{p1LinkText}</Link>
          {p1After}
        </p>
        <p>{p2}</p>
        <p>{p3}</p>
        <p>{p4}</p>
      </div>
    </section>
  );
}
