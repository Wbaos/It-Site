import type { ComponentType } from "react";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import HowItWorks from "@/components/sections/HowItWorks";
import TestimonialsList, { Testimonial } from "@/components/common/TestimonialsList";
import Pricing from "@/components/sections/PricingServer";
import Contact from "@/components/sections/Contact";
import HighlightsServer from "@/components/sections/HighLigthsServer";

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
        imageSrc: "/helping2.jpg",

        titleLine1: "Your Technology,",
        titleLine2: "Our Expertise",

        subtitle:
            "Comprehensive IT support and managed services to keep your business running smoothly. From remote assistance to on-site support, we've got you covered.",

        badgeText: "24/7 Professional IT Support",

        primaryCtaText: "Get Started",
        primaryCtaHref: "#contact",

        secondaryCtaText: "View Services",
        secondaryCtaHref: "#services",

        stats: [
            { value: "500+", label: "Happy Clients" },
            { value: "99.9%", label: "Uptime Guarantee" },
            { value: "<15min", label: "Response Time" },
        ],
    },
},

{ key: "highlights", Component: HighlightsServer, props: {} },
    { key: "services", Component: Services },
    { key: "how", Component: HowItWorks, props: {} },
 {
    key: "testimonials",
    Component: TestimonialsList,
    props: {
        items: HOMEPAGE_TESTIMONIALS,
        title: "What Clients Say",
        subtitle: "Real experiences from satisfied homeowners and businesses.",
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
