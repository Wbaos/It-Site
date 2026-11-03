import type { Metadata } from "next";
import Link from "next/link";
import SvgIcon from "@/components/common/SvgIcons";

export const metadata: Metadata = {
    title: "Declaración de Accesibilidad – CallTechCare",
    description:
    "Declaración de Accesibilidad de CallTechCare: Conoce nuestros esfuerzos continuos para garantizar la accesibilidad digital de todos los usuarios que visitan nuestro sitio para servicios de reparación de sprinklers e irrigación y cámaras de seguridad en Miami y Broward.",
    alternates: {
        canonical: "https://www.calltechcare.com/es/accesibilidad",
        languages: { es: "https://www.calltechcare.com/es/accesibilidad", en: "https://www.calltechcare.com/accessibility" },
    },
};

export default function AccessibilityPageEs() {
    return (
        <section className="legal-wrapper">
            <div className="legal-container">
                <Link href="/es/" className="legal-back">
                    <SvgIcon name="chevron-left" size={18} color="var(--brand-teal)" />
                    Volver a la página principal
                </Link>

                <div className="legal-header">
                    <SvgIcon
                        name="document"
                        size={76}
                        color="var(--brand-teal)"
                        className="legal-header-icon"
                    />

                    <h1>Declaración de Accesibilidad</h1>
                    <p className="legal-updated">Última actualización: 2 de febrero de 2026</p>

                    <p className="legal-intro">
                        En <strong>CallTechCare</strong>, estamos comprometidos con hacer que nuestro sitio web y servicios digitales sean accesibles para la mayor cantidad de personas posible, incluyendo usuarios con discapacidades.
                    </p>
                </div>

                <div className="legal-card">
                    <div className="legal-card-header">
                        <SvgIcon name="checkmark-circle" size={38} className="legal-card-icon" />
                        <h2>Nuestro Compromiso</h2>
                    </div>
                    <p>
                        Nuestro objetivo es cumplir o superar las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.1 Nivel AA y mejorar continuamente la usabilidad para todos los visitantes.
                    </p>
                    <p>
                        La accesibilidad es un esfuerzo continuo. Revisamos periódicamente nuestro sitio y actualizamos el contenido y la funcionalidad para reducir barreras.
                    </p>
                </div>

                <div className="legal-card">
                    <div className="legal-card-header">
                        <SvgIcon name="laptop" size={38} className="legal-card-icon" />
                        <h2>Funciones de Accesibilidad y Mejores Prácticas</h2>
                    </div>
                    <p className="legal-highlight">Trabajamos para apoyar:</p>
                    <ul>
                        <li>Navegación por teclado para las interacciones clave del sitio</li>
                        <li>Encabezados claros y estructura de contenido legible</li>
                        <li>Estilo de alto contraste y tipografía legible</li>
                        <li>Texto de enlace y etiquetas con significado</li>
                        <li>Diseños responsivos para dispositivos móviles y tabletas</li>
                    </ul>
                </div>

                <div className="legal-card">
                    <div className="legal-card-header">
                        <SvgIcon name="shield" size={38} className="legal-card-icon" />
                        <h2>Compatibilidad</h2>
                    </div>
                    <p>
                        Nos esforzamos por garantizar la compatibilidad con navegadores modernos y tecnologías de asistencia, incluyendo lectores de pantalla y ampliadores de pantalla.
                    </p>
                    <p className="legal-highlight">Configuración recomendada:</p>
                    <ul>
                        <li>La versión más reciente de Chrome, Edge, Firefox o Safari</li>
                        <li>Funciones de accesibilidad integradas del sistema operativo (Zoom, VoiceOver, Narrator)</li>
                        <li>Software de tecnología de asistencia actualizado, cuando esté disponible</li>
                    </ul>
                </div>

                <div className="legal-card">
                    <div className="legal-card-header">
                        <SvgIcon name="clipboard" size={38} className="legal-card-icon" />
                        <h2>Limitaciones Conocidas</h2>
                    </div>
                    <p>
                        Aunque trabajamos arduamente para mantener una experiencia accesible, es posible que algunos contenidos aún no cumplan totalmente con WCAG 2.1 AA, especialmente en funciones recién lanzadas o componentes integrados de terceros.
                    </p>
                    <p>
                        Si encuentras alguna barrera de accesibilidad, por favor avísanos y priorizaremos una corrección.
                    </p>
                </div>

                <div className="legal-card">
                    <div className="legal-card-header">
                        <SvgIcon name="paper-plane" size={38} className="legal-card-icon" />
                        <h2>Comentarios y Asistencia</h2>
                    </div>
                    <p>
                        Si tienes dificultad para acceder a cualquier parte de nuestro sitio web, podemos ayudarte. Por favor, comunícate con nosotros e incluye:
                    </p>
                    <ul>
                        <li>La URL de la página donde experimentaste el problema</li>
                        <li>Lo que estabas intentando hacer</li>
                        <li>Tu navegador/dispositivo y cualquier tecnología de asistencia que uses</li>
                    </ul>
                    <p>
                        Envíanos un correo a <a href="mailto:support@calltechcare.com">support@calltechcare.com</a>
                        {" "}o llama al <a href="tel:+17863662729">(786) 366-2729</a>.
                    </p>
                </div>

                <div className="legal-card legal-contact-card">
                    <div className="legal-card-header">
                        <SvgIcon name="alert-circle" size={22} className="legal-card-icon" />
                        <h2>Inquietudes Formales</h2>
                    </div>
                    <p>
                        Si crees que no estamos cumpliendo con los requisitos de accesibilidad, por favor contáctanos directamente para que podamos atender tu inquietud con prontitud.
                    </p>
                </div>
            </div>
        </section>
    );
}
