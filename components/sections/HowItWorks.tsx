import { sanity } from "@/lib/sanity";

export const revalidate = 60;

// Spanish steps reused from the former Spanish home page. The English
// steps still come from Sanity; Sanity is not touched by this refactor.
const STEPS_ES = [
  {
    _id: "es-1",
    title: "Llámanos o Pide una Cotización",
    desc: "Cuéntanos qué pasa con tu sistema: fugas, cabezales rotos, una zona que no enciende o un sistema nuevo.",
  },
  {
    _id: "es-2",
    title: "Visitamos a Domicilio",
    desc: "Agendamos tu visita y llegamos a tu propiedad para revisar el sistema completo.",
  },
  {
    _id: "es-3",
    title: "Diagnosticamos y Reparamos en Sitio",
    desc: "Encontramos la causa del problema y lo reparamos en el lugar, con un estimado claro antes de empezar.",
  },
  {
    _id: "es-4",
    title: "Dejamos Todo Funcionando",
    desc: "Probamos el sistema zona por zona para que quede regando como debe.",
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
      </div>
    </section>
  );
}
