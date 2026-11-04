import { sanity } from "@/lib/sanity";

export type Highlight = {
  _id: string;
  title: string;
  desc: string;
  color: string;
  icon: string;
  order: number;
};

export async function getHighlights(locale: "en" | "es" = "en"): Promise<Highlight[]> {
  const isSpanish = locale === "es";
  const raw: {
    _id: string;
    title: string;
    titleEs?: string;
    desc: string;
    descEs?: string;
    color: string;
    icon?: string;
    order: number;
  }[] = await sanity.fetch(`
    *[_type == "highlight"] | order(order asc) {
      _id,
      title,
      titleEs,
      desc,
      descEs,
      color,
      "icon": iconSvg.asset->url,
      order
    }
  `);

  const highlights: Highlight[] = raw.map((h) => ({
    _id: h._id,
    title: isSpanish ? h.titleEs || h.title : h.title,
    desc: isSpanish ? h.descEs || h.desc : h.desc,
    color: h.color,
    icon: h.icon || "",
    order: h.order,
  }));

  return highlights.sort((a, b) => a.order - b.order);
}
