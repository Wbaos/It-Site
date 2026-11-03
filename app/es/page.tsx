import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/sections/Hero";
import GoogleReviewsCTA from "@/components/sections/GoogleReviewsCTA";

export const dynamic = "force-dynamic";

const ES_HOME_URL = "https://www.calltechcare.com/es/";
const EN_HOME_URL = "https://www.calltechcare.com/";

// Spanish twin of the English home page. Static Spanish copy mirroring the
// English home sections (hero, services, intro, why us, how it works,
// Google reviews, areas, guarantee, emergency, hours, contact). Service and
// city links point to the existing English pages: no /es/* URL is linked
// unless it exists in this branch (/es/ itself, plus the Spanish service,
// contact and quote pages, which the switcher links to).
// No prices, no diagnosis cost, no round-the-clock promise, no invented testimonials:
// the only review data shown is the real Google aggregate rendered by
// GoogleReviewsCTA (5.0, 26 reviews, link to Google).
export const metadata: Metadata = {
  title: "Reparación de Sprinklers en Miami y Broward | CallTechCare",
  description:
    "Reparación de sprinklers e irrigación en Miami y Broward. Servicio el mismo día dentro del horario de servicio, estimados gratis. Llama al (786) 366-2729.",
  alternates: {
    canonical: ES_HOME_URL,
    languages: {
      es: ES_HOME_URL,
      en: EN_HOME_URL,
      "x-default": EN_HOME_URL,
    },
  },
  openGraph: {
    title: "Reparación de Sprinklers en Miami y Broward | CallTechCare",
    description:
      "Reparación de sprinklers e irrigación en Miami y Broward. Servicio el mismo día dentro del horario de servicio, estimados gratis.",
    url: ES_HOME_URL,
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
    title: "Reparación de Sprinklers en Miami y Broward | CallTechCare",
    description:
      "Reparación de sprinklers e irrigación en Miami y Broward. Servicio el mismo día dentro del horario de servicio, estimados gratis.",
    images: ["https://www.calltechcare.com/logo-og.png"],
  },
};

const AREAS: { name: string; href: string }[] = [
  { name: "Sunrise", href: "/sprinkler-repair-sunrise" },
  { name: "Fort Lauderdale", href: "/sprinkler-repair-fort-lauderdale" },
  { name: "Dania Beach", href: "/sprinkler-repair-dania-beach" },
  { name: "Weston", href: "/sprinkler-repair-weston" },
  { name: "Davie", href: "/sprinkler-repair-davie" },
  { name: "Southwest Ranches", href: "/sprinkler-repair-southwest-ranches" },
  { name: "Hollywood", href: "/sprinkler-repair-hollywood" },
  { name: "West Park", href: "/sprinkler-repair-west-park" },
  { name: "Pembroke Pines", href: "/sprinkler-repair-pembroke-pines" },
  { name: "Miramar", href: "/sprinkler-repair-miramar" },
  { name: "Miami Gardens", href: "/sprinkler-repair-miami-gardens" },
  { name: "Miami Lakes", href: "/sprinkler-repair-miami-lakes" },
  { name: "Country Club", href: "/sprinkler-repair-country-club" },
  { name: "Aventura", href: "/sprinkler-repair-aventura" },
  { name: "Sunny Isles Beach", href: "/sprinkler-repair-sunny-isles-beach" },
  { name: "North Miami", href: "/sprinkler-repair-north-miami" },
  { name: "Surfside", href: "/sprinkler-repair-surfside" },
  { name: "North Bay Village", href: "/sprinkler-repair-north-bay-village" },
  { name: "Miami Beach", href: "/sprinkler-repair-miami-beach" },
  { name: "Hialeah", href: "/sprinkler-repair-hialeah" },
  { name: "Doral", href: "/sprinkler-repair-doral" },
  { name: "Fontainebleau", href: "/sprinkler-repair-fontainebleau" },
  { name: "Tamiami", href: "/sprinkler-repair-tamiami" },
  { name: "Miami", href: "/sprinkler-repair-miami" },
  { name: "Coral Gables", href: "/sprinkler-repair-coral-gables" },
  { name: "Key Biscayne", href: "/sprinkler-repair-key-biscayne" },
  { name: "Kendall", href: "/sprinkler-repair-kendall" },
  { name: "Kendale Lakes", href: "/sprinkler-repair-kendale-lakes" },
  { name: "Country Walk", href: "/sprinkler-repair-country-walk" },
  { name: "Cutler Bay", href: "/sprinkler-repair-cutler-bay" },
];

const SERVICES: { name: string; href: string; desc: string }[] = [
  {
    name: "Reparación e Instalación de Sprinklers",
    href: "/services/sprinkler-repair-and-installation",
    desc: "Reparación de sprinklers e irrigación, y sistemas nuevos, a domicilio en Miami y Broward.",
  },
  {
    name: "Reparación de Fugas de Sprinklers",
    href: "/services/sprinkler-leak-repair",
    desc: "Detectamos y reparamos fugas en líneas, cabezales y válvulas de tu sistema.",
  },
  {
    name: "Reparación de Válvulas de Sprinklers",
    href: "/services/sprinkler-valve-repair",
    desc: "Válvulas que no abren, no cierran o dejan una zona sin regar: las diagnosticamos y reparamos en sitio.",
  },
  {
    name: "Reemplazo de Bombas de Sprinklers",
    href: "/services/sprinkler-pump-replacement",
    desc: "Bombas para sistemas de irrigación: reemplazo e instalación a domicilio.",
  },
  {
    name: "Instalación de Temporizadores de Sprinklers",
    href: "/services/sprinkler-timer-installation",
    desc: "Temporizadores y controladores para que tu sistema riegue en el horario correcto.",
  },
  {
    name: "Actualización a Controlador WiFi de Sprinklers",
    href: "/services/wifi-sprinkler-controller-upgrade",
    desc: "Controla tu sistema desde el teléfono con un controlador WiFi moderno.",
  },
  {
    name: "Instalación de Sensores de Lluvia",
    href: "/services/rain-sensor-installation",
    desc: "Sensores que detienen el riego cuando llueve, para no desperdiciar agua.",
  },
  {
    name: "Instalación Nueva de Irrigación",
    href: "/services/new-irrigation-installation",
    desc: "Sistemas de irrigación nuevos, diseñados e instalados desde cero.",
  },
  {
    name: "Instalación de Cámaras de Seguridad",
    href: "/services/home-security",
    desc: "Cámaras de seguridad para casas y pequeños negocios, instaladas a domicilio.",
  },
];

const WHY_FEATURES: { title: string; text: string }[] = [
  {
    title: "Expertos Pacientes y Amables",
    text: "Ayudamos a dueños de casas y pequeños negocios con explicaciones claras y servicio confiable a domicilio, desde reparaciones de sprinklers hasta cámaras de seguridad.",
  },
  {
    title: "Disponibilidad el Mismo Día",
    text: "La mayoría de las citas están disponibles el mismo día en las 30 áreas de servicio, desde Sunrise hasta Cutler Bay, dentro del horario de servicio.",
  },
  {
    title: "Instalación de Cámaras de Seguridad",
    text: "Instalamos cámaras de seguridad inalámbricas en los lugares correctos, con la mejor cobertura y ángulos de vista, para casas y pequeños negocios.",
  },
  {
    title: "Instalaciones Hechas en Persona",
    text: "Desde la reparación de sprinklers y la solución de problemas de irrigación hasta la instalación de cámaras de seguridad: nos encargamos de los detalles, en tu propiedad.",
  },
  {
    title: "La Confianza de Casas y Pequeños Negocios",
    text: "Desde una sola reparación de sprinklers hasta un sistema nuevo completo o una instalación de cámaras, apoyamos a casas, oficinas en casa y pequeños negocios.",
  },
  {
    title: "Estimado Claro, Sin Sorpresas",
    text: "Te damos un estimado claro en sitio antes de empezar el trabajo. Sin cargos ocultos, sin ventas a presión.",
  },
];

const HOW_STEPS: { title: string; text: string }[] = [
  {
    title: "Llámanos o Pide una Cotización",
    text: "Cuéntanos qué pasa con tu sistema: fugas, cabezales rotos, una zona que no enciende o un sistema nuevo.",
  },
  {
    title: "Visitamos a Domicilio",
    text: "Agendamos tu visita y llegamos a tu propiedad para revisar el sistema completo.",
  },
  {
    title: "Diagnosticamos y Reparamos en Sitio",
    text: "Encontramos la causa del problema y lo reparamos en el lugar, con un estimado claro antes de empezar.",
  },
  {
    title: "Dejamos Todo Funcionando",
    text: "Probamos el sistema zona por zona para que quede regando como debe.",
  },
];

export default function Page() {
  return (
    <>
      <main>
        <Hero
          titleLine1="Reparación de Sprinklers en Miami y Broward"
          titleLine2="Irrigación • Reparaciones • Sistemas Nuevos"
          subtitle="Servicios profesionales de reparación de sprinklers e irrigación en Miami y Broward. También instalamos cámaras de seguridad. Todo el servicio es a domicilio."
          badgeText="Reparación de Sprinklers e Irrigación en Miami y Broward"
          primaryCtaText="Llama Ahora"
          primaryCtaHref="tel:+17863662729"
          secondaryCtaText="Solicita una Cotización"
          secondaryCtaHref="/es/solicita-una-cotizacion"
          phoneNumber="+17863662729"
          showCallButton={true}
          stats={[
            { value: "1500+", label: "Clientes Locales Atendidos" },
            { value: "5/5", label: "Satisfacción del Cliente" },
            { value: "Mismo Día", label: "Citas Disponibles" },
          ]}
        />

        <section id="services" className="section services" role="region" aria-labelledby="services-title">
          <div className="site-container-services">
            <h2 id="services-title" className="services-heading">Servicios Populares en Miami y Broward</h2>
            <p className="services-sub">
              Desde la reparación de sprinklers y la solución de problemas de irrigación hasta la instalación de cámaras de seguridad, ayudamos a casas y pequeños negocios en Miami y Broward con servicio confiable a domicilio.
            </p>
            <div className="services-grid">
              {SERVICES.map((s) => (
                <Link key={s.href} href={s.href} className="service-card">
                  <h3 className="service-card-title">{s.name}</h3>
                  <p className="service-card-desc">{s.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="seo-intro-section">
          <div className="seo-intro">
            <h2 className="seo-intro-title">
              Servicios de Reparación de Sprinklers e Irrigación en Miami y Broward
            </h2>
            <p>
              CallTechCare es un equipo local de servicio enfocado en la{" "}
              <Link href="/sprinkler-repair-miami">reparación de sprinklers en Miami</Link> y la solución de
              problemas de irrigación en Miami-Dade y Broward. Ayudamos con fugas, cabezales rotos, mala cobertura,
              problemas de temporizador o controlador y mantenimiento del sistema, con comunicación clara y servicio
              confiable a domicilio.
            </p>
            <p>
              Después de la reparación de sprinklers y el servicio de irrigación, también ofrecemos instalación de
              cámaras de seguridad para casas y pequeños negocios.
            </p>
            <p>
              Con disponibilidad el mismo día en muchas áreas de Miami y Broward, dentro del horario de servicio,
              CallTechCare hace que agendar sea simple y sin estrés. Llama ahora para reparación de sprinklers o
              solicita una cotización: confirmamos los detalles y reservamos la próxima visita disponible.
            </p>
          </div>
        </section>

        <section className="why-choose" role="region" aria-labelledby="why-title">
          <div className="site-container">
            <div className="why-header">
              <h2 id="why-title">
                ¿Por qué Elegir <span className="brand">CallTechCare</span> para Reparación de Sprinklers en Miami y Broward?
              </h2>
              <p>
                Reparación de sprinklers e irrigación primero, con instalación de cámaras de seguridad disponible en Miami y Broward.
              </p>
            </div>
            <div className="why-grid">
              {WHY_FEATURES.map((f, i) => (
                <div key={i} className="why-card">
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="section how">
          <div className="site-container-how">
            <h2 className="how-heading">Cómo Funciona</h2>
            <p className="how-sub">
              Pasos simples para recibir la ayuda que necesitas con tus sprinklers o cámaras.
            </p>
            <div className="how-grid">
              {HOW_STEPS.map((s, i) => (
                <div key={i} className="how-step">
                  <div className="step-number">{i + 1}</div>
                  <h3 className="step-title">{s.title}</h3>
                  <p className="step-desc">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <GoogleReviewsCTA />

        <section className="section" role="region" aria-labelledby="guarantee-title">
          <div className="site-container">
            <h2 id="guarantee-title">Garantía de 1 Año</h2>
            <p>
              Cuando CallTechCare hace el trabajo y provee los materiales, tu servicio tiene 1 año de garantía.
              Si algo de lo que instalamos o reparamos falla dentro de ese año, lo revisamos y lo corregimos.
            </p>
            <h2 id="emergency-title">Emergencias el Mismo Día</h2>
            <p>
              Atendemos emergencias el mismo día dentro del horario de servicio: de lunes a sábado de 8am a 7pm y
              domingos de 9am a 6pm. Si tienes una fuga activa o un problema urgente, llámanos y buscamos la
              próxima visita disponible ese mismo día.
            </p>
          </div>
        </section>

        <section className="section" role="region" aria-labelledby="areas-title">
          <div className="site-container">
            <h2 id="areas-title">Áreas de Servicio: 30 Ciudades en Miami y Broward</h2>
            <p>
              Atendemos todo el área desde Sunrise hasta Cutler Bay, incluyendo la costa y Miami Beach. Encuentra
              tu ciudad:
            </p>
            <p>
              {AREAS.map((area, i) => (
                <span key={area.href}>
                  {i > 0 && " • "}
                  <Link href={area.href}>{area.name}</Link>
                </span>
              ))}
            </p>
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="contact-header">
            <h2 className="contact-title">¿Preguntas? Hablemos.</h2>
            <p className="contact-desc">
              ¿Tienes una pregunta? Estamos aquí para ayudarte. Respondemos dentro de 24 horas.
            </p>
          </div>
          <div className="site-container">
            <p>
              📞 <a href="tel:+17863662729">(786) 366-2729</a>
              <br />
              ✉️ <a href="mailto:support@calltechcare.com">support@calltechcare.com</a>
            </p>
            <p>
              Lun–Sáb: 8am – 7pm
              <br />
              Dom: 9am – 6pm
            </p>
            <p>
              <Link href="/es/solicita-una-cotizacion">Solicita una cotización</Link> o llámanos para agendar tu visita a domicilio.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
