const STEPS = [
  { title: "Call or Book Online", desc: "Tell us what you need help with." },
  { title: "Friendly Tech Visit", desc: "On-site or remote—your choice." },
  { title: "We Set It Up Right", desc: "Simple, secure, and senior-friendly." },
];

export default function HowItWorks() {
  return (
    <section id="how" className="section how">
      <div className="site-container-how">
        <h2 className="how-heading">How It Works</h2>
        <p className="how-sub">
          Simple steps to get the tech support you need.
        </p>

        <div className="how-grid">
          {STEPS.map((s, i) => (
            <div key={s.title} className="how-step">
              <div className="step-number">{i + 1}</div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
