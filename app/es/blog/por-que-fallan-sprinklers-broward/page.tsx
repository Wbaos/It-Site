import type { Metadata } from "next";
import { sanity } from "@/lib/sanity";
import BlogPost from "@/app/blog/[slug]/page";

const ES_PAGE_URL = "https://www.calltechcare.com/es/blog/por-que-fallan-sprinklers-broward";
const EN_POST_URL = "https://www.calltechcare.com/blog/why-sprinkler-systems-fail-broward";

export async function generateMetadata(): Promise<Metadata> {
  const post = await sanity.fetch(
    `*[_type == "post" && slug.current == "why-sprinkler-systems-fail-broward"][0]{
      title,
      titleEs,
      metaTitleEs,
      metaDescriptionEs,
      excerptEs,
      mainImage { asset->{ url }, alt },
      ogImage { asset->{ url }, alt }
    }`
  );
  const title =
    post?.metaTitleEs ||
    post?.titleEs ||
    "Por Qué Fallan los Sprinklers en Broward";
  const description =
    post?.metaDescriptionEs ||
    post?.excerptEs ||
    "Broward es duro con los sistemas de sprinklers por las mismas siete razones locales que el resto del sur de Florida — con un giro de Broward en cada una. Aquí está qué se rompe, cómo se ve y qué lo arregla.";
  const image = post?.ogImage?.asset?.url || post?.mainImage?.asset?.url;
  return {
    title,
    description,
    alternates: {
      canonical: ES_PAGE_URL,
      languages: {
        es: ES_PAGE_URL,
        en: EN_POST_URL,
        "x-default": EN_POST_URL,
      },
    },
    openGraph: {
      title,
      description,
      url: ES_PAGE_URL,
      siteName: "CallTechCare",
      images: image ? [{ url: image, alt: post?.mainImage?.alt || title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

// Thin Spanish route: it renders the SAME blog post template as the
// English page, with locale="es". No duplicated page copy lives here:
// structure, sections and icons come from the shared template, only the
// text changes (Spanish fields from Sanity, English fallback when empty).
// Same single-template pattern as the service and city twins.
export default function PorQueFallanSprinklersBrowardPage() {
  return (
    <BlogPost
      params={Promise.resolve({ slug: "why-sprinkler-systems-fail-broward" })}
      locale="es"
    />
  );
}
