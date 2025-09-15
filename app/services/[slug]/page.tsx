import { notFound } from "next/navigation";
import TestimonialsList from "@/components/common/TestimonialsList";

const SERVICES = {
  // ✅ Parent
  "phone-tablet-setup": {
    title: "Phone & Tablet Setup",
    image: "/PhoneSetuP.png",
    price: "$49 / setup",
    description:
      "We’ll set up your smartphone or tablet so it’s easy and safe to use.",
    details: [
      "iPhone & Android configuration",
      "Contacts, email, and calendar setup",
      "Accessibility features for seniors",
      "App installations & tutorials",
    ],
    faqs: [
      { q: "How long does setup take?", a: "Most setups take 30–45 minutes." },
      {
        q: "Do I need to buy anything extra?",
        a: "No, just have your device charged.",
      },
    ],
    testimonials: [
      {
        name: "Ana N.",
        text: "They set up my mom’s iPhone and added bigger text — she can finally read her messages!",
        date: "2025-05-12",
        rating: 5,
      },
    ],
  },

  // ✅ Subservices
  "iphone-setup": {
    title: "iPhone Setup",
    parent: {
      category: "Device Setup",
      service: "Phone & Tablet Setup",
      slug: "phone-tablet-setup",
    },
    image: "/iPhoneSetup.png",
    price: "$39 / setup",
    description:
      "We configure your iPhone with Apple ID, iCloud, email, FaceTime, and accessibility features.",
    details: [
      "Apple ID & iCloud setup",
      "Email, contacts, and calendar sync",
      "FaceTime & iMessage configuration",
      "Accessibility setup (text size, voiceover, etc.)",
    ],
    faqs: [
      { q: "Can you transfer my data?", a: "Yes, from old iPhone or Android." },
      { q: "Do I need my Apple ID?", a: "Yes, please have it ready." },
    ],
    testimonials: [
      {
        name: "Luis R.",
        text: "They moved everything from my old iPhone to my new one — smooth and stress-free!",
        date: "2025-04-28",
        rating: 5,
      },
    ],
  },

  "android-setup": {
    title: "Android Setup",
    image: "/AndroidSetup.png",
    price: "$35 / setup",
    description:
      "We set up your Android phone with Google account, apps, email, and data transfer.",
    details: [
      "Google account setup & sync",
      "Contacts, Gmail, and calendar setup",
      "Play Store apps installation",
      "Data transfer from old device",
    ],
    faqs: [
      {
        q: "Will my WhatsApp chats transfer?",
        a: "Yes, if you back them up in Google Drive.",
      },
      {
        q: "Can you move photos?",
        a: "Yes, we’ll transfer your gallery to the new phone.",
      },
    ],
    testimonials: [
      {
        name: "Marta G.",
        text: "Got my new Samsung ready with all my apps and contacts in no time!",
        date: "2025-03-11",
        rating: 5,
      },
      {
        name: "Marta G.",
        text: "444444444Got my new Samsung ready with all my apps and contacts in no time!",
        date: "2025-03-11",
        rating: 3,
      },
    ],
  },

  "accessibility-setup": {
    title: "Accessibility Setup",
    image: "/Accessibility.png",
    price: "$29 / setup",
    description:
      "We enable accessibility features for seniors or people with vision/hearing challenges.",
    details: [
      "Large text & high contrast mode",
      "VoiceOver / TalkBack setup",
      "Hearing aid compatibility",
      "Easy shortcuts for daily use",
    ],
    faqs: [
      {
        q: "Can you make it easier for my mom to read messages?",
        a: "Yes, larger text and higher contrast help a lot.",
      },
    ],
    testimonials: [
      {
        name: "George K.",
        text: "My dad can now use his phone thanks to the bigger text and voice assistant.",
        date: "2025-02-17",
        rating: 5,
      },
      {
        name: "George K.",
        text: "11111111My dad can now use his phone thanks to the bigger text and voice assistant.",
        date: "2025-02-17",
        rating: 3,
      },
    ],
  },

  "tablet-family-setup": {
    title: "Tablet Family Setup",
    image: "/TabletSetup.png",
    price: "$45 / setup",
    description:
      "We prepare tablets for family sharing — safe for kids, easy for grandparents.",
    details: [
      "Parental controls & app restrictions",
      "Multiple user profiles",
      "Video call setup (Zoom, WhatsApp, FaceTime)",
      "Entertainment apps (YouTube, Netflix, Disney+)",
    ],
    faqs: [
      {
        q: "Can you lock apps for kids?",
        a: "Yes, we set up parental controls.",
      },
      {
        q: "Do you install streaming apps?",
        a: "Yes, Netflix, Disney+, Prime Video, and more.",
      },
    ],
    testimonials: [
      {
        name: "Elisa M.",
        text: "Now my kids have their profiles and my parents can video call easily — all on one tablet!",
        date: "2025-01-22",
        rating: 5,
      },
    ],
  },
};

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const service = SERVICES[slug as keyof typeof SERVICES];
  if (!service) return notFound();

  return (
    <section className="section service-detail">
      <div className="site-container service-layout">
        <img src={service.image} alt={service.title} className="service-hero" />
        <div className="service-info">
          <h1 className="service-title">{service.title}</h1>
          <p className="service-price">{service.price}</p>

          {service.description && (
            <p className="service-description">{service.description}</p>
          )}
          <a href="/#contact" className="btn btn-primary">
            Book This Service
          </a>

          {service.details?.length > 0 && (
            <ul className="service-list">
              {service.details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {service.faqs && service.faqs.length > 0 && (
        <div className="service-faq">
          <h2 className="faq-heading">Frequently Asked Questions</h2>
          <ul className="faq-list">
            {service.faqs.map((faq, i) => (
              <li key={i} className="faq-item">
                <p className="faq-question">❓ {faq.q}</p>
                <p className="faq-answer">💡 {faq.a}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Service Testimonials */}
      {Array.isArray(service.testimonials) &&
        service.testimonials.length > 0 && (
          <TestimonialsList
            items={service.testimonials}
            title={`What Clients Say About ${service.title}`}
            carousel={true}
          />
        )}
    </section>
  );
}
