import { ShieldCheck, Users, Clock, Cpu, Network, Smile } from "lucide-react";

export default function WhyChooseUs({ locale = "en" }: { locale?: "en" | "es" }) {
  const isSpanish = locale === "es";
  // Same six cards, same icons, same order in both languages; only the
  // text changes. The Spanish wording is reused from the former Spanish
  // home page (which had dropped the icons; the shared template keeps them).
  const features = isSpanish
    ? [
        {
          icon: <Smile size={32} strokeWidth={1.5} />,
          title: "Expertos Pacientes y Amables",
          text: "Ayudamos a dueños de casas y pequeños negocios con explicaciones claras y servicio confiable a domicilio, desde reparaciones de sprinklers hasta cámaras de seguridad.",
        },
        {
          icon: <Clock size={32} strokeWidth={1.5} />,
          title: "Disponibilidad el Mismo Día",
          text: "La mayoría de las citas están disponibles el mismo día en las 30 áreas de servicio, desde Sunrise hasta Cutler Bay, dentro del horario de servicio.",
        },
        {
          icon: <Network size={32} strokeWidth={1.5} />,
          title: "Instalación de Cámaras de Seguridad",
          text: "Instalamos cámaras de seguridad inalámbricas en los lugares correctos, con la mejor cobertura y ángulos de vista, para casas y pequeños negocios.",
        },
        {
          icon: <Cpu size={32} strokeWidth={1.5} />,
          title: "Instalaciones Hechas en Persona",
          text: "Desde la reparación de sprinklers y la solución de problemas de irrigación hasta la instalación de cámaras de seguridad: nos encargamos de los detalles, en tu propiedad.",
        },
        {
          icon: <Users size={32} strokeWidth={1.5} />,
          title: "La Confianza de Casas y Pequeños Negocios",
          text: "Desde una sola reparación de sprinklers hasta un sistema nuevo completo o una instalación de cámaras, apoyamos a casas, oficinas en casa y pequeños negocios.",
        },
        {
          icon: <ShieldCheck size={32} strokeWidth={1.5} />,
          title: "Estimado Claro, Sin Sorpresas",
          text: "Te damos un estimado claro en sitio antes de empezar el trabajo. Sin cargos ocultos, sin ventas a presión.",
        },
      ]
    : [
        {
          icon: <Smile size={32} strokeWidth={1.5} />,
          title: "Patient & Friendly Experts",
          text: "We help homeowners and small businesses with clear explanations and reliable, on-site service—from sprinkler repairs to security cameras.",
        },
        {
          icon: <Clock size={32} strokeWidth={1.5} />,
          title: "Same-Day Availability",
          text: "Most appointments available the same day across all 30 service areas, from Sunrise to Cutler Bay.",
        },
        {
          icon: <Network size={32} strokeWidth={1.5} />,
          title: "Security Camera Installation",
          text: "We install wireless security cameras in the right spots, with the best coverage and viewing angles, for homes and small businesses.",
        },
        {
          icon: <Cpu size={32} strokeWidth={1.5} />,
          title: "Hands-On Installations",
          text: "From sprinkler repair and irrigation troubleshooting to security camera installation—we handle the details.",
        },
        {
          icon: <Users size={32} strokeWidth={1.5} />,
          title: "Trusted by Homes & Small Businesses",
          text: "From a single sprinkler repair to a full new system or a camera setup, we support homes, home offices, and small businesses.",
        },
        {
          icon: <ShieldCheck size={32} strokeWidth={1.5} />,
          title: "Transparent Pricing — No Surprises",
          text: "Clear, upfront pricing. No hidden fees. No upselling. No pressure.",
        },
      ];

  return (
    <section
      className="why-choose"
      role="region"
      aria-labelledby="why-title"
    >
      <div className="site-container">

        <div className="why-header">
          <h2 id="why-title">
            {isSpanish ? (
              <>
                ¿Por qué Elegir <span className="brand">CallTechCare</span> para Reparación de Sprinklers en Miami y Broward?
              </>
            ) : (
              <>
                Why Choose <span className="brand">CallTechCare</span> for Sprinkler Repair in Miami & Broward?
              </>
            )}
          </h2>
          <p>
            {isSpanish
              ? "Reparación de sprinklers e irrigación primero, con instalación de cámaras de seguridad disponible en Miami y Broward."
              : "Sprinkler repair & irrigation first—with security camera installation available across Miami and Broward."}
          </p>
        </div>

        <div className="why-grid">
          {features.map((f, i) => (
            <div key={i} className="why-card">
              <div className="why-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
