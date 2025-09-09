import type { ComponentType } from "react";
import Hero from "@/components/sections/Hero";
import Highlights from "@/components/sections/Highlights";
import Services from "@/components/sections/Services";
import HowItWorks from "@/components/sections/HowItWorks";
import Testimonials from "@/components/sections/Testimonials";
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
          desc: "iPhone/Android, contacts, email, and accessibility settings.",
          icon: "📱",
        },
        {
          title: "Wi-Fi & Internet",
          desc: "Router installs, printers, and fixing weak connections.",
          icon: "📶",
        },
        {
          title: "Smart TV & Streaming",
          desc: "Netflix, YouTube, Amazon Firestick, or cable setup.",
          icon: "📺",
        },
        {
          title: "Smart Home Devices",
          desc: "Alexa, Google Home, smart plugs, thermostats, and more.",
          icon: "🏠",
        },
        {
          title: "Computer Support",
          desc: "Speed up slow PCs, install updates, and fix issues.",
          icon: "💻",
        },
        {
          title: "Cybersecurity Checkups",
          desc: "Protect against scams, set strong passwords, and backups.",
          icon: "🔒",
        },
        {
          title: "Video Calls",
          desc: "Stay connected with family on Zoom, FaceTime, or WhatsApp.",
          icon: "📹",
        },
        {
          title: "Email & Social Media",
          desc: "Help with Gmail, Facebook, WhatsApp, and photo sharing.",
          icon: "✉️",
        },
      ],
    },
  },
  { key: "how", Component: HowItWorks, props: {} },
  { key: "testimonials", Component: Testimonials, props: {} },
  { key: "pricing", Component: Pricing, props: {} },
  {
    key: "contact",
    Component: Contact,
    props: { headline: "Questions? Let’s talk.", phone: "(786) 366-2729" },
  },
];
