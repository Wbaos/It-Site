import Link from "next/link";

export default function SEOIntro({ locale = "en" }: { locale?: "en" | "es" }) {
  if (locale === "es") {
    return (
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
            Con disponibilidad el mismo día en muchas áreas de Miami y Broward, CallTechCare hace que agendar sea
            simple y sin estrés. Llama ahora para reparación de sprinklers o solicita una cotización: confirmamos
            los detalles y reservamos la próxima visita disponible.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="seo-intro-section">
      <div className="seo-intro">
        <h2 className="seo-intro-title">
          Sprinkler Repair & Irrigation Services in Miami & Broward
        </h2>

        <p>
          CallTechCare is a local service team focused on{" "}
          <Link href="/sprinkler-repair-miami">Sprinkler Repair Miami</Link> and irrigation troubleshooting across Miami-Dade and
          Broward. We help with leaks, broken sprinkler heads, poor coverage, timer/controller issues, and system tune-ups—with clear
          communication and reliable on-site service.
        </p>

        <p>
          After sprinkler repair and irrigation service, we also provide security camera installation  for homes and small businesses.
        </p>

        <p>
          With same-day availability in many Miami and Broward areas, CallTechCare makes scheduling simple and stress-free.
          Call now for sprinkler repair or request a quote—we’ll confirm details and book the next available visit.
        </p>
      </div>
    </section>
  );
}
