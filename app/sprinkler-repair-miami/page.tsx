import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/sections/Hero";

const SPRINKLER_SERVICE_DETAILS_HREF = "/services/sprinkler-repair-and-installation";

function SprinklerIllustration() {
  return (
    <svg
      viewBox="0 0 96 96"
      role="img"
      aria-label="Sprinkler head illustration"
      className="spr-illus"
      fill="none"
    >
      <path
        d="M18 66c10-8 50-8 60 0"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M26 62V40c0-8 7-14 22-14s22 6 22 14v22"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M34 66v8c0 4 3 8 14 8s14-4 14-8v-8"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M30 34l-8-6M40 30l-6-10M56 30l6-10M66 34l8-6"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M20 48c8 2 16 2 24 0M52 48c8 2 16 2 24 0"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

function ControllerIllustration() {
  return (
    <svg
      viewBox="0 0 96 96"
      role="img"
      aria-label="Irrigation controller illustration"
      className="spr-illus"
      fill="none"
    >
      <path
        d="M26 18h44a6 6 0 0 1 6 6v48a6 6 0 0 1-6 6H26a6 6 0 0 1-6-6V24a6 6 0 0 1 6-6Z"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M30 30h36"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M30 40h22"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M30 52h36"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M30 62h18"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M64 38a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        stroke="currentColor"
        strokeWidth="3"
      />
    </svg>
  );
}

function LeakIllustration() {
  return (
    <svg
      viewBox="0 0 96 96"
      role="img"
      aria-label="Sprinkler leak illustration"
      className="spr-illus"
      fill="none"
    >
      <path
        d="M18 56h44c10 0 16-6 16-16V28"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M34 56v10c0 8 6 14 14 14h10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M70 30c-3 5-6 8-10 12"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        d="M74 44c0 6-8 10-8 16 0 4 3 8 8 8s8-4 8-8c0-6-8-10-8-16Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const metadata: Metadata = {
  title: "Sprinkler Repair Miami | CallTechCare",
  description:
    "Fast and reliable sprinkler repair in Miami and Broward. CallTechCare also provides security camera installation and expert tech support.",
  alternates: {
    canonical: "https://www.calltechcare.com/sprinkler-repair-miami",
  },
  openGraph: {
    title: "Sprinkler Repair Miami | CallTechCare",
    description:
      "Fast and reliable sprinkler repair in Miami and Broward, plus security camera installation and expert tech support.",
    url: "https://www.calltechcare.com/sprinkler-repair-miami",
    siteName: "CallTechCare",
    images: [
      {
        url: "https://www.calltechcare.com/logo-og.png",
        width: 1200,
        height: 630,
        alt: "CallTechCare - Sprinkler Repair Miami",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sprinkler Repair Miami | CallTechCare",
    description:
      "Fast and reliable sprinkler repair in Miami and Broward, plus security camera installation and expert tech support.",
    images: ["https://www.calltechcare.com/logo-og.png"],
  },
};

export default function SprinklerRepairMiamiPage() {
  return (
    <>
      <Hero
        titleLine1="Sprinkler Repair Miami"
        titleLine2="Irrigation • Cameras • Tech Services"
        subtitle="Professional sprinkler repair and irrigation services in Miami and Broward. We also install security cameras and provide expert tech support."
        badgeText="Sprinkler Repair & Irrigation in Miami & Broward"
        primaryCtaText="Call Now"
        primaryCtaHref="tel:+17863662729"
        secondaryCtaText="Request a Quote"
        secondaryCtaHref="/request-quote"
        showCallButton={false}
      />

      <section className="seo-intro-section">
        <div className="seo-intro">
          <h2 className="seo-intro-title">Sprinkler Repair & Irrigation Services in Miami and Broward</h2>

          <p>
            If you need sprinkler repair in Miami, CallTechCare provides fast, straightforward help for sprinkler leaks, broken heads,
            poor coverage, controller issues, and irrigation troubleshooting across Miami-Dade and Broward.
          </p>

          <Link
            href={SPRINKLER_SERVICE_DETAILS_HREF}
            className="spr-detailsLink"
            aria-label="View full sprinkler repair and irrigation service details"
          >
            View full sprinkler repair &amp; irrigation service details →
          </Link>

          <p>
            Our goal is simple: get your system running correctly, protect your landscaping, and help you avoid wasted water. If your
            sprinkler zones are uneven, your timer isn’t responding, or you’re seeing soggy spots, we’ll diagnose the issue and explain
            the fix before we start.
          </p>

          <h3 className="spr-landing-h3">Common sprinkler problems we fix</h3>

          <p>
            We handle the most common sprinkler and irrigation issues in South Florida, including broken sprinkler heads, misaligned
            spray patterns, cracked pipes, valve and zone problems, timer/controller troubleshooting, and drip irrigation leaks.
          </p>

          <p>
            Not sure what’s wrong? Tell us what you’re noticing (low pressure, one zone not turning on, constant running water, or a wet
            patch in the yard) and we’ll guide the next step.
          </p>

          <p>
            After sprinkler repair and irrigation service, we also provide <Link href="/services/wireless-camera-installation">wireless camera installation</Link> and
            {" "}
            <Link href="/services">tech support</Link> (Wi-Fi, computers, printers, and more) for homes and small businesses.
          </p>

          <h3 className="spr-landing-h3">Service area</h3>

          <p>
            We serve Miami-Dade and Broward, including Miami, Miramar, Pembroke Pines, Hollywood, and Fort Lauderdale. If you’re nearby
            and don’t see your city listed, reach out—we’ll confirm availability.
          </p>

          <p>
            Ready to get started? Call now or <Link href="/request-quote">request a quote</Link> and we’ll confirm details and schedule
            the next available visit.
          </p>
        </div>
      </section>

      <section className="spr-landing-section" aria-label="Sprinkler repair highlights">
        <div className="spr-landing">
          <h2 className="spr-landing-title">Fix the sprinklers. Protect the yard. Stop wasting water.</h2>
          <p className="spr-landing-sub">
            Quick diagnosis, clear communication, and reliable on-site service across Miami-Dade and Broward.
          </p>

          <div className="spr-cardGrid">
            <div className="spr-card spr-anim" style={{ animationDelay: "0ms" }}>
              <div className="spr-cardMedia">
                <SprinklerIllustration />
              </div>
              <h3 className="spr-cardTitle">Heads, coverage & zone issues</h3>
              <p className="spr-cardText">
                Broken heads, uneven spray, low coverage, or a zone that won’t turn on—we’ll pinpoint the cause and get it working
                correctly.
              </p>
            </div>

            <div className="spr-card spr-anim" style={{ animationDelay: "80ms" }}>
              <div className="spr-cardMedia">
                <ControllerIllustration />
              </div>
              <h3 className="spr-cardTitle">Timer/controller troubleshooting</h3>
              <p className="spr-cardText">
                If scheduling is off, zones run at the wrong time, or the controller isn’t responding, we’ll troubleshoot settings and
                hardware.
              </p>
            </div>

            <div className="spr-card spr-anim" style={{ animationDelay: "160ms" }}>
              <div className="spr-cardMedia">
                <LeakIllustration />
              </div>
              <h3 className="spr-cardTitle">Leaks & constant running water</h3>
              <p className="spr-cardText">
                Wet spots, pooling water, or a system that won’t shut off can point to valve or line problems—we’ll identify and address
                the leak.
              </p>
            </div>
          </div>

          <div className="spr-steps" aria-label="How it works">
            <h2 className="spr-landing-title">How it works</h2>
            <div className="spr-stepGrid">
              <div className="spr-step spr-anim" style={{ animationDelay: "0ms" }}>
                <div className="spr-stepNum">1</div>
                <div>
                  <h3 className="spr-stepTitle">Tell us what you’re seeing</h3>
                  <p className="spr-stepText">Low pressure, one zone not working, leaks, or coverage issues—we’ll ask 1–2 quick questions.</p>
                </div>
              </div>
              <div className="spr-step spr-anim" style={{ animationDelay: "80ms" }}>
                <div className="spr-stepNum">2</div>
                <div>
                  <h3 className="spr-stepTitle">On-site diagnosis</h3>
                  <p className="spr-stepText">We inspect the system, isolate the issue, and explain the recommended fix clearly.</p>
                </div>
              </div>
              <div className="spr-step spr-anim" style={{ animationDelay: "160ms" }}>
                <div className="spr-stepNum">3</div>
                <div>
                  <h3 className="spr-stepTitle">Repair & test</h3>
                  <p className="spr-stepText">We complete the repair and test zones so your system runs reliably again.</p>
                </div>
              </div>
            </div>
          </div>

          <p className="spr-landing-cta">
            Prefer to go straight to scheduling? <Link href="/request-quote">Request a quote</Link> or call now. Want full service
            details? View{" "}
            <Link href={SPRINKLER_SERVICE_DETAILS_HREF}>Sprinkler Repair &amp; Irrigation</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
