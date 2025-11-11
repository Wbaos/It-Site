import { sanity } from "@/lib/sanity";

export async function getHighlights() {
  return await sanity.fetch(`
    *[_type == "highlight"] | order(order asc) {
      _id,
      title,
      desc,
      color,
      "iconUrl": iconSvg.asset->url
    }
  `);
}
