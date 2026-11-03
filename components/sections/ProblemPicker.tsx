import Link from "next/link";

type Item = { emoji: string; title: string; desc: string; href: string };

export default function ProblemPicker({ locale = "en" }: { locale?: "en" | "es" }) {
  const isSpanish = locale === "es";
  const items: Item[] = isSpanish
    ? [
        { emoji: "💧", title: "Hay una fuga o charco", desc: "Agua acumulada, presión baja o tubería rota.", href: "/es/reparacion-de-fugas-de-sprinklers" },
        { emoji: "🔧", title: "Una zona no prende o no apaga", desc: "Válvula atascada, zona que se queda prendida.", href: "/es/reparacion-de-valvulas-de-sprinklers" },
        { emoji: "💦", title: "Poca presión o bomba fallando", desc: "Chorros débiles, bomba que no arranca.", href: "/es/reemplazo-de-bombas-de-sprinklers" },
        { emoji: "⏱️", title: "El temporizador no funciona", desc: "Controlador viejo, horarios mal puestos.", href: "/es/instalacion-de-temporizadores-de-sprinklers" },
        { emoji: "🌱", title: "Quiero un sistema nuevo", desc: "Zonas nuevas, cobertura completa desde cero.", href: "/es/instalacion-nueva-de-irrigacion" },
        { emoji: "📹", title: "Quiero cámaras de seguridad", desc: "Colocación, cableado y configuración.", href: "/es/instalacion-de-camaras-inalambricas" },
      ]
    : [
        { emoji: "💧", title: "Leaking or pooling water", desc: "Water pooling, low pressure, or a broken pipe.", href: "/services/sprinkler-leak-repair" },
        { emoji: "🔧", title: "A zone won't turn on or off", desc: "Stuck valve, a zone that stays on.", href: "/services/sprinkler-valve-repair" },
        { emoji: "💦", title: "Low pressure or pump failure", desc: "Weak spray, a pump that won't start.", href: "/services/sprinkler-pump-replacement" },
        { emoji: "⏱️", title: "Timer or controller not working", desc: "Old controller, wrong schedules.", href: "/services/sprinkler-timer-installation" },
        { emoji: "🌱", title: "I need a new system", desc: "New zones, full coverage from scratch.", href: "/services/new-irrigation-installation" },
        { emoji: "📹", title: "I want security cameras", desc: "Placement, wiring, and setup.", href: "/services/wireless-camera-installation" },
      ];
  return (
    <section className="section problem-picker">
      <div className="site-container">
        <h2 className="problem-picker-heading">
          {isSpanish ? "¿Qué le pasa a tu sistema?" : "What's wrong with your system?"}
        </h2>
        <p className="problem-picker-sub">
          {isSpanish
            ? "Toca tu problema y te llevamos directo al servicio que lo arregla."
            : "Tap your problem and we'll take you straight to the service that fixes it."}
        </p>
        <div className="problem-picker-grid">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="problem-picker-card">
              <span className="problem-picker-emoji">{item.emoji}</span>
              <span className="problem-picker-title">{item.title}</span>
              <span className="problem-picker-desc">{item.desc}</span>
              <span className="problem-picker-cta">{isSpanish ? "Ver servicio →" : "See service →"}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
