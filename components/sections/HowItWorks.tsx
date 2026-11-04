import Image from "next/image";
import { sanity } from "@/lib/sanity";

export const revalidate = 60;

// Spanish steps are a faithful translation of the English steps (which
// come from Sanity); Sanity is not touched by this change. Same count,
// same order, only the text changes.
const STEPS_ES = [
  {
    _id: "es-1",
    title: "Llámanos o Reserva en Línea",
    desc: "Cuéntanos con qué necesitas ayuda.",
  },
  {
    _id: "es-2",
    title: "Visita Amable a Domicilio",
    desc: "Venimos a tu casa — siempre a domicilio.",
  },
  {
    _id: "es-3",
    title: "Lo Dejamos Bien Instalado",
    desc: "Inspeccionamos, te damos un estimado claro y hacemos el trabajo bien, con nuestra garantía de 1 año cuando hacemos el trabajo y proveemos los materiales.",
  },
];

export default async function HowItWorks({ locale = "en" }: { locale?: "en" | "es" }) {
  const isSpanish = locale === "es";
  const steps: { _id: string; title: string; desc: string }[] = isSpanish
    ? STEPS_ES
    : await sanity.fetch(`
    *[_type == "howItWorks"] | order(order asc) {
      _id,
      title,
      desc,
      order
    }
  `);

  return (
    <section id="how" className="section how">
      <div className="site-container-how">
        <h2 className="how-heading">{isSpanish ? "Cómo Funciona" : "How It Works"}</h2>
        <p className="how-sub">
          {isSpanish
            ? "Pasos simples para recibir la ayuda que necesitas con tus sprinklers o cámaras."
            : "Simple steps to get the sprinkler or camera help you need."}
        </p>

        <div className="how-grid">
          {steps.map((s: any, i: number) => (
            <div key={s._id} className="how-step">
              <div className="step-number">{i + 1}</div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>

              {i < steps.length - 1 && (
                <div className="connector">
                  <svg
                    viewBox="0 0 200 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0,30 C70,10 130,10 200,30"
                      stroke="#93c5fd"
                      strokeWidth="2"
                      fill="transparent"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="how-photo">
          <Image
            src="https://cdn.sanity.io/images/celkrwoq/production/567373c542b5a2eb837d5b644626350e97c4dd49-1600x1200.jpg"
            alt={isSpanish ? "Camión de CallTechCare en el trabajo" : "CallTechCare truck on site"}
            width={1100}
            height={420}
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
