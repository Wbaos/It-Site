import { sanity } from "@/lib/sanity";

export async function getServices() {
    return await sanity.fetch(`*[_type == "service"] | order(title asc) {
    _id,
    title,
    slug,
    category,
  }`);
}
