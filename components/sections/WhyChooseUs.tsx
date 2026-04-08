import { ShieldCheck, Users, Clock, Cpu, Network, Smile } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: <Smile size={32} strokeWidth={1.5} />,
      title: "Patient & Friendly Experts",
      text: "We help homeowners and small businesses with clear explanations and reliable, on-site service—from sprinkler repairs to cameras and tech support.",
    },
    {
      icon: <Clock size={32} strokeWidth={1.5} />,
      title: "Same-Day Availability",
      text: "Most appointments available the same day across Miami, Pembroke Pines, Broward, Miramar, and Homestead.",
    },
    {
      icon: <Network size={32} strokeWidth={1.5} />,
      title: "WiFi, Internet & Smart Setup",
      text: "We troubleshoot slow internet, optimize Wi-Fi, and set up connected systems—including security cameras and smart irrigation controllers.",
    },
    {
      icon: <Cpu size={32} strokeWidth={1.5} />,
      title: "Hands-On Installations",
      text: "From sprinkler repair and irrigation troubleshooting to security cameras and tech setup (Wi-Fi, computers, printers)—we handle the details.",
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
    <section
      className="why-choose"
      role="region"
      aria-labelledby="why-title"
    >
      <div className="site-container">

        <div className="why-header">
          <h2 id="why-title">
            Why Choose <span className="brand">CallTechCare</span> for Sprinkler Repair in Miami & Broward?
          </h2>
          <p>
            Sprinkler repair & irrigation first—with security camera installation and expert tech support available across Miami and Broward.
          </p>
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
