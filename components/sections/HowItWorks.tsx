import { sanity } from "@/lib/sanity";

export const revalidate = 3600;

export default async function HowItWorks({ locale = "en" }: { locale?: "en" | "es" }) {
  const isSpanish = locale === "es";
  const rawSteps: { _id: string; title: string; titleEs?: string; desc: string; descEs?: string }[] =
    await sanity.fetch(`
    *[_type == "howItWorks"] | order(order asc) {
      _id,
      title,
      titleEs,
      desc,
      descEs,
      order
    }
  `);
  const steps: { _id: string; title: string; desc: string }[] = rawSteps.map((s) => ({
    _id: s._id,
    title: isSpanish ? s.titleEs || s.title : s.title,
    desc: isSpanish ? s.descEs || s.desc : s.desc,
  }));

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
          <img
            src="https://cdn.sanity.io/images/celkrwoq/production/456b56708953810835decb8cf25689fe8aa3677f-800x600.webp?w=800&auto=format&q=80"
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
