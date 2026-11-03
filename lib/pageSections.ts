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
import ProblemPicker from "@/components/sections/ProblemPicker";

// Single home template, both languages. The section list, order and
// components are identical for English and Spanish; only the text changes,
// via each section's `locale` prop (or, for Hero/Contact, via the props
// below). The Spanish copy is a faithful translation of the English copy:
// same sections, same paragraphs and cards, no additions or cuts.
export type HomeLocale = "en" | "es";

type Section = {
  key:
    | "hero"
    | "problem-picker"
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

const heroPropsEn = {
  // imageSrc: "/helping2.jpg",

  titleLine1: "Sprinkler Repair Miami & Broward",
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
};

const heroPropsEs = {
  titleLine1: "Reparación de Sprinklers en Miami y Broward",
  titleLine2: "Irrigación • Reparaciones • Sistemas Nuevos",
  subtitle:
    "Servicios profesionales de reparación de sprinklers e irrigación en Miami y Broward. También instalamos cámaras de seguridad.",
  badgeText: "Reparación de Sprinklers e Irrigación en Miami y Broward",
  primaryCtaText: "Llama Ahora",
  primaryCtaHref: "tel:+17863662729",
  secondaryCtaText: "Solicita una Cotización",
  secondaryCtaHref: "/es/solicita-una-cotizacion",
  phoneNumber: "+17863662729",
  showCallButton: true,
  stats: [
    { value: "1500+", label: "Clientes Locales Atendidos" },
    { value: "5/5", label: "Satisfacción del Cliente" },
    { value: "Mismo Día", label: "Citas Disponibles" },
  ],
};

export function getHomeSections(locale: HomeLocale = "en"): Section[] {
  const isSpanish = locale === "es";
  return [
    {
      key: "hero",
      Component: Hero,
      props: isSpanish ? heroPropsEs : heroPropsEn,
    },

    { key: "problem-picker", Component: ProblemPicker, props: { locale } },

    { key: "highlights", Component: HighlightsServer, props: { locale } },

    { key: "services", Component: Services, props: { locale } },

    { key: "seo-intro", Component: SEOIntro, props: { locale } },
    { key: "why", Component: WhyChooseUs, props: { locale } },

    { key: "how", Component: HowItWorks, props: { locale } },

    {
      key: "testimonials",
      Component: GoogleReviewsCTA,
      props: { locale },
    },

    { key: "pricing", Component: Pricing, props: {} },
    {
      key: "contact",
      Component: Contact,
      props: isSpanish
        ? {
            headline: "¿Preguntas? Hablemos.",
            subtitle:
              "¿Tienes una pregunta? Estamos aquí para ayudarte.",
            locale,
          }
        : {
            headline: "Questions? Let’s talk.",
            subtitle: "Have a question? We're here to help.",
            locale,
          },
    },
  ];
}

// English home sections, unchanged from before the single-template refactor.
export const homeSections: Section[] = getHomeSections("en");
