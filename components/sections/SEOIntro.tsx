import Link from "next/link";

export default function SEOIntro() {
  return (
    <section className="seo-intro-section">
      <div className="seo-intro">
        <h2 className="seo-intro-title">
          Sprinkler Repair & Irrigation Services in Miami & Broward
        </h2>

        <p>
          CallTechCare is a local service team focused on{" "}
          <Link href="/sprinkler-repair-miami">Sprinkler Repair Miami</Link> and irrigation troubleshooting across Miami-Dade and
          Broward. We help with leaks, broken sprinkler heads, poor coverage, timer/controller issues, and system tune-ups—with clear
          communication and reliable on-site service.
        </p>

        <p>
          After sprinkler repair and irrigation service, we also provide security camera installation and expert tech support—including
          Wi-Fi and internet troubleshooting, computer and printer support, and device setup for homes and small businesses.
        </p>

        <p>
          With same-day availability in many Miami and Broward areas, CallTechCare makes scheduling simple and stress-free.
          Call now for sprinkler repair or request a quote—we’ll confirm details and book the next available visit.
        </p>
      </div>
    </section>
  );
} 