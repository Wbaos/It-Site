import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sobre CallTechCare | Reparación de Sprinklers en Miami y Broward",
  description: "Conoce a CallTechCare, la empresa de reparación de sprinklers e irrigación de Miami y Broward. Servicio el mismo día, estimados gratis y garantía de 1 año en nuestro trabajo.",
  alternates: {
    canonical: "https://www.calltechcare.com/es/sobre-nosotros",
    languages: {
      es: "https://www.calltechcare.com/es/sobre-nosotros",
      en: "https://www.calltechcare.com/about",
    },
  },
};

export default function AboutPageEs() {
  return (
    <main className="about-page-container">
      <div className="about-page">
        <section className="about-hero">
          <h1 className="about-title">Sobre CallTechCare</h1>
          <p className="about-subtitle">
            Servicios de Reparación de Sprinklers e Irrigación en Miami y Broward
          </p>
        </section>
        <section className="about-section">
          <h2 className="about-heading">Nuestra Misión</h2>
          <p className="about-text">
            En CallTechCare, nuestra misión es hacer que el servicio sea simple, seguro y accesible para propietarios de viviendas y pequeños negocios.
            Nuestro enfoque principal es <Link href="/es/reparacion-de-sprinklers-miami">la reparación de sprinklers y la solución de problemas de irrigación en Miami y Broward</Link>.
            También prestamos instalación de cámaras de seguridad cuando necesitas ayuda más allá de la irrigación.
          </p>
        </section>
        <section className="about-section">
          <h2 className="about-heading">Nuestra Historia</h2>
          <p className="about-text">
            Comenzamos CallTechCare después de ver cuántos propietarios tenían dificultad para encontrar ayuda confiable para sus sistemas de sprinklers y cámaras.
            Ya sea un sistema de sprinklers que no funciona, una fuga en el jardín o cámaras que necesitan colocación, estamos aquí para ayudar con honestidad y paciencia.
          </p>
          <p className="about-text">
            A medida que nuestros clientes siguieron confiando en nosotros, nos enfocamos en lo que mejor hacemos: reparación de sprinklers e irrigación, además de instalación de cámaras de seguridad.
            Con sede en Miami, servimos con orgullo a propietarios en Miami-Dade y Broward, incluyendo Miami, Miramar, Pembroke Pines, Hollywood y Fort Lauderdale.
          </p>
        </section>
        <section className="about-values">
          <h2 className="about-heading">Nuestros Valores</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>🧑‍🤝‍🧑 Compasión</h3>
              <p>Tratamos a cada cliente como familia, con paciencia, respeto y empatía.</p>
            </div>
            <div className="value-card">
              <h3>⚙️ Confiabilidad</h3>
              <p>Llegamos a tiempo, resolvemos problemas de forma eficiente y respaldamos nuestro trabajo.</p>
            </div>
            <div className="value-card">
              <h3>🔒 Confianza</h3>
              <p>Tu privacidad y seguridad importan. Manejamos cada dispositivo con cuidado y discreción.</p>
            </div>
          </div>
        </section>
        <section className="about-cta">
          <h2>¿Necesitas ayuda hoy?</h2>
          <p>
            Reserva una visita de servicio de confianza para reparación de sprinklers y solución de problemas de irrigación en Miami y Broward.
            También prestamos instalación de cámaras de seguridad.
            Si buscas <Link href="/es/reparacion-de-sprinklers-miami">Reparación de Sprinklers en Miami</Link>, comienza aquí.
          </p>
          <Link href="/es/solicita-una-cotizacion" className="about-button">
            Reserva un servicio
          </Link>
        </section>
      </div>
    </main>
  );
}
