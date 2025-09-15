import type { ComponentType } from "react";
import Hero from "@/components/sections/Hero";
import Highlights from "@/components/sections/Highlights";
import Services from "@/components/sections/Services";
import HowItWorks from "@/components/sections/HowItWorks";
import TestimonialsList, {
  Testimonial,
} from "@/components/common/TestimonialsList";
import Pricing from "@/components/sections/Pricing";
import Contact from "@/components/sections/Contact";

type Section = {
  key:
    | "hero"
    | "services"
    | "highlights"
    | "how"
    | "testimonials"
    | "pricing"
    | "contact";
  Component: ComponentType<any>;
  props?: any;
};

// 👇 some global testimonials for homepage
const HOMEPAGE_TESTIMONIALS: Testimonial[] = [
  {
    name: "Jorge Manuel.",
    text: "They were patient and explained everything to my mom.",
    date: "2025-05-12",
    rating: 5,
  },
  {
    name: "George T.",
    text: "Set up our Wi-Fi and TV in one visit. Great service!",
    date: "2025-04-29",
    rating: 5,
  },
  {
    name: "María L.",
    text: "Very respectful and helpful. Highly recommended.",
    date: "2025-03-03",
    rating: 5,
  },
];

export const homeSections: Section[] = [
  {
    key: "hero",
    Component: Hero,
    props: {
      title: "Patient, friendly tech help—right at home.",
      subtitle: "We set up phones, Wi-Fi, TVs, and protect against scams.",
      ctaText: "Book a Visit",
      ctaHref: "#contact",
      imageSrc: "/helping2.jpg",
    },
  },
  { key: "highlights", Component: Highlights, props: {} },

  {
    key: "services",
    Component: Services,
    props: {
      items: [
        {
          title: "Phone & Tablet Setup",
          desc: "iPhone/Android, contacts, email, accessibility.",
          icon: "📱",
          slug: "phone-tablet-setup",
        },
        {
          title: "Wi-Fi & Internet",
          desc: "Router installs, printers, and fixing weak connections.",
          icon: "📶",
          slug: "wifi-internet",
        },
        {
          title: "Smart TV & Streaming",
          desc: "Netflix, YouTube, Amazon Firestick, or cable setup.",
          icon: "📺",
          slug: "smart-tv-streaming",
        },
        {
          title: "Smart Home Devices",
          desc: "Alexa, Google Home, smart plugs, thermostats, and more.",
          icon: "🏠",
          slug: "smart-home-devices",
        },
        {
          title: "Computer Support",
          desc: "Speed up slow PCs, install updates, and fix issues.",
          icon: "💻",
          slug: "computer-support",
        },
        {
          title: "Cybersecurity Checkups",
          desc: "Protect against scams, set strong passwords, and backups.",
          icon: "🔒",
          slug: "security-checkups",
        },
        {
          title: "Video Calls",
          desc: "Stay connected with family on Zoom, FaceTime, or WhatsApp.",
          icon: "📹",
          slug: "video-calls",
        },
        {
          title: "Email & Social Media",
          desc: "Help with Gmail, Facebook, WhatsApp, and photo sharing.",
          icon: "✉️",
          slug: "email-social-media",
        },
      ],
    },
  },
  { key: "how", Component: HowItWorks, props: {} },
  {
    key: "testimonials",
    Component: TestimonialsList,
    props: {
      items: HOMEPAGE_TESTIMONIALS,
      title: "What Families Say",
      subtitle: "Real experiences from seniors and their loved ones.",
      carousel: true, // ✅ homepage gets carousel
    },
  },
  { key: "pricing", Component: Pricing, props: {} },
  {
    key: "contact",
    Component: Contact,
    props: { headline: "Questions? Let’s talk.", phone: "(786) 366-2729" },
  },
];
