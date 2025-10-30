import type { ComponentType } from "react";
import Hero from "@/components/sections/Hero";
import Highlights from "@/components/sections/Highlights";
import Services from "@/components/sections/Services";
import HowItWorks from "@/components/sections/HowItWorks";
import TestimonialsList, { Testimonial } from "@/components/common/TestimonialsList";
import Pricing from "@/components/sections/PricingServer";
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

// Testimonials now include verified badges
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
            // Broader message that fits home + business + future services
            title: "Reliable help for your home and business.",
            subtitle:
                "Friendly, dependable services for homes and businesses — tech setup, repairs, installations, and more.",
            ctaText: "Talk to Us",
            ctaHref: "#contact",
            imageSrc: "/helping2.jpg",
        },
    },
    { key: "highlights", Component: Highlights, props: {} },
    { key: "services", Component: Services },
    { key: "how", Component: HowItWorks, props: {} },
    {
        key: "testimonials",
        Component: TestimonialsList,
        props: {
            items: HOMEPAGE_TESTIMONIALS,
            title: "What Clients Say",
            subtitle: "Real experiences from satisfied homeowners and businesses.",
            carousel: true,
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
