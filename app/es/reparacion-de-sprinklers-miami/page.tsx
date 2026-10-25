import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/sections/Hero";

const SPRINKLER_SERVICE_DETAILS_HREF = "/services/sprinkler-repair-and-installation";

function SprinklerIllustration() {
  return (
    <svg
      viewBox="0 0 96 96"
      role="img"
      aria-label="Sprinkler head illustration"
      className="spr-illus"
      fill="none"
    >
      <path
        d="M18 66c10-8 50-8 60 0"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M26 62V40c0-8 7-14 22-14s22 6 22 14v22"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M34 66v8c0 4 3 8 14 8s14-4 14-8v-8"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M30 34l-8-6M40 30l-6-10M56 30l6-10M66 34l8-6"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M20 48c8 2 16 2 24 0M52 48c8 2 16 2 24 0"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

function ControllerIllustration() {
  return (
    <svg
      viewBox="0 0 96 96"
      role="img"
      aria-label="Irrigation controller illustration"
      className="spr-illus"
      fill="none"
    >
      <path
        d="M26 18h44a6 6 0 0 1 6 6v48a6 6 0 0 1-6 6H26a6 6 0 0 1-6-6V24a6 6 0 0 1 6-6Z"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M30 30h36"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M30 40h22"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M30 52h36"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M30 62h18"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M64 38a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        stroke="currentColor"
        strokeWidth="3"
      />
    </svg>
  );
}

function LeakIllustration() {
  return (
    <svg
      viewBox="0 0 96 96"
      role="img"
      aria-label="Sprinkler leak illustration"
      className="spr-illus"
      fill="none"
    >
      <path
        d="M18 56h44c10 0 16-6 16-16V28"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M34 56v10c0 8 6 14 14 14h10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M70 30c-3 5-6 8-10 12"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        d="M74 44c0 6-8 10-8 16 0 4 3 8 8 8s8-4 8-8c0-6-8-10-8-16Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const metadata: Metadata = {
  title: "Reparación de Sprinklers en Miami | CallTechCare",
  description:
    "Reparación rápida y confiable de sprinklers en Miami y Broward. CallTechCare también instala cámaras de seguridad y ofrece soporte técnico experto.",
  alternates: {
    canonical: "https://www.calltechcare.com/es/reparacion-de-sprinklers-miami",
    languages: {
      es: "https://www.calltechcare.com/es/reparacion-de-sprinklers-miami",
      en: "https://www.calltechcare.com/sprinkler-repair-miami",
    },
  },
  openGraph: {
    title: "Reparación de Sprinklers en Miami | CallTechCare",
    description:
      "Reparación rápida y confiable de sprinklers en Miami y Broward, además de instalación de cámaras de seguridad y soporte técnico experto.",
    url: "https://www.calltechcare.com/es/reparacion-de-sprinklers-miami",
    siteName: "CallTechCare",
    images: [
      {
        url: "https://www.calltechcare.com/logo-og.png",
        width: 1200,
        height: 630,
        alt: "CallTechCare - Reparación de Sprinklers en Miami",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reparación de Sprinklers en Miami | CallTechCare",
    description:
      "Reparación rápida y confiable de sprinklers en Miami y Broward, además de instalación de cámaras de seguridad y soporte técnico experto.",
    images: ["https://www.calltechcare.com/logo-og.png"],
  },
};

export default function ReparacionDeSprinklersMiamiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "¿Cuánto cuesta la reparación de sprinklers en Miami?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Depende del problema y del tamaño de tu sistema. Un cabezal roto cuesta menos que una reparación de válvula o de zona. CallTechCare te da un estimado claro y por adelantado antes de empezar cualquier trabajo, y el estimado es gratis.",
                },
              },
              {
                "@type": "Question",
                name: "¿Qué tan rápido pueden venir a reparar mis sprinklers?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "En la mayoría de las áreas de Miami-Dade y Broward, hay citas disponibles el mismo día. Llama al (786) 366-2729 y te confirmamos la próxima visita disponible.",
                },
              },
              {
                "@type": "Question",
                name: "¿Qué áreas atienden?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Atendemos 13 ciudades en Miami-Dade y Broward, desde Sunrise hasta Cutler Bay, incluyendo Sunrise, Fort Lauderdale, Weston, Davie, Hollywood, Pembroke Pines, Miramar, Aventura, Hialeah, Doral, Miami, Kendall y Cutler Bay.",
                },
              },
              {
                "@type": "Question",
                name: "¿Por qué una zona de sprinklers no funciona?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Las causas más comunes son una válvula defectuosa, un problema de cableado, un problema del temporizador o una fuga subterránea. Diagnosticamos la causa raíz antes de recomendar una reparación.",
                },
              },
              {
                "@type": "Question",
                name: "¿Instalan sistemas nuevos de sprinklers o solo los reparan?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Ambos. Instalamos zonas nuevas de irrigación, válvulas, líneas de sprinklers y controladores, y podemos actualizar sistemas viejos con controladores WiFi inteligentes.",
                },
              },
              {
                "@type": "Question",
                name: "¿Reparan fugas de sprinklers?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Sí. Reparamos fugas de sprinklers, incluyendo fugas en tuberías de PVC, válvulas con fuga y cabezales rotos, y probamos el sistema después de la reparación.",
                },
              },
            ],
          }),
        }}
      />

      <Hero
        titleLine1="Reparación de Sprinklers en Miami"
        titleLine2="Irrigación • Cámaras • Servicios Técnicos"
        subtitle="Servicios profesionales de reparación de sprinklers e irrigación en Miami y Broward. También instalamos cámaras de seguridad y ofrecemos soporte técnico experto."
        badgeText="Reparación de Sprinklers e Irrigación en Miami y Broward"
        primaryCtaText="Llama ahora"
        primaryCtaHref="tel:+17863662729"
        secondaryCtaText="Solicita una cotización"
        secondaryCtaHref="/request-quote"
        showCallButton={false}
      />

      <section className="seo-intro-section">
        <div className="seo-intro">
          <p style={{ paddingBottom: "1rem" }}>
            <Link href="/sprinkler-repair-miami">View this page in English →</Link>
          </p>

          <h2 className="seo-intro-title">Servicios de Reparación de Sprinklers e Irrigación en Miami y Broward</h2>

          <p>
            Si necesitas reparación de sprinklers en Miami, CallTechCare te ayuda rápido y sin complicaciones con fugas de sprinklers, cabezales rotos,
            mala cobertura, problemas del controlador y diagnóstico de irrigación en Miami-Dade y Broward.
          </p>

          <Link
            href={SPRINKLER_SERVICE_DETAILS_HREF}
            className="spr-detailsLink"
            aria-label="Ver detalles completos del servicio de reparación de sprinklers e irrigación"
          >
            Ver detalles completos del servicio de reparación de sprinklers e irrigación →
          </Link>

          <p>
            Nuestro objetivo es simple: dejar tu sistema funcionando correctamente, proteger tu jardín y ayudarte a evitar el desperdicio de agua. Si tus
            zonas de sprinklers riegan de forma dispareja, tu temporizador no responde o estás viendo partes mojadas en el jardín, diagnosticamos el problema y te explicamos
            la solución antes de empezar.
          </p>

          <h3 className="spr-landing-h3">Problemas comunes de sprinklers que reparamos</h3>

          <p>
            Atendemos los problemas más comunes de sprinklers e irrigación en el sur de Florida, incluyendo cabezales rotos, patrones de riego desajustados,
            tuberías rotas, problemas de válvulas y zonas, diagnóstico de temporizadores y controladores, y fugas en riego por goteo.
          </p>

          <p>
            ¿No sabes qué está mal? Cuéntanos qué estás notando (baja presión, una zona que no enciende, agua corriendo sin parar o un área mojada en el
            jardín) y te guiamos con el siguiente paso.
          </p>

          <p>
            Después del servicio de reparación de sprinklers e irrigación, también ofrecemos <Link href="/services/wireless-camera-installation">instalación de cámaras inalámbricas</Link> y
            {" "}
            <Link href="/services">soporte técnico</Link> (Wi-Fi, computadoras, impresoras y más) para hogares y pequeños negocios.
          </p>

          <h3 className="spr-landing-h3">Área de servicio</h3>

          <p>
            Atendemos Miami-Dade y Broward, incluyendo Sunrise, Fort Lauderdale, Weston, Davie, Hollywood, Pembroke Pines, Miramar, Aventura, Hialeah, Doral, Miami, Kendall y Cutler Bay. Si estás cerca
            y no ves tu ciudad en la lista, escríbenos y te confirmamos disponibilidad.
          </p>

          <p>
            ¿Listo para empezar? Llama ahora o <Link href="/request-quote">solicita una cotización</Link> y te confirmamos los detalles y programamos
            la próxima visita disponible.
          </p>
        </div>
      </section>

      <section className="spr-landing-section" aria-label="Sprinkler repair highlights">
        <div className="spr-landing">
          <h2 className="spr-landing-title">Repara los sprinklers. Protege el jardín. Deja de desperdiciar agua.</h2>
          <p className="spr-landing-sub">
            Diagnóstico rápido, comunicación clara y servicio confiable en sitio en Miami-Dade y Broward.
          </p>

          <div className="spr-cardGrid">
            <div className="spr-card spr-anim" style={{ animationDelay: "0ms" }}>
              <div className="spr-cardMedia">
                <SprinklerIllustration />
              </div>
              <h3 className="spr-cardTitle">Cabezales, cobertura y problemas de zonas</h3>
              <p className="spr-cardText">
                Cabezales rotos, riego disparejo, baja cobertura o una zona que no enciende: encontramos la causa y la dejamos funcionando
                correctamente.
              </p>
            </div>

            <div className="spr-card spr-anim" style={{ animationDelay: "80ms" }}>
              <div className="spr-cardMedia">
                <ControllerIllustration />
              </div>
              <h3 className="spr-cardTitle">Problemas con el temporizador y controlador</h3>
              <p className="spr-cardText">
                Si la programación está mal, las zonas riegan a la hora incorrecta o el controlador no responde, revisamos la configuración y
                el equipo.
              </p>
            </div>

            <div className="spr-card spr-anim" style={{ animationDelay: "160ms" }}>
              <div className="spr-cardMedia">
                <LeakIllustration />
              </div>
              <h3 className="spr-cardTitle">Fugas y agua corriendo sin parar</h3>
              <p className="spr-cardText">
                Áreas mojadas, agua acumulada o un sistema que no apaga pueden indicar problemas de válvulas o tuberías: identificamos y reparamos
                la fuga.
              </p>
            </div>
          </div>

          <div className="spr-steps" aria-label="How it works">
            <h2 className="spr-landing-title">Cómo funciona</h2>
            <div className="spr-stepGrid">
              <div className="spr-step spr-anim" style={{ animationDelay: "0ms" }}>
                <div className="spr-stepNum">1</div>
                <div>
                  <h3 className="spr-stepTitle">Cuéntanos qué estás viendo</h3>
                  <p className="spr-stepText">Baja presión, una zona que no funciona, fugas o problemas de cobertura: te hacemos 1 o 2 preguntas rápidas.</p>
                </div>
              </div>
              <div className="spr-step spr-anim" style={{ animationDelay: "80ms" }}>
                <div className="spr-stepNum">2</div>
                <div>
                  <h3 className="spr-stepTitle">Diagnóstico en sitio</h3>
                  <p className="spr-stepText">Inspeccionamos el sistema, aislamos el problema y te explicamos claramente la solución recomendada.</p>
                </div>
              </div>
              <div className="spr-step spr-anim" style={{ animationDelay: "160ms" }}>
                <div className="spr-stepNum">3</div>
                <div>
                  <h3 className="spr-stepTitle">Reparación y prueba</h3>
                  <p className="spr-stepText">Completamos la reparación y probamos las zonas para que tu sistema funcione de forma confiable otra vez.</p>
                </div>
              </div>
            </div>
          </div>

          <p className="spr-landing-cta">
            ¿Prefieres agendar directo? <Link href="/request-quote">Solicita una cotización</Link> o llama ahora. ¿Quieres los detalles completos del servicio? Ver{" "}
            <Link href={SPRINKLER_SERVICE_DETAILS_HREF}>Reparación de Sprinklers e Irrigación</Link>.
          </p>
        </div>
      </section>
      <section className="spr-landing-section" aria-label="Frequently asked questions">
        <div className="spr-landing">
          <div className="service-faq">
            <h2 className="faq-heading">Preguntas Frecuentes Sobre Reparación de Sprinklers en Miami</h2>
            <div className="faq-list">
              <details className="faq-item">
                <summary className="faq-question">
                  <span>¿Cuánto cuesta la reparación de sprinklers en Miami?</span>
                  <span className="faq-toggle" aria-hidden="true">+</span>
                </summary>
                <p className="faq-answer">Depende del problema y del tamaño de tu sistema. Un cabezal roto cuesta menos que una reparación de válvula o de zona. CallTechCare te da un estimado claro y por adelantado antes de empezar cualquier trabajo, y el estimado es gratis.</p>
              </details>
              <details className="faq-item">
                <summary className="faq-question">
                  <span>¿Qué tan rápido pueden venir a reparar mis sprinklers?</span>
                  <span className="faq-toggle" aria-hidden="true">+</span>
                </summary>
                <p className="faq-answer">En la mayoría de las áreas de Miami-Dade y Broward, hay citas disponibles el mismo día. Llama al (786) 366-2729 y te confirmamos la próxima visita disponible.</p>
              </details>
              <details className="faq-item">
                <summary className="faq-question">
                  <span>¿Qué áreas atienden?</span>
                  <span className="faq-toggle" aria-hidden="true">+</span>
                </summary>
                <p className="faq-answer">Atendemos 13 ciudades en Miami-Dade y Broward, desde Sunrise hasta Cutler Bay, incluyendo Sunrise, Fort Lauderdale, Weston, Davie, Hollywood, Pembroke Pines, Miramar, Aventura, Hialeah, Doral, Miami, Kendall y Cutler Bay.</p>
              </details>
              <details className="faq-item">
                <summary className="faq-question">
                  <span>¿Por qué una zona de sprinklers no funciona?</span>
                  <span className="faq-toggle" aria-hidden="true">+</span>
                </summary>
                <p className="faq-answer">Las causas más comunes son una válvula defectuosa, un problema de cableado, un problema del temporizador o una fuga subterránea. Diagnosticamos la causa raíz antes de recomendar una reparación.</p>
              </details>
              <details className="faq-item">
                <summary className="faq-question">
                  <span>¿Instalan sistemas nuevos de sprinklers o solo los reparan?</span>
                  <span className="faq-toggle" aria-hidden="true">+</span>
                </summary>
                <p className="faq-answer">Ambos. Instalamos zonas nuevas de irrigación, válvulas, líneas de sprinklers y controladores, y podemos actualizar sistemas viejos con controladores WiFi inteligentes.</p>
              </details>
              <details className="faq-item">
                <summary className="faq-question">
                  <span>¿Reparan fugas de sprinklers?</span>
                  <span className="faq-toggle" aria-hidden="true">+</span>
                </summary>
                <p className="faq-answer">Sí. Reparamos fugas de sprinklers, incluyendo fugas en tuberías de PVC, válvulas con fuga y cabezales rotos, y probamos el sistema después de la reparación.</p>
              </details>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
