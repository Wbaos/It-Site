import { ShieldCheck, Users, Clock, Cpu, Network, Smile } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: <Smile size={32} strokeWidth={1.5} />,
      title: "Patient & Friendly Experts",
      text: "We help homeowners and small businesses with clear explanations and reliable, on-site service—from sprinkler repairs to security cameras.",
    },
    {
      icon: <Clock size={32} strokeWidth={1.5} />,
      title: "Same-Day Availability",
      text: "Most appointments available the same day across all 30 service areas, from Sunrise to Cutler Bay.",
    },
    {
      icon: <Network size={32} strokeWidth={1.5} />,
      title: "Security Camera Installation",
      text: "We install wireless security cameras in the right spots, with the best coverage and viewing angles, for homes and small businesses.",
    },
    {
      icon: <Cpu size={32} strokeWidth={1.5} />,
      title: "Hands-On Installations",
      text: "From sprinkler repair and irrigation troubleshooting to security camera installation—we handle the details.",
    },
    {
      icon: <Users size={32} strokeWidth={1.5} />,
      title: "Trusted by Homes & Small Businesses",
      text: "From a single sprinkler repair to a full new system or a camera setup, we support homes, home offices, and small businesses.",
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
            Sprinkler repair & irrigation first—with security camera installation available across Miami and Broward.
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
