import type { ComponentType } from "react";
import Hero from "@/components/sections/Hero";
import SEOIntro from "@/components/sections/SEOIntro";
import Services from "@/components/sections/Services";
import HowItWorks from "@/components/sections/HowItWorks";
import TestimonialsList, { Testimonial } from "@/components/common/TestimonialsList";
import Pricing from "@/components/sections/PricingServer";
import Contact from "@/components/sections/Contact";
import HighlightsServer from "@/components/sections/HighLigthsServer";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import SpeedTestCTA from "@/components/sections/SpeedTestCTA";
type Section = {
  key:
    | "hero"
    | "seo-intro"
    | "services"
    | "highlights"
    | "how"
    | "why"
    | "testimonials"
    | "pricing"
    | "speed-test-cta"
    | "contact";
  Component: ComponentType<any>;
  props?: Record<string, unknown>;
};

const HOMEPAGE_TESTIMONIALS: Testimonial[] = [
  {
    name: "Jorge Manuel.",
    text: "They were patient and explained everything clearly.",
    date: "2025-05-12",
    rating: 5,
    verified: true,
  },
  {
    name: "Brian T.",
    text: "Set up our Wi-Fi and TV in one visit. Great service!",
    date: "2025-04-29",
    rating: 5,
    verified: true,
  },
  {
    name: "María L.",
    text: "Very respectful and helpful. Highly recommended.",
    date: "2025-03-03",
    rating: 5,
    verified: true,
  },
];

export const homeSections: Section[] = [
  {
    key: "hero",
    Component: Hero,
    props: {
        // imageSrc: "/helping2.jpg",

        titleLine1: "Local Home, Outdoor & Tech Services",
        titleLine2: "for Homes & Small Businesses in South Florida",

        subtitle:
          "Serving Miami, Pembroke Pines, Broward County, Miramar, and Homestead with professional home, outdoor, and tech services including security camera installation, TV mounting, Wi-Fi & internet troubleshooting, computer and printer support, phone & tablet help, senior-friendly in-home tech support, sprinkler & irrigation service, and tree trimming.",
        badgeText: "Trusted Local Services in South Florida",

        primaryCtaText: "Contact Us",
        primaryCtaHref: "#contact",

        secondaryCtaText: "Request a Quote",
        secondaryCtaHref: "/request-quote",

        phoneNumber: "+17863662729",
        showCallButton: true,
        
        stats: [
            { value: "500+", label: "Local Clients Helped" },
            { value: "4.9/5", label: "Customer Satisfaction" },
            { value: "Same-Day", label: "Appointments Available" },
        ],
        },
  },
 
  { key: "highlights", Component: HighlightsServer, props: {} },

  { key: "services", Component: Services },

  { key: "speed-test-cta", Component: SpeedTestCTA, props: {} },

  { key: "seo-intro", Component: SEOIntro, props: {}, },
  { key: "why", Component: WhyChooseUs },


  { key: "how", Component: HowItWorks, props: {} },

  {
    key: "testimonials",
    Component: TestimonialsList,
    props: {
      items: HOMEPAGE_TESTIMONIALS,
      title: "What South Florida Clients Say",
      subtitle: "Real experiences from satisfied homeowners and families.",
      variant: "plain", 
    },
  },

  { key: "pricing", Component: Pricing, props: {} },
  {
    key: "contact",
    Component: Contact,
    props: {
      headline: "Questions? Let’s talk.",
      phone: "(786) 366-2729",
    },
  },
];
