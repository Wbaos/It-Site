import type { ComponentType } from "react";
import Hero from "@/components/sections/Hero";
import Highlights from "@/components/sections/Highlights";
import Services from "@/components/sections/Services";
import HowItWorks from "@/components/sections/HowItWorks";
import TestimonialsList, {
    Testimonial,
} from "@/components/common/TestimonialsList";
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

const HOMEPAGE_TESTIMONIALS: Testimonial[] = [
    {
        name: "Jorge Manuel.",
        text: "They were patient and explained everything to my mom.They were patient and explained everything to my mom.They were patient and explained everything to my mom.They were patient and explained everything to my mom.They were patient and explained everything to my mom.They were patient and explained everything to my mom.",
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
    {
        name: "María La.",
        text: "Very respectful and helpful. Highly recommendedl.",
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
    },
    { key: "how", Component: HowItWorks, props: {} },
    {
        key: "testimonials",
        Component: TestimonialsList,
        props: {
            items: HOMEPAGE_TESTIMONIALS,
            title: "What Families Say",
            subtitle: "Real experiences from seniors and their loved ones.",
            carousel: true,
        },
    },
    { key: "pricing", Component: Pricing, props: {} },
    {
        key: "contact",
        Component: Contact,
        props: { headline: "Questions? Let’s talk.", phone: "(786) 366-2729" },
    },
];
