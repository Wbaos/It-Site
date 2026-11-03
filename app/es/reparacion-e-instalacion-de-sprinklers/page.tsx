import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/sections/Hero";
import TestimonialsList from "@/components/common/TestimonialsList";

const EN_SERVICE_HREF = "/services/sprinkler-repair-and-installation";
const ES_PAGE_URL =
  "https://www.calltechcare.com/es/reparacion-e-instalacion-de-sprinklers";

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

const FAQS = [
  {
    q: "¿Atienden sistemas de irrigación comerciales?",
    a: "Sí. Ofrecemos reparación de sprinklers e instalación de irrigación para casas, tiendas, oficinas, HOAs y propiedades comerciales pequeñas en todo el sur de Florida.",
  },
  {
    q: "¿Cuánto cuesta la reparación de sprinklers?",
    a: "Depende del problema y del tamaño de tu sistema. Reparaciones menores, como reemplazar un cabezal, cuestan menos que instalar una válvula o una zona. Te damos un estimado claro en sitio antes de empezar el trabajo, y el estimado es gratis.",
  },
  {
    q: "¿Por qué una zona de sprinklers no enciende?",
    a: "Las causas más comunes son una válvula defectuosa, un problema de cableado, una configuración incorrecta del temporizador o una fuga subterránea. Diagnosticamos la causa raíz antes de recomendar una reparación.",
  },
  {
    q: "¿Instalan sistemas nuevos de sprinklers?",
    a: "Sí. Instalamos zonas nuevas de irrigación, válvulas y líneas de sprinklers para casas y propiedades comerciales.",
  },
  {
    q: "¿Trabajan con administradores de propiedades o HOAs?",
    a: "Sí. Trabajamos con administradores de propiedades y dueños de negocios para mantener sus sistemas de irrigación de forma eficiente y profesional.",
  },
];

export const metadata: Metadata = {
  title: "Reparación de Sprinklers Miami y Broward | CallTechCare",
  description:
    "Reparación e instalación de sprinklers en Miami y Broward. Cabezales, válvulas, fugas, zonas y controladores. Servicio el mismo día, estimados gratis.",
  alternates: {
    canonical: ES_PAGE_URL,
    languages: {
      es: ES_PAGE_URL,
      en: "https://www.calltechcare.com/services/sprinkler-repair-and-installation",
      "x-default":
        "https://www.calltechcare.com/services/sprinkler-repair-and-installation",
    },
  },
  openGraph: {
    title: "Reparación de Sprinklers Miami y Broward | CallTechCare",
    description:
      "Reparación e instalación de sprinklers en Miami y Broward. Cabezales, válvulas, fugas, zonas y controladores. Servicio el mismo día, estimados gratis.",
    url: ES_PAGE_URL,
    siteName: "CallTechCare",
    images: [
      {
        url: "https://www.calltechcare.com/logo-og.png",
        width: 1200,
        height: 630,
        alt: "CallTechCare - Reparación de Sprinklers en Miami y Broward",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reparación de Sprinklers Miami y Broward | CallTechCare",
    description:
      "Reparación e instalación de sprinklers en Miami y Broward. Cabezales, válvulas, fugas, zonas y controladores. Servicio el mismo día, estimados gratis.",
    images: ["https://www.calltechcare.com/logo-og.png"],
  },
};

export default function ReparacionEInstalacionDeSprinklersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
              },
            })),
          }),
        }}
      />

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Reparación e Instalación de Sprinklers",
            provider: {
              "@type": "LocalBusiness",
              name: "CallTechCare",
              telephone: "+1-786-366-2729",
              url: "https://www.calltechcare.com",
            },
            areaServed: {
              "@type": "Place",
              name: "Miami, Fort Lauderdale, Broward County",
            },
            description:
              "Reparación e instalación de sprinklers en Miami y Broward. Cabezales, válvulas, fugas, zonas y controladores. Servicio el mismo día, estimados gratis.",
            url: ES_PAGE_URL,
          }),
        }}
      />

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.calltechcare.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Servicios",
                item: "https://www.calltechcare.com/services",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "Reparación e Instalación de Sprinklers",
                item: ES_PAGE_URL,
              },
            ],
          }),
        }}
      />

      <Hero
        titleLine1="Reparación e Instalación de Sprinklers"
        titleLine2="Irrigación • Reparaciones • Sistemas Nuevos"
        subtitle="Reparación de sprinklers e instalación de irrigación en Miami y Broward para casas y negocios: cabezales rotos, válvulas, fugas, zonas y controladores. Servicio el mismo día, estimados gratis."
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
            <Link href={EN_SERVICE_HREF}>View this page in English →</Link>
          </p>

          <h2 className="seo-intro-title">Servicios de Reparación e Instalación de Sprinklers e Irrigación en Miami y Broward</h2>

          <p>
            Si necesitas reparación de sprinklers en Miami o Broward, CallTechCare te ayuda rápido y sin complicaciones: cabezales rotos, válvulas,
            fugas, zonas que no encienden y problemas del controlador, en casas y negocios de Miami-Dade y Broward.
          </p>

          <p>
            Todos nuestros servicios son a domicilio: vamos a tu casa o negocio. Cuando CallTechCare hace el trabajo y provee los materiales, el
            servicio tiene garantía de 1 año. Atendemos de lunes a sábado de 8am a 7pm y domingos de 9am a 6pm, y respondemos dentro de 24 horas.
            Si es una emergencia, atendemos el mismo día dentro de nuestro horario de servicio.
          </p>

          <figure style={{ margin: "1rem 0 0" }}>
            <Image
              src="https://cdn.sanity.io/images/celkrwoq/production/5deeea70b525963987af93601f412cebdbede547-5712x4284.webp?w=900&auto=format"
              alt="Sistema de sprinklers funcionando"
              width={900}
              height={675}
              loading="lazy"
              style={{ width: "100%", height: "auto", aspectRatio: "4 / 3", objectFit: "cover", borderRadius: "12px", display: "block" }}
            />
            <figcaption>Sistema de sprinklers funcionando</figcaption>
          </figure>

          <div className="included-box">
            <h2>Qué incluye</h2>
            <ul className="included-list">
              <li>Reparación de sprinklers para casas</li>
              <li>Diagnóstico de sistemas de irrigación comerciales</li>
              <li>Reemplazo de cabezales de sprinklers rotos</li>
              <li>Reparación y reemplazo de válvulas de irrigación</li>
              <li>Reparación de tuberías de PVC y fugas subterráneas</li>
              <li>Programación de temporizadores y reemplazo de controladores</li>
              <li>Instalación de zonas nuevas de irrigación</li>
              <li>Diagnóstico de presión de agua</li>
              <li>Prueba completa del sistema y ajustes</li>
            </ul>
          </div>

          <p>
            ¿No sabes qué está mal? Cuéntanos qué estás notando (baja presión, una zona que no enciende, agua corriendo sin parar o un área mojada en el
            jardín) y te guiamos con el siguiente paso.
          </p>

          <h3 className="spr-landing-h3">Servicios relacionados de sprinklers</h3>

          <p>
            <Link href="/services/sprinkler-leak-repair">Reparación de Fugas de Sprinklers</Link>,{" "}
            <Link href="/services/sprinkler-valve-repair">Reparación de Válvulas de Sprinklers</Link>,{" "}
            <Link href="/services/sprinkler-timer-installation">Instalación de Temporizadores de Sprinklers</Link>,{" "}
            <Link href="/services/sprinkler-pump-replacement">Reemplazo de Bombas de Sprinklers</Link>,{" "}
            <Link href="/services/rain-sensor-installation">Instalación de Sensores de Lluvia</Link>,{" "}
            <Link href="/services/wifi-sprinkler-controller-upgrade">Actualización a Controlador WiFi para Sprinklers</Link> y{" "}
            <Link href="/services/new-irrigation-installation">Instalación de Irrigación Nueva</Link>.
          </p>

          <h3 className="spr-landing-h3">Área de servicio</h3>

          <p>
            Atendemos todo Miami-Dade y Broward, incluyendo <Link href="/sprinkler-repair-sunrise">Sunrise</Link>, <Link href="/locations/fort-lauderdale">Fort Lauderdale</Link>, <Link href="/sprinkler-repair-dania-beach">Dania Beach</Link>, <Link href="/sprinkler-repair-weston">Weston</Link>, <Link href="/sprinkler-repair-davie">Davie</Link>, <Link href="/sprinkler-repair-southwest-ranches">Southwest Ranches</Link>, <Link href="/sprinkler-repair-hollywood">Hollywood</Link>, <Link href="/sprinkler-repair-west-park">West Park</Link>, <Link href="/sprinkler-repair-pembroke-pines">Pembroke Pines</Link>, <Link href="/sprinkler-repair-miramar">Miramar</Link>, <Link href="/sprinkler-repair-miami-gardens">Miami Gardens</Link>, <Link href="/sprinkler-repair-miami-lakes">Miami Lakes</Link>, <Link href="/sprinkler-repair-country-club">Country Club</Link>, <Link href="/sprinkler-repair-aventura">Aventura</Link>, <Link href="/sprinkler-repair-sunny-isles-beach">Sunny Isles Beach</Link>, <Link href="/sprinkler-repair-north-miami">North Miami</Link>, <Link href="/sprinkler-repair-surfside">Surfside</Link>, <Link href="/sprinkler-repair-north-bay-village">North Bay Village</Link>, <Link href="/sprinkler-repair-miami-beach">Miami Beach</Link>, <Link href="/sprinkler-repair-hialeah">Hialeah</Link>, <Link href="/sprinkler-repair-doral">Doral</Link>, <Link href="/sprinkler-repair-fontainebleau">Fontainebleau</Link>, <Link href="/sprinkler-repair-tamiami">Tamiami</Link>, <Link href="/sprinkler-repair-coral-gables">Coral Gables</Link>, <Link href="/sprinkler-repair-key-biscayne">Key Biscayne</Link>, <Link href="/sprinkler-repair-kendall">Kendall</Link>, <Link href="/sprinkler-repair-kendale-lakes">Kendale Lakes</Link>, <Link href="/sprinkler-repair-country-walk">Country Walk</Link> y <Link href="/sprinkler-repair-cutler-bay">Cutler Bay</Link>. Si estás cerca
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
              <h3 className="spr-cardTitle">Reparación para casas y negocios</h3>
              <p className="spr-cardText">
                Reparamos sprinklers en casas, tiendas, oficinas, HOAs y propiedades comerciales pequeñas en todo el sur de Florida.
              </p>
            </div>

            <div className="spr-card spr-anim" style={{ animationDelay: "80ms" }}>
              <div className="spr-cardMedia">
                <LeakIllustration />
              </div>
              <h3 className="spr-cardTitle">Válvulas, fugas y zonas</h3>
              <p className="spr-cardText">
                Válvulas defectuosas, fugas subterráneas, tuberías de PVC rotas y zonas que no encienden: diagnosticamos la causa raíz antes de
                recomendar una reparación.
              </p>
            </div>

            <div className="spr-card spr-anim" style={{ animationDelay: "160ms" }}>
              <div className="spr-cardMedia">
                <ControllerIllustration />
              </div>
              <h3 className="spr-cardTitle">Temporizadores y controladores</h3>
              <p className="spr-cardText">
                Programación de temporizadores, reemplazo de controladores y actualización a controladores WiFi inteligentes.
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
            ¿Prefieres agendar directo? <Link href="/request-quote">Solicita una cotización</Link> o llama ahora. ¿Prefieres ver esta página en inglés? Ver{" "}
            <Link href={EN_SERVICE_HREF}>Sprinkler Repair &amp; Installation</Link>.
          </p>
        </div>
      </section>

      <section className="spr-landing-section" aria-label="Customer reviews">
        <div className="spr-landing">
          <TestimonialsList
            title="Reseñas de clientes"
            subtitle="Experiencias reales de clientes en Miami y Broward."
            items={[
              {
                name: "Carlos M.",
                text: "They fixed a broken sprinkler zone in our commercial property quickly and professionally. Clear pricing and great communication.",
                rating: 5,
                verified: true,
                date: "2026-01-09",
              },
              {
                name: "Angela R.",
                text: "Our backyard sprinkler system stopped working and they diagnosed the valve issue immediately. Highly recommend.",
                rating: 5,
                verified: true,
                date: "2026-01-29",
              },
              {
                name: "Lorenzo",
                text: "Todas las zonas de my sistema se estaban activando a la misma vez y CallTechCare lo soluciono.",
                rating: 5,
                verified: true,
                date: "2026-02-10",
              },
            ]}
          />
        </div>
      </section>

      <section className="spr-landing-section" aria-label="Frequently asked questions">
        <div className="spr-landing">
          <div className="service-faq">
            <h2 className="faq-heading">Preguntas Frecuentes Sobre Reparación e Instalación de Sprinklers</h2>
            <div className="faq-list">
              {FAQS.map((faq) => (
                <details className="faq-item" key={faq.q}>
                  <summary className="faq-question">
                    <span>{faq.q}</span>
                    <span className="faq-toggle" aria-hidden="true">+</span>
                  </summary>
                  <p className="faq-answer">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
