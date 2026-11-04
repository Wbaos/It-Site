import { ShieldCheck, Users, Clock, Cpu, Star, Smile } from "lucide-react";

export default function WhyChooseUs({ locale = "en" }: { locale?: "en" | "es" }) {
  const isSpanish = locale === "es";
  // Same six cards, same icons, same order in both languages; only the
  // text changes. The Spanish wording is a faithful translation of the
  // English wording.
  const features = isSpanish
    ? [
        {
          icon: <ShieldCheck size={32} strokeWidth={1.5} />,
          title: "Garantía de 1 Año",
          text: "Garantía de 1 año cuando CallTechCare hace el trabajo y provee los materiales.",
        },
        {
          icon: <Star size={32} strokeWidth={1.5} />,
          title: "5.0 en Google",
          text: "Calificación 5.0 con 26 reseñas en Google, de clientes reales.",
        },
        {
          icon: <Users size={32} strokeWidth={1.5} />,
          title: "Más de 1500 Clientes Ayudados",
          text: "Más de 1500 clientes felices en Miami y Broward.",
        },
        {
          icon: <Smile size={32} strokeWidth={1.5} />,
          title: "Inspección Gratis, Estimado Claro",
          text: "Inspección gratis. Estimado claro después de inspeccionar. Sin cargos ocultos. Sin ventas adicionales. Sin presión.",
        },
        {
          icon: <Clock size={32} strokeWidth={1.5} />,
          title: "Respuesta en 24 Horas",
          text: "Respondemos dentro de 24 horas, con servicio el mismo día dentro del horario.",
        },
        {
          icon: <Cpu size={32} strokeWidth={1.5} />,
          title: "Servicio en Persona, en Tu Casa",
          text: "Trabajo a domicilio, en persona, en tu casa o negocio. Nada remoto.",
        },
      ]
    : [
        {
          icon: <ShieldCheck size={32} strokeWidth={1.5} />,
          title: "1-Year Warranty",
          text: "1-year warranty when CallTechCare performs the work and provides the materials.",
        },
        {
          icon: <Star size={32} strokeWidth={1.5} />,
          title: "5.0 on Google",
          text: "5.0 rating from 26 Google reviews, from real customers.",
        },
        {
          icon: <Users size={32} strokeWidth={1.5} />,
          title: "1500+ Customers Helped",
          text: "More than 1500 happy customers across Miami and Broward.",
        },
        {
          icon: <Smile size={32} strokeWidth={1.5} />,
          title: "Free Inspection, Clear Estimate",
          text: "Free inspection. Clear estimates after inspection. No hidden fees. No upselling. No pressure.",
        },
        {
          icon: <Clock size={32} strokeWidth={1.5} />,
          title: "Response Within 24 Hours",
          text: "We respond within 24 hours, with same-day service within business hours.",
        },
        {
          icon: <Cpu size={32} strokeWidth={1.5} />,
          title: "In-Person Service, At Your Home",
          text: "On-site work, in person, at your home or business. Nothing remote.",
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
          <img
            src="https://cdn.sanity.io/images/celkrwoq/production/3d495269e52ed93bb03e5191f5fd5c2082be1bcd-1024x768.jpg?w=800&fm=webp&q=80"
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
