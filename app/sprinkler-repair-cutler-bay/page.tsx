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
  title: "Sprinkler Repair in Cutler Bay, FL | Same-Day | CallTechCare",
  description:
    "Sprinkler repair in Cutler Bay, FL 33157: leaks, broken heads, valves, timers & new systems. Same-day service, free estimates. Call (786) 366-2729.",
  alternates: {
    canonical: "https://www.calltechcare.com/sprinkler-repair-cutler-bay",
  },
  openGraph: {
    title: "Sprinkler Repair in Cutler Bay, FL | Same-Day | CallTechCare",
    description:
      "Sprinkler repair in Cutler Bay, FL 33157: leaks, broken heads, valves, timers & new systems. Same-day service, free estimates. Call (786) 366-2729.",
    url: "https://www.calltechcare.com/sprinkler-repair-cutler-bay",
    siteName: "CallTechCare",
    images: [
      {
        url: "https://www.calltechcare.com/logo-og.png",
        width: 1200,
        height: 630,
        alt: "CallTechCare - Sprinkler Repair Cutler Bay",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sprinkler Repair in Cutler Bay, FL | Same-Day | CallTechCare",
    description:
      "Sprinkler repair in Cutler Bay, FL 33157: leaks, broken heads, valves, timers & new systems. Same-day service, free estimates. Call (786) 366-2729.",
    images: ["https://www.calltechcare.com/logo-og.png"],
  },
};

export default function SprinklerRepairCutlerBayPage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How much does sprinkler repair cost in Cutler Bay?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "It depends on the problem and the size of your system. A broken sprinkler head costs less than a valve or zone repair. CallTechCare gives you a clear, upfront estimate before starting any work, and the estimate is free.",
                },
              },
              {
                "@type": "Question",
                name: "How fast can you come to Cutler Bay for a sprinkler repair?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "In Cutler Bay and most of Miami-Dade, same-day appointments are available. Call (786) 366-2729 and we will confirm the next available visit.",
                },
              },
              {
                "@type": "Question",
                name: "Do you serve areas near Cutler Bay?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. We serve Cutler Bay and nearby Miami-Dade cities, including Aventura, Hialeah, Doral, and Kendall, as well as all of Miami-Dade and Broward.",
                },
              },
              {
                "@type": "Question",
                name: "Why is one sprinkler zone not working?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The most common causes are a faulty valve, a wiring issue, a timer problem, or an underground leak. We diagnose the root cause before recommending a repair.",
                },
              },
              {
                "@type": "Question",
                name: "Do you install new sprinkler systems in Cutler Bay?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. We install new irrigation zones, valves, sprinkler lines, and controllers in Cutler Bay, and we can upgrade old systems with smart WiFi controllers.",
                },
              },
              {
                "@type": "Question",
                name: "Do you repair sprinkler leaks in Cutler Bay?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. We repair sprinkler leaks in Cutler Bay, including PVC pipe leaks, leaking valves, and broken heads, and we test the system after the repair.",
                },
              },
              {
                "@type": "Question",
                name: "Do you repair sprinklers in Cutler Bay HOA communities?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. We repair and install sprinklers in homes across Cutler Bay's HOA communities, including Lakes by the Bay, Saga Bay and Whispering Pines. Call (786) 366-2729 and we'll confirm coverage for your neighborhood.",
                },
              },
              {
                "@type": "Question",
                name: "What ZIP codes do you serve in Cutler Bay?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "We serve all of Cutler Bay (ZIP codes 33157, 33189 and 33190), plus nearby 33177, including Cutler Ridge, Lakes by the Bay, Saga Bay and Whispering Pines. If you're nearby in Miami-Dade or Broward, call us and we'll confirm availability.",
                },
              },
              {
                "@type": "Question",
                name: "Do you offer sprinkler repair near me in Cutler Bay?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. CallTechCare offers sprinkler repair near you in Cutler Bay — same-day appointments and free estimates. Call (786) 366-2729 and we'll confirm the next available visit.",
                },
              },
            ],
          }),
        }}
      />

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Sprinkler Repair in Cutler Bay",
            provider: {
              "@type": "LocalBusiness",
              name: "CallTechCare",
              telephone: "+1-786-366-2729",
              url: "https://www.calltechcare.com",
            },
            areaServed: {
              "@type": "City",
              name: "Cutler Bay",
              addressRegion: "FL",
              postalCode: ["33157", "33189", "33190", "33177"],
            },
            url: "https://www.calltechcare.com/sprinkler-repair-cutler-bay",
          }),
        }}
      />

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.calltechcare.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Sprinkler Repair Cutler Bay",
                item: "https://www.calltechcare.com/sprinkler-repair-cutler-bay",
              },
            ],
          }),
        }}
      />

      <Hero
        titleLine1="Sprinkler Repair in Cutler Bay"
        titleLine2="Irrigation • Repairs • New Systems"
        subtitle="Professional sprinkler repair and irrigation services in Cutler Bay and Miami-Dade — same-day appointments, free estimates."
        badgeText="Sprinkler Repair & Irrigation in Cutler Bay & Miami-Dade"
        primaryCtaText="Call Now"
        primaryCtaHref="tel:+17863662729"
        secondaryCtaText="Request a Quote"
        secondaryCtaHref="/request-quote"
        showCallButton={false}
      />

      <section className="seo-intro-section">
        <div className="seo-intro">
          <h2 className="seo-intro-title">Sprinkler Repair & Irrigation Services in Cutler Bay and Miami-Dade</h2>

          <p>
            If you need sprinkler repair in Cutler Bay, CallTechCare provides fast, straightforward sprinkler system repair for sprinkler leaks, broken heads,
            poor coverage, controller issues, and irrigation repair across Cutler Ridge, Lakes by the Bay, Saga Bay, Whispering Pines and
            the rest of Cutler Bay, FL 33157, 33189 and 33190.
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
            We serve all of Cutler Bay (33157, 33189 and 33190) and nearby 33177, as well as nearby Miami-Dade cities, including{" "}
            <Link href="/sprinkler-repair-aventura">Aventura</Link>,{" "}
            <Link href="/sprinkler-repair-hialeah">Hialeah</Link>,{" "}
            <Link href="/sprinkler-repair-doral">Doral</Link>, and{" "}
            <Link href="/sprinkler-repair-kendall">Kendall</Link>, as well as all of
            Miami-Dade and Broward. From Cutler Ridge and Lakes by the Bay to Saga Bay, Whispering Pines and Old Cutler Bay, Cutler Bay is part of our Miami service area — see the full list on our{" "}
            <Link href="/locations/miami">Miami page</Link>. If you’re nearby
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
            Quick diagnosis, clear communication, and reliable on-site service across Cutler Bay and Miami-Dade.
          </p>

          <div className="spr-cardGrid">
            <div className="spr-card spr-anim" style={{ animationDelay: "0ms" }}>
              <div className="spr-cardMedia">
                <SprinklerIllustration />
              </div>
              <h3 className="spr-cardTitle"><Link href="/services/sprinkler-valve-repair" style={{ color: "inherit", textDecoration: "none" }}>Heads, coverage & zone issues</Link></h3>
              <p className="spr-cardText">
                Broken heads, uneven spray, low coverage, or a zone that won’t turn on—we’ll pinpoint the cause and get it working
                correctly.
              </p>
            </div>

            <div className="spr-card spr-anim" style={{ animationDelay: "80ms" }}>
              <div className="spr-cardMedia">
                <ControllerIllustration />
              </div>
              <h3 className="spr-cardTitle"><Link href="/services/sprinkler-timer-installation" style={{ color: "inherit", textDecoration: "none" }}>Timer/controller troubleshooting</Link></h3>
              <p className="spr-cardText">
                If scheduling is off, zones run at the wrong time, or the controller isn’t responding, we’ll troubleshoot settings and
                hardware.
              </p>
            </div>

            <div className="spr-card spr-anim" style={{ animationDelay: "160ms" }}>
              <div className="spr-cardMedia">
                <LeakIllustration />
              </div>
              <h3 className="spr-cardTitle"><Link href="/services/sprinkler-leak-repair" style={{ color: "inherit", textDecoration: "none" }}>Leaks & constant running water</Link></h3>
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

      <section className="spr-landing-section" aria-label="Our work">
        <div className="spr-landing">
          <h2 className="spr-landing-title">Our Work</h2>
          <p className="spr-landing-sub">
            Real sprinkler work by CallTechCare across Cutler Bay and Miami-Dade.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
            }}
          >
            <figure style={{ margin: 0 }}>
              <img
                src="https://cdn.sanity.io/images/celkrwoq/production/b893ef26a1bdeef8271d9573c0351ab9bb4a8954-768x1024.jpg?w=900&auto=format"
                alt="Sprinkler system watering a hedge line in Cutler Bay, FL"
                loading="lazy"
                style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", borderRadius: "12px", display: "block" }}
              />
              <figcaption>Sprinkler system watering a hedge line in Cutler Bay</figcaption>
            </figure>

            <figure style={{ margin: 0 }}>
              <img
                src="https://cdn.sanity.io/images/celkrwoq/production/3c7c315f5ca88cd2dc833f4187fa803c4a2e4a13-768x1024.jpg?w=900&auto=format"
                alt="Rain Bird irrigation controller in Cutler Bay, FL"
                loading="lazy"
                style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", borderRadius: "12px", display: "block" }}
              />
              <figcaption>Rain Bird irrigation controller in Cutler Bay</figcaption>
            </figure>

            <figure style={{ margin: 0 }}>
              <img
                src="https://cdn.sanity.io/images/celkrwoq/production/b313d38c53d2b4590d4d0898f54d4a20cfd28d42-768x1024.jpg?w=900&auto=format"
                alt="K-Rain index valve in Cutler Bay, FL"
                loading="lazy"
                style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", borderRadius: "12px", display: "block" }}
              />
              <figcaption>K-Rain index valve in Cutler Bay</figcaption>
            </figure>

            <figure style={{ margin: 0 }}>
              <img
                src="https://cdn.sanity.io/images/celkrwoq/production/3d495269e52ed93bb03e5191f5fd5c2082be1bcd-1024x768.jpg?w=900&auto=format"
                alt="Sprinkler system watering a large lot in Cutler Bay, FL"
                loading="lazy"
                style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover", borderRadius: "12px", display: "block" }}
              />
              <figcaption>Sprinkler system watering a large lot in Cutler Bay</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="spr-landing-section" aria-label="Frequently asked questions">
        <div className="spr-landing">
          <div className="service-faq">
            <h2 className="faq-heading">Frequently Asked Questions About Sprinkler Repair in Cutler Bay</h2>
            <div className="faq-list">
              <details className="faq-item">
                <summary className="faq-question">
                  <span>How much does sprinkler repair cost in Cutler Bay?</span>
                  <span className="faq-toggle" aria-hidden="true">+</span>
                </summary>
                <p className="faq-answer">It depends on the problem and the size of your system. A broken sprinkler head costs less than a valve or zone repair. CallTechCare gives you a clear, upfront estimate before starting any work, and the estimate is free.</p>
              </details>
              <details className="faq-item">
                <summary className="faq-question">
                  <span>How fast can you come to Cutler Bay for a sprinkler repair?</span>
                  <span className="faq-toggle" aria-hidden="true">+</span>
                </summary>
                <p className="faq-answer">In Cutler Bay and most of Miami-Dade, same-day appointments are available. Call (786) 366-2729 and we will confirm the next available visit.</p>
              </details>
              <details className="faq-item">
                <summary className="faq-question">
                  <span>Do you serve areas near Cutler Bay?</span>
                  <span className="faq-toggle" aria-hidden="true">+</span>
                </summary>
                <p className="faq-answer">Yes. We serve Cutler Bay and nearby Miami-Dade cities, including Aventura, Hialeah, Doral, and Kendall, as well as all of Miami-Dade and Broward.</p>
              </details>
              <details className="faq-item">
                <summary className="faq-question">
                  <span>Why is one sprinkler zone not working?</span>
                  <span className="faq-toggle" aria-hidden="true">+</span>
                </summary>
                <p className="faq-answer">The most common causes are a faulty valve, a wiring issue, a timer problem, or an underground leak. We diagnose the root cause before recommending a repair.</p>
              </details>
              <details className="faq-item">
                <summary className="faq-question">
                  <span>Do you install new sprinkler systems in Cutler Bay?</span>
                  <span className="faq-toggle" aria-hidden="true">+</span>
                </summary>
                <p className="faq-answer">Yes. We install new irrigation zones, valves, sprinkler lines, and controllers in Cutler Bay, and we can upgrade old systems with smart WiFi controllers.</p>
              </details>
              <details className="faq-item">
                <summary className="faq-question">
                  <span>Do you repair sprinkler leaks in Cutler Bay?</span>
                  <span className="faq-toggle" aria-hidden="true">+</span>
                </summary>
                <p className="faq-answer">Yes. We repair sprinkler leaks in Cutler Bay, including PVC pipe leaks, leaking valves, and broken heads, and we test the system after the repair.</p>
              </details>
              <details className="faq-item">
                <summary className="faq-question">
                  <span>Do you repair sprinklers in Cutler Bay HOA communities?</span>
                  <span className="faq-toggle" aria-hidden="true">+</span>
                </summary>
                <p className="faq-answer">Yes. We repair and install sprinklers in homes across Cutler Bay's HOA communities, including Lakes by the Bay, Saga Bay and Whispering Pines. Call (786) 366-2729 and we'll confirm coverage for your neighborhood.</p>
              </details>
              <details className="faq-item">
                <summary className="faq-question">
                  <span>What ZIP codes do you serve in Cutler Bay?</span>
                  <span className="faq-toggle" aria-hidden="true">+</span>
                </summary>
                <p className="faq-answer">We serve all of Cutler Bay (ZIP codes 33157, 33189 and 33190), plus nearby 33177, including Cutler Ridge, Lakes by the Bay, Saga Bay and Whispering Pines. If you're nearby in Miami-Dade or Broward, call us and we'll confirm availability.</p>
              </details>
              <details className="faq-item">
                <summary className="faq-question">
                  <span>Do you offer sprinkler repair near me in Cutler Bay?</span>
                  <span className="faq-toggle" aria-hidden="true">+</span>
                </summary>
                <p className="faq-answer">Yes. CallTechCare offers sprinkler repair near you in Cutler Bay — same-day appointments and free estimates. Call (786) 366-2729 and we'll confirm the next available visit.</p>
              </details>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
