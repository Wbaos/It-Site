import Link from "next/link";
import { getFaqPage, type FaqPage, type FaqItem } from "@/lib/sanityFaq";
import { resolveSiteSettings, substitutePhonePlaceholders } from "@/lib/sanitySettings";

// Single FAQ template for both languages: the same sections, in the same
// order, with the same classes. Copy comes from the Sanity `faqPage`
// document; the fallbacks below are the exact pre-migration texts, used
// only if the document is missing a field.

type Locale = "en" | "es";

type FaqCopy = {
  title: string;
  introBefore: string;
  introLink1Text: string;
  introBetween: string;
  introLink2Text: string;
  introAfter: string;
  faqs: { q: string; a: string }[];
  contactBefore: string;
  contactLinkText: string;
  contactAfter: string;
};

const FALLBACK_EN: FaqCopy = {
  title: "Frequently Asked Questions",
  introBefore: "Here are answers to common questions about our services in Miami and Broward, including ",
  introLink1Text: "Sprinkler Repair Miami",
  introBetween: " and ",
  introLink2Text: "security camera installation",
  introAfter: ".",
  faqs: [
    {
      q: "What areas do you serve?",
      a: "CallTechCare provides on-site services across Miami-Dade and Broward, including Miami, Miramar, Pembroke Pines, Hollywood, and Fort Lauderdale.",
    },
    {
      q: "Do you offer sprinkler repair & irrigation services?",
      a: "Yes. Sprinkler repair and irrigation troubleshooting are our primary services. We help with leaks, broken heads, poor coverage, controller/timer issues, and system optimization.",
    },
    {
      q: "Do you install security cameras?",
      a: "Yes. We install security cameras and help with placement, wiring, network connectivity, and troubleshooting for residential and small business systems.",
    },
    {
      q: "Do you repair sprinkler systems in HOA communities?",
      a: "Yes. We repair and install sprinkler systems in HOA communities across Miami and Broward. Call {{phone}} and we'll confirm coverage for your community.",
    },
    {
      q: "How can I book a service?",
      a: "You can request service directly on our website using the request form or call us at {{phone}} to schedule an appointment.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept cash, checks, major credit and debit cards, and Zelle, paid in person at the end of your appointment. There is no online checkout.",
    },
    {
      q: "What if I’m not satisfied with the service?",
      a: "Your satisfaction is our priority. If something wasn’t fully resolved, we will work with you to correct the issue or arrange a follow-up visit.",
    },
  ],
  contactBefore: "Still have questions? ",
  contactLinkText: "Contact our team",
  contactAfter: " and we’ll be happy to help.",
};

const FALLBACK_ES: FaqCopy = {
  title: "Preguntas Frecuentes",
  introBefore: "Aquí están las respuestas a preguntas comunes sobre nuestros servicios en Miami y Broward, incluyendo ",
  introLink1Text: "Reparación de Sprinklers en Miami",
  introBetween: " y ",
  introLink2Text: "instalación de cámaras de seguridad",
  introAfter: ".",
  faqs: [
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
      a: "Sí. Reparamos e instalamos sistemas de sprinklers en comunidades HOA en Miami y Broward. Llama al {{phone}} y confirmaremos la cobertura para tu comunidad.",
    },
    {
      q: "¿Cómo puedo reservar un servicio?",
      a: "Puedes reservar directamente en nuestro sitio web usando el formulario de solicitud o llamarnos al {{phone}} para programar una cita.",
    },
    {
      q: "¿Qué métodos de pago aceptan?",
      a: "Aceptamos efectivo, cheques, tarjetas de crédito y débito, y Zelle, pagados en persona al final de tu cita. No hay pago en línea.",
    },
    {
      q: "¿Qué pasa si no estoy satisfecho con el servicio?",
      a: "Tu satisfacción es nuestra prioridad. Si algo no quedó completamente resuelto, trabajaremos contigo para corregir el problema o programar una visita de seguimiento.",
    },
  ],
  contactBefore: "¿Todavía tienes preguntas? ",
  contactLinkText: "Contacta a nuestro equipo",
  contactAfter: " y con gusto te ayudaremos.",
};

export default async function FaqTemplate({ locale = "en" }: { locale?: Locale }) {
  let doc: FaqPage | null = null;
  try {
    doc = await getFaqPage();
  } catch {
    doc = null;
  }
  const isEs = locale === "es";
  const fb = isEs ? FALLBACK_ES : FALLBACK_EN;
  // Live phone from site-settings; every text below (Sanity or fallback)
  // goes through the placeholder helper, so {{phone}} in Sanity copy
  // resolves to the single number in settings.
  const settings = await resolveSiteSettings();
  const sub = (s: string | undefined) => substitutePhonePlaceholders(s ?? "", settings);

  const title = sub((isEs ? doc?.titleEs : doc?.title) ?? fb.title);
  const introBefore = sub((isEs ? doc?.introBeforeEs : doc?.introBefore) ?? fb.introBefore);
  const introLink1Text = sub((isEs ? doc?.introLink1TextEs : doc?.introLink1Text) ?? fb.introLink1Text);
  const introBetween = sub((isEs ? doc?.introBetweenEs : doc?.introBetween) ?? fb.introBetween);
  const introLink2Text = sub((isEs ? doc?.introLink2TextEs : doc?.introLink2Text) ?? fb.introLink2Text);
  const introAfter = sub((isEs ? doc?.introAfterEs : doc?.introAfter) ?? fb.introAfter);
  const rawFaqs: FaqItem[] | undefined = isEs ? doc?.faqsEs : doc?.faqs;
  const faqs =
    rawFaqs && rawFaqs.length > 0
      ? rawFaqs.map((f, i) => ({
          q: sub(f.q ?? fb.faqs[i]?.q ?? ""),
          a: sub(f.a ?? fb.faqs[i]?.a ?? ""),
        }))
      : fb.faqs.map((f) => ({ q: sub(f.q), a: sub(f.a) }));
  const contactBefore = sub((isEs ? doc?.contactBeforeEs : doc?.contactBefore) ?? fb.contactBefore);
  const contactLinkText = sub((isEs ? doc?.contactLinkTextEs : doc?.contactLinkText) ?? fb.contactLinkText);
  const contactAfter = sub((isEs ? doc?.contactAfterEs : doc?.contactAfter) ?? fb.contactAfter);

  const cityHref = isEs ? "/es/reparacion-de-sprinklers-miami" : "/sprinkler-repair-miami";
  const contactHref = isEs ? "/es/contacto" : "/contact";

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
        <h1 className="faq-title">{title}</h1>
        <p className="faq-intro">
          {introBefore}
          <Link href={cityHref}>{introLink1Text}</Link>
          {introBetween}
          <Link href="/services/home-security">{introLink2Text}</Link>
          {introAfter}
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
            {contactBefore}
            <Link href={contactHref} className="faq-link">
              {contactLinkText}
            </Link>
            {contactAfter}
          </p>
        </section>
      </div>
    </main>
  );
}
