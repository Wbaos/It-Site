import { Metadata } from "next";
import Link from "next/link";
import SvgIcon from "@/components/common/SvgIcons";

export const metadata: Metadata = {
  title: "Política de Privacidad | CallTechCare",

  description:
    "Lee la política de privacidad de CallTechCare para entender cómo recopilamos, usamos y protegemos tu información personal cuando solicitas o usas nuestros servicios en Miami y Broward, incluyendo reparación de sprinklers e irrigación e instalación de cámaras de seguridad.",

  alternates: {
    canonical: "https://www.calltechcare.com/es/politica-de-privacidad",
    languages: { es: "https://www.calltechcare.com/es/politica-de-privacidad", en: "https://www.calltechcare.com/privacy-policy" },
  },

  openGraph: {
    title: "Política de Privacidad | CallTechCare",
    description:
      "Conoce cómo CallTechCare recopila, usa y protege tu información personal mientras presta sus servicios.",
    url: "https://www.calltechcare.com/es/politica-de-privacidad",
    siteName: "CallTechCare",
    images: [
      {
        url: "https://www.calltechcare.com/logo-schema.png",
        width: 512,
        height: 512,
      },
    ],
  },
};

export default function PrivacyPolicyPageEs() {

  const privacySchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Política de Privacidad",
    url: "https://www.calltechcare.com/es/politica-de-privacidad",
    publisher: {
      "@type": "Organization",
      name: "CallTechCare",
      url: "https://www.calltechcare.com",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(privacySchema),
        }}
      />

      <section className="legal-wrapper">
        <div className="legal-container">

          <Link href="/es/" className="legal-back">
            <SvgIcon name="chevron-left" size={18} color="var(--brand-teal)" />
            Volver a la página principal
          </Link>

          <div className="legal-header">
            <SvgIcon
              name="privacy-shield"
              size={80}
              className="legal-header-icon"
            />

            <h1>Política de Privacidad</h1>
            <p className="legal-updated">Última actualización: marzo de 2026</p>

            <p className="legal-intro">
              En CallTechCare, estamos comprometidos con proteger tu privacidad y garantizar la seguridad de tu información personal. Esta Política de Privacidad explica cómo recopilamos, usamos, compartimos y protegemos tus datos.
            </p>
          </div>

          {/* Información que recopilamos */}
          <div className="legal-card">
            <div className="legal-card-header">
              <SvgIcon name="privacy-info-collect" size={38} className="legal-card-icon" />
              <h2>Información que recopilamos</h2>
            </div>

            <p className="legal-highlight">Información personal</p>
            <p>
              Cuando usas nuestros servicios, podemos recopilar tu nombre, dirección de correo electrónico, número de teléfono y dirección del servicio. Esta información es necesaria para prestar los servicios y comunicarnos contigo. No hay pago en línea en este sitio web: los pagos se realizan en persona al final de la cita.
            </p>

            <p className="legal-highlight">Información técnica</p>
            <p>
              Recopilamos automáticamente ciertos detalles técnicos, como tu dirección IP, tipo de navegador, información del dispositivo, URLs de referencia y páginas visitadas. Esto nos ayuda a mejorar el rendimiento del sitio y diagnosticar problemas.
            </p>
          </div>

          {/* Cómo usamos tu información */}
          <div className="legal-card">
            <div className="legal-card-header">
              <SvgIcon name="privacy-how-we-use" size={38} className="legal-card-icon" />
              <h2>Cómo usamos tu información</h2>
            </div>

            <p className="legal-highlight">Prestación del servicio</p>
            <p>
              Usamos tu información para prestar, mantener y mejorar nuestros servicios, incluyendo programación, solución de problemas, instalación y atención al cliente.
            </p>

            <p className="legal-highlight">Comunicación</p>
            <p>
              Podemos contactarte sobre actualizaciones del servicio, programación, facturas, solución de problemas o boletines opcionales. Puedes darte de baja del marketing en cualquier momento.
            </p>

            <p className="legal-highlight">Analítica y mejoras</p>
            <p>
              Analizamos el uso del sitio web y de los servicios para mejorar el rendimiento y crear mejores funciones para nuestros clientes.
            </p>

            <p className="legal-highlight">Cumplimiento legal</p>
            <p>
              Tu información puede usarse para cumplir con requisitos legales, hacer cumplir acuerdos o resolver disputas.
            </p>
          </div>

          {/* Seguridad de los datos */}
          <div className="legal-card">
            <div className="legal-card-header">
              <SvgIcon name="privacy-security" size={38} className="legal-card-icon" />
              <h2>Seguridad de los datos</h2>
            </div>

            <p className="legal-highlight">Medidas de seguridad</p>
            <p>
              Implementamos medidas técnicas de seguridad sólidas, incluyendo cifrado SSL, servidores seguros, cortafuegos y protección contra malware.
            </p>

            <p className="legal-highlight">Controles de acceso</p>
            <p>
              El acceso a los datos personales está restringido al personal autorizado que sigue prácticas estrictas de confidencialidad y seguridad.
            </p>

            <p className="legal-highlight">Seguridad de terceros</p>
            <p>
              Evaluamos cuidadosamente a todos los proveedores de servicios externos para asegurar que cumplan con los estándares de seguridad y privacidad.
            </p>
          </div>

          {/* Compartir información */}
          <div className="legal-card">
            <div className="legal-card-header">
              <SvgIcon name="privacy-sharing" size={38} className="legal-card-icon" />
              <h2>Compartir información</h2>
            </div>

            <p className="legal-highlight">Proveedores de servicios</p>
            <p>
              Podemos compartir la información necesaria con socios de confianza, como proveedores de alojamiento o herramientas de analítica.
            </p>

            <p className="legal-highlight">Requisitos legales</p>
            <p>
              Podemos divulgar tu información si lo exige la ley, una orden judicial, o para proteger nuestros derechos y la seguridad de los usuarios.
            </p>

            <p className="legal-highlight">Transferencias de negocio</p>
            <p>
              Si CallTechCare pasa por una fusión o adquisición, la información de los clientes puede transferirse como parte de la transacción.
            </p>

            <p className="legal-highlight">Con tu consentimiento</p>
            <p>
              Nunca compartiremos tus datos con terceros para marketing sin tu permiso explícito.
            </p>
          </div>

          {/* Cookies */}
          <div className="legal-card">
            <div className="legal-card-header">
              <SvgIcon name="privacy-cookies" size={38} className="legal-card-icon" />
              <h2>Cookies y tecnologías de rastreo</h2>
            </div>

            <p>
              Usamos cookies para mejorar tu experiencia de navegación, analizar el rendimiento y guardar preferencias.
            </p>

            <p className="legal-highlight">Cookies esenciales</p>
            <p>Necesarias para la funcionalidad y seguridad del sitio.</p>

            <p className="legal-highlight">Cookies de analítica</p>
            <p>Nos ayudan a entender cómo los visitantes usan nuestro sitio web.</p>

            <p className="legal-highlight">Cookies de marketing</p>
            <p>Se usan solo con tu consentimiento para personalizar anuncios o contenido.</p>
          </div>

          {/* Children's Privacy */}
          <div className="legal-card">
            <div className="legal-card-header">
              <SvgIcon name="privacy-children" size={38} className="legal-card-icon" />
              <h2>Privacidad de los menores</h2>
            </div>

            <p>
              Nuestros servicios no están dirigidos a personas menores de 18 años. No recopilamos deliberadamente información personal de menores.
            </p>
          </div>

          {/* Changes */}
          <div className="legal-card">
            <div className="legal-card-header">
              <SvgIcon name="privacy-changes" size={38} className="legal-card-icon" />
              <h2>Cambios a esta Política de Privacidad</h2>
            </div>

            <p>
              Podemos actualizar esta Política de Privacidad de vez en cuando para reflejar cambios en nuestras prácticas o requisitos legales.
            </p>
          </div>

          {/* Contact */}
          <div className="legal-card legal-contact-card legal-contact-layout">

            <div className="legal-contact-icon-col">
              <SvgIcon
                name="privacy-questions"
                size={80}
                className="legal-card-icon"
              />
            </div>

            <div className="legal-contact-content-col">
              <h2>¿Preguntas sobre privacidad?</h2>

              <p>
                Si tienes alguna pregunta, inquietud o solicitud relacionada con esta Política de Privacidad o nuestras prácticas de datos, no dudes en contactarnos.
              </p>

              <p><strong>Correo electrónico:</strong> support@calltechcare.com</p>
              <p><strong>Teléfono:</strong> (786) 366-2729</p>
              <p><strong>Correo postal:</strong> Miami, FL</p>

              <Link href="/es/#contact" className="legal-contact-btn">
                Contáctanos
              </Link>
            </div>

          </div>

        </div>
      </section>
    </>
  );
}