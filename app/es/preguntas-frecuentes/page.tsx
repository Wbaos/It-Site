import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes | Reparación de Sprinklers en Miami y Broward | CallTechCare",
  description: "Encuentra respuestas a preguntas comunes sobre la reparación de sprinklers e irrigación de CallTechCare en Miami y Broward: costos, servicio el mismo día, fugas, válvulas y temporizadores.",
  alternates: {
    canonical: "https://www.calltechcare.com/es/preguntas-frecuentes",
    languages: {
      es: "https://www.calltechcare.com/es/preguntas-frecuentes",
      en: "https://www.calltechcare.com/faq",
    },
  },
};

export default function FAQPageEs() {
  const faqs = [
    {
      q: "¿Qué áreas atienden?",
      a: "CallTechCare presta servicios a domicilio en Miami-Dade y Broward, incluyendo Miami, Miramar, Pembroke Pines, Hollywood y Fort Lauderdale.",
    },
    {
      q: "¿Ofrecen servicios de reparación de sprinklers e irrigación?",
      a: "Sí. La reparación de sprinklers y la solución de problemas de irrigación son nuestros servicios principales. Ayudamos con fugas, cabezales rotos, mala cobertura, problemas de controlador/temporizador y optimización del sistema.",
    },
    {
      q: "¿Instalan cámaras de seguridad?",
      a: "Sí. Instalamos cámaras de seguridad y ayudamos con la colocación, cableado, conectividad de red y solución de problemas para sistemas residenciales y de pequeños negocios.",
    },
    {
      q: "¿Reparan sistemas de sprinklers en comunidades HOA?",
      a: "Sí. Reparamos e instalamos sistemas de sprinklers en comunidades HOA en Miami y Broward. Llama al (786) 366-2729 y confirmaremos la cobertura para tu comunidad.",
    },
    {
      q: "¿Cómo puedo reservar un servicio?",
      a: "Puedes reservar directamente en nuestro sitio web usando el formulario de solicitud o llamarnos al (786) 366-2729 para programar una cita.",
    },
    {
      q: "¿Qué métodos de pago aceptan?",
      a: "Aceptamos las principales tarjetas de crédito y débito a través de un pago seguro, y el pago también puede completarse al final de tu cita.",
    },
    {
      q: "¿Qué pasa si no estoy satisfecho con el servicio?",
      a: "Tu satisfacción es nuestra prioridad. Si algo no quedó completamente resuelto, trabajaremos contigo para corregir el problema o programar una visita de seguimiento.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <main className="faq-page-container">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <div className="faq-page">
        <h1 className="faq-title">Preguntas Frecuentes</h1>
        <p className="faq-intro">
          Aquí están las respuestas a preguntas comunes sobre nuestros servicios en Miami y Broward, incluyendo{" "}
          <Link href="/es/reparacion-de-sprinklers-miami">Reparación de Sprinklers en Miami</Link> y{" "}
          <Link href="/services/home-security">instalación de cámaras de seguridad</Link>.
        </p>
        <div className="faq-container">
          {faqs.map((faq, i) => (
            <details key={i} className="faq-item">
              <summary className="faq-question">
                {faq.q}
                <span className="faq-arrow">▼</span>
              </summary>
              <p className="faq-answer">{faq.a}</p>
            </details>
          ))}
        </div>
        <section className="faq-contact">
          <p>
            ¿Todavía tienes preguntas?{" "}
            <Link href="/es/contacto" className="faq-link">
              Contacta a nuestro equipo
            </Link>{" "}
            y con gusto te ayudaremos.
          </p>
        </section>
      </div>
    </main>
  );
}
