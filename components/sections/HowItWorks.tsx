import { sanity } from "@/lib/sanity";

export const revalidate = 60;

export default async function HowItWorks() {
  const steps = await sanity.fetch(`
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
        <h2 className="how-heading">How It Works</h2>
        <p className="how-sub">
          Simple steps to get the tech support you need.
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
