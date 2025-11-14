import { ShieldCheck, Users, Clock, Cpu, Network, Smile } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: <Smile size={32} strokeWidth={1.5} />,
      title: "Patient & Friendly Experts",
      text: "We help seniors, families, home offices, and small business owners with clear explanations and no tech jargon.",
    },
    {
      icon: <Clock size={32} strokeWidth={1.5} />,
      title: "Same-Day Availability",
      text: "Most appointments available the same day across Miami, Pembroke Pines, Broward, Miramar, and Homestead.",
    },
    {
      icon: <Network size={32} strokeWidth={1.5} />,
      title: "WiFi & Network Specialists",
      text: "We diagnose slow internet, optimize router placement, and upgrade home or office networks for maximum speed.",
    },
    {
      icon: <Cpu size={32} strokeWidth={1.5} />,
      title: "Smart-Home & Device Setup",
      text: "From smart TVs to cameras, computers, phones, routers, printers, and more — we set it all up for you.",
    },
    {
      icon: <Users size={32} strokeWidth={1.5} />,
      title: "Trusted by Homes & Small Businesses",
      text: "From single-device help to full office setups, we support homes, seniors, home offices, and small businesses.",
    },
    {
      icon: <ShieldCheck size={32} strokeWidth={1.5} />,
      title: "Transparent Pricing — No Surprises",
      text: "Clear, upfront pricing. No hidden fees. No upselling. No pressure.",
    },
  ];

  return (
    <section className="why-choose">
      <div className="site-container">

        <div className="why-header">
          <h2>Why Choose <span className="brand">CallTechCare</span>?</h2>
          <p>Your trusted tech experts serving Miami, Pembroke Pines, Broward & Homestead.</p>
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
