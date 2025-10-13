export default function Pricing() {
  return (
    <section id="pricing" className="section pricing">
      <div className="site-container-pricing">
        <h2 className="pricing-heading">Simple Pricing</h2>
        <p className="pricing-sub">
          Choose the option that fits your needs best.
        </p>

        <div className="pricing-grid">
          <div className="pricing-card">
            <h3 className="plan-title">Remote Help</h3>
            <p className="plan-price">
              $29 <span>/ 30 min</span>
            </p>
            <ul className="plan-features">
              <li>Quick fixes</li>
              <li>Phone or video call</li>
              <li>Step-by-step guidance</li>
            </ul>
            <a href="#contact" className="btn btn-primary wide ">
              Get Remote Help
            </a>
          </div>

          <div className="pricing-card featured">
            <h3 className="plan-title">In-Home Visit</h3>
            <p className="plan-price">
              $89 <span>/ hour</span>
            </p>
            <ul className="plan-features">
              <li>Hands-on tech support</li>
              <li>Wi-Fi, TV, printer setup</li>
              <li>Friendly, patient guidance</li>
            </ul>
            <a href="#contact" className="btn btn-primary wide">
              Book a Visit
            </a>
          </div>

          <div className="pricing-card">
            <h3 className="plan-title">Membership</h3>
            <p className="plan-price">
              $19 <span>/ month</span>
            </p>
            <ul className="plan-features">
              <li>Priority scheduling</li>
              <li>Discounted visits</li>
              <li>Peace of mind</li>
            </ul>
            <a href="#contact" className="btn btn-primary wide">
              Join Today
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
