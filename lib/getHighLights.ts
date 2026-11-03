export type Highlight = {
  _id: string;
  title: string;
  desc: string;
  color: string;
  icon: string; 
  order: number;
};

export async function getHighlights(locale: "en" | "es" = "en"): Promise<Highlight[]> {
  if (locale === "es") {
    const highlights: Highlight[] = [
      {
        _id: "fast",
        title: "Servicio Rápido",
        desc: "Disponibilidad el mismo día en la mayoría de las áreas.",
        color: "#FACC15",
        icon: "/icons/fast.svg",
        order: 1,
      },
      {
        _id: "friendly",
        title: "Expertos Amables",
        desc: "Apoyo paciente con explicaciones claras.",
        color: "#3B82F6",
        icon: "/icons/friendly.svg",
        order: 2,
      },
      {
        _id: "transparent",
        title: "Precios Transparentes",
        desc: "Conoce el costo por adelantado, sin sorpresas.",
        color: "#10B981",
        icon: "/icons/transparent.svg",
        order: 3,
      },
    ];

    return highlights.sort((a, b) => a.order - b.order);
  }

  const highlights: Highlight[] = [
    {
      _id: "fast",
      title: "Fast Service",
      desc: "Same-day availability in most areas.",
      color: "#FACC15",
      icon: "/icons/fast.svg",
      order: 1,
    },
    {
      _id: "friendly",
      title: "Friendly Experts",
      desc: "Patient support with clear explanations.",
      color: "#3B82F6",
      icon: "/icons/friendly.svg",
      order: 2,
    },
    {
      _id: "transparent",
      title: "Transparent Pricing",
      desc: "Know the cost upfront — no surprises.",
      color: "#10B981",
      icon: "/icons/transparent.svg",
      order: 3,
    },
  ];

  return highlights.sort((a, b) => a.order - b.order);
}
