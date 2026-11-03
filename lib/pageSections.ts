import type { ComponentType } from "react";
import Hero from "@/components/sections/Hero";
import SEOIntro from "@/components/sections/SEOIntro";
import Services from "@/components/sections/Services";
import HowItWorks from "@/components/sections/HowItWorks";
import GoogleReviewsCTA from "@/components/sections/GoogleReviewsCTA";
import Pricing from "@/components/sections/PricingServer";
import Contact from "@/components/sections/Contact";
import HighlightsServer from "@/components/sections/HighLigthsServer";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
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
    | "contact";
  Component: ComponentType<any>;
  props?: Record<string, unknown>;
};

export const homeSections: Section[] = [
  {
    key: "hero",
    Component: Hero,
    props: {
        // imageSrc: "/helping2.jpg",

        titleLine1: "Sprinkler Repair Miami",
        titleLine2: "Irrigation • Repairs • New Systems",

        subtitle:
          "Professional sprinkler repair and irrigation services in Miami and Broward. We also install security cameras.",
        badgeText: "Sprinkler Repair & Irrigation in Miami & Broward",

        primaryCtaText: "Call Now",
        primaryCtaHref: "tel:+17863662729",

        secondaryCtaText: "Request a Quote",
        secondaryCtaHref: "/request-quote",

        phoneNumber: "+17863662729",
        showCallButton: true,
        
        stats: [
            { value: "1500+", label: "Local Clients Helped" },
            { value: "5/5", label: "Customer Satisfaction" },
            { value: "Same-Day", label: "Appointments Available" },
        ],
        },
  },
 
  { key: "highlights", Component: HighlightsServer, props: {} },

  { key: "services", Component: Services },

  { key: "seo-intro", Component: SEOIntro, props: {}, },
  { key: "why", Component: WhyChooseUs },


  { key: "how", Component: HowItWorks, props: {} },

  {
    key: "testimonials",
    Component: GoogleReviewsCTA,
    props: {},
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
