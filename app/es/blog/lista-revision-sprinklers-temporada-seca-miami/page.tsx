import type { Metadata } from "next";
import { sanity } from "@/lib/sanity";
import BlogPost from "@/app/blog/[slug]/page";

const ES_PAGE_URL = "https://www.calltechcare.com/es/blog/lista-revision-sprinklers-temporada-seca-miami";
const EN_POST_URL = "https://www.calltechcare.com/blog/dry-season-sprinkler-checklist-miami";

export async function generateMetadata(): Promise<Metadata> {
  const post = await sanity.fetch(
    `*[_type == "post" && slug.current == "dry-season-sprinkler-checklist-miami"][0]{
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
    "Lista de Revisión de Sprinklers para la Temporada Seca en Miami";
  const description =
    post?.metaDescriptionEs ||
    post?.excerptEs ||
    "Lista de revisión de sprinklers para la temporada seca en Miami — qué revisar antes de noviembre: controlador, sensor de lluvia, cabezales, válvulas y presión.";
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
export default function ListaRevisionSprinklersTemporadaSecaMiamiPage() {
  return (
    <BlogPost
      params={Promise.resolve({ slug: "dry-season-sprinkler-checklist-miami" })}
      locale="es"
    />
  );
}
