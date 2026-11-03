import Image from "next/image";
import { ShieldCheck, Users, Clock, Cpu, Network, Smile } from "lucide-react";

export default function WhyChooseUs({ locale = "en" }: { locale?: "en" | "es" }) {
  const isSpanish = locale === "es";
  // Same six cards, same icons, same order in both languages; only the
  // text changes. The Spanish wording is a faithful translation of the
  // English wording.
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
          text: "La mayoría de las citas están disponibles el mismo día dentro del horario en las 30 áreas de servicio, desde Sunrise hasta Cutler Bay.",
        },
        {
          icon: <Network size={32} strokeWidth={1.5} />,
          title: "Instalación de Cámaras de Seguridad",
          text: "Instalamos cámaras de seguridad inalámbricas en los lugares correctos, con la mejor cobertura y ángulos de vista, para casas y pequeños negocios.",
        },
        {
          icon: <Cpu size={32} strokeWidth={1.5} />,
          title: "Instalaciones Hechas en Persona",
          text: "Desde la reparación de sprinklers y la solución de problemas de irrigación hasta la instalación de cámaras de seguridad: nos encargamos de los detalles.",
        },
        {
          icon: <Users size={32} strokeWidth={1.5} />,
          title: "La Confianza de Casas y Pequeños Negocios",
          text: "Desde una sola reparación de sprinklers hasta un sistema nuevo completo o una instalación de cámaras, apoyamos a casas, oficinas en casa y pequeños negocios.",
        },
        {
          icon: <ShieldCheck size={32} strokeWidth={1.5} />,
          title: "Precios Transparentes — Sin Sorpresas",
          text: "Estimados claros tras la inspección. Sin cargos ocultos. Sin ventas adicionales. Sin presión.",
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
          text: "Most appointments available the same day within business hours across all 30 service areas, from Sunrise to Cutler Bay.",
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
          text: "Clear estimates after inspection. No hidden fees. No upselling. No pressure.",
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

        <div className="why-photo">
          <Image
            src="https://cdn.sanity.io/images/celkrwoq/production/3d495269e52ed93bb03e5191f5fd5c2082be1bcd-1024x768.jpg"
            alt={isSpanish ? "Sprinklers regando un patio amplio con adoquines" : "Sprinklers watering a large yard with brick pavers"}
            width={1100}
            height={420}
            loading="lazy"
          />
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
