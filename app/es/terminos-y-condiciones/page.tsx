import { Metadata } from "next";
import Link from "next/link";
import SvgIcon from "@/components/common/SvgIcons";

export const metadata: Metadata = {
  title: "Términos del Servicio | CallTechCare",

  description:
        "Lee los Términos del Servicio de CallTechCare, que describen las políticas, pagos, garantías y responsabilidades de los servicios en Miami y Broward, incluyendo reparación de sprinklers e irrigación e instalación de cámaras de seguridad.",

  alternates: {
    canonical: "https://www.calltechcare.com/es/terminos-y-condiciones",
    languages: { es: "https://www.calltechcare.com/es/terminos-y-condiciones", en: "https://www.calltechcare.com/terms-and-conditions" },
  },

  openGraph: {
    title: "Términos del Servicio | CallTechCare",
    description:
      "Entiende los Términos del Servicio de CallTechCare que cubren citas de servicio, pagos, garantías y responsabilidades del usuario.",
    url: "https://www.calltechcare.com/es/terminos-y-condiciones",
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

export default function TermsAndConditionsPageEs() {
    const termsSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Términos del Servicio",
        url: "https://www.calltechcare.com/es/terminos-y-condiciones",
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
                    __html: JSON.stringify(termsSchema),
                }}
            />
            
            <section className="legal-wrapper terms-wrapper">
                <div className="terms-hero">
                    <div className="terms-inner terms-hero-inner">
                        <Link href="/es/" className="legal-back terms-back">
                            <SvgIcon name="chevron-left" size={18} color="var(--brand-teal)" />
                            Volver a la página principal
                        </Link>

                        <div className="terms-hero-titleRow">
                            <SvgIcon name="document" size={34} className="terms-hero-icon" />
                            <div className="terms-hero-titleCol">
                                <h1 className="terms-hero-title">Términos del Servicio</h1>
                                <p className="terms-hero-updated">Última actualización: 2 de febrero de 2026</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="terms-bodySection">
                    <div className="terms-inner terms-body">
                        <div className="legal-card">
                            <p>
                                Bienvenido a <strong>CallTechCare</strong>. Al acceder o usar nuestro sitio web o servicios, aceptas estar sujeto a estos Términos del Servicio. Por favor, léelos cuidadosamente antes de usar nuestra plataforma.
                            </p>
                        </div>

                        <div className="terms-steps">
                            <div className="terms-step">
                                <div className="terms-step-header">
                                    <span className="terms-step-badge">1</span>
                                    <h2>Aceptación de los Términos</h2>
                                </div>
                                <p>
                                    Al acceder y usar los servicios de CallTechCare, reconoces que has leído, entendido y aceptas estar sujeto a estos Términos del Servicio y a nuestra Política de Privacidad.
                                </p>
                                <p>Si no aceptas estos términos, por favor no uses nuestros servicios.</p>
                            </div>

                            <div className="terms-step">
                                <div className="terms-step-header">
                                    <span className="terms-step-badge">2</span>
                                    <h2>Descripción de los Servicios</h2>
                                </div>
                                <p>
                                    CallTechCare presta servicios a domicilio en Miami-Dade y Broward, incluyendo (sin limitarse a):
                                </p>
                                <ul>
                                    <li>Servicio de reparación de sprinklers e irrigación (reparaciones e instalaciones)</li>
                                    <li>Instalación y configuración de cámaras de seguridad</li>
                                </ul>
                            </div>

                            <div className="terms-step">
                                <div className="terms-step-header">
                                    <span className="terms-step-badge">3</span>
                                    <h2>Citas de Servicio</h2>
                                </div>

                                <p className="legal-highlight">Programación</p>
                                <p>
                                    Las citas de servicio pueden programarse a través de nuestro sitio web. La confirmación se proporcionará por correo electrónico.
                                </p>

                                <p className="legal-highlight">Cancelaciones</p>
                                <p>
                                    Puedes cancelar o reprogramar una cita hasta 24 horas antes de la hora programada, sin penalización.
                                </p>

                                <p className="legal-highlight">Inasistencias (No-shows)</p>
                                <p>
                                    Si no estás disponible a la hora programada, puede aplicar un cargo por reprogramación.
                                </p>
                            </div>

                            <div className="terms-step">
                                <div className="terms-step-header">
                                    <span className="terms-step-badge">4</span>
                                    <h2>Precios y Pagos</h2>
                                </div>

                                <p>
                                    El precio final se confirma antes de que comience el trabajo.
                                </p>
                                <p>
                                    Los pagos se realizan en persona al final de la cita, en efectivo, con tarjeta o por Zelle. No hay pago en línea.
                                </p>

                                <p className="legal-highlight">Cargos adicionales pueden aplicar por:</p>
                                <ul>
                                    <li>Partes y materiales (cotizados por separado)</li>
                                    <li>Servicio fuera de horario o de emergencia</li>
                                    <li>Viaje más allá de las áreas de servicio estándar</li>
                                </ul>
                            </div>

                            <div className="terms-step">
                                <div className="terms-step-header">
                                    <span className="terms-step-badge">5</span>
                                    <h2>Garantía y Garantías</h2>
                                </div>

                                <div className="terms-callout">
                                    <p className="terms-callout-title">Garantía de mano de obra de 1 año</p>
                                    <p className="terms-callout-text">
                                        Todos los servicios incluyen una garantía de 1 año que cubre problemas de mano de obra cuando CallTechCare hace el trabajo y provee los materiales.
                                        Si un problema está relacionado con nuestro trabajo dentro de este periodo, regresaremos a corregirlo sin cargo adicional.
                                    </p>
                                </div>
                            </div>

                            <div className="terms-step">
                                <div className="terms-step-header">
                                    <span className="terms-step-badge">6</span>
                                    <h2>Limitación de Responsabilidad</h2>
                                </div>
                                <p>CallTechCare no es responsable por:</p>
                                <ul>
                                    <li>Daño preexistente a equipos o propiedad</li>
                                    <li>Daño causado por mal uso del cliente después de completar el servicio</li>
                                    <li>Defectos o fallas de equipos de terceros</li>
                                </ul>
                                <p>
                                    Nuestra responsabilidad total no excederá el monto pagado por el servicio específico en cuestión.
                                </p>
                            </div>

                            <div className="terms-step">
                                <div className="terms-step-header">
                                    <span className="terms-step-badge">7</span>
                                    <h2>Responsabilidades del Usuario</h2>
                                </div>
                                <p>Aceptas:</p>
                                <ul>
                                    <li>Proporcionar información precisa al reservar servicios</li>
                                    <li>Garantizar acceso seguro al lugar del servicio</li>
                                    <li>Estar presente, o que esté presente un adulto autorizado, durante las citas</li>
                                    <li>Informar a los técnicos sobre inquietudes o peligros de seguridad</li>
                                </ul>
                            </div>

                            <div className="terms-step">
                                <div className="terms-step-header">
                                    <span className="terms-step-badge">8</span>
                                    <h2>Cambios a los Términos</h2>
                                </div>
                                <p>
                                    Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios se publicarán en esta página con una fecha de revisión actualizada. El uso continuado de nuestros servicios después de los cambios constituye la aceptación de los términos actualizados.
                                </p>
                            </div>
                        </div>

                        <div className="legal-card legal-contact-card legal-contact-layout">
                            <div className="legal-contact-icon-col">
                                <SvgIcon name="mail" size={64} className="legal-card-icon" />
                            </div>
                            <div className="legal-contact-content-col">
                                <h2>¿Preguntas sobre estos Términos?</h2>
                                <p>
                                    Si tienes alguna pregunta sobre estos Términos del Servicio, por favor contáctanos:
                                </p>
                                <p >
                                    <strong >Correo electrónico:</strong>{" "}
                                    <a href="mailto:support@calltechcare.com" className="terms-contact-item-email">support@calltechcare.com</a>
                                </p>
                                <p >
                                    <strong>Teléfono:</strong> 
                                    <a href="tel:+17863662729" className="terms-contact-item-phone"> (786) 366-2729</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
