import type { Metadata } from "next";
import { sanity } from "@/lib/sanity";
import BlogPost from "@/app/blog/[slug]/page";

const ES_PAGE_URL = "https://www.calltechcare.com/es/blog/como-encontrar-una-fuga-de-sprinklers-en-tu-jardin";
const EN_POST_URL = "https://www.calltechcare.com/blog/how-to-find-sprinkler-leak-in-yard";

export async function generateMetadata(): Promise<Metadata> {
  const post = await sanity.fetch(
    `*[_type == "post" && slug.current == "how-to-find-sprinkler-leak-in-yard"][0]{
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
    "Cómo Encontrar una Fuga de Sprinklers en tu Jardín (Guía de Miami)";
  const description =
    post?.metaDescriptionEs ||
    post?.excerptEs ||
    "Cómo encontrar una fuga de sprinklers en tu jardín: 7 señales, qué revisar y cuándo llamar. Inspección gratis en Miami y Broward.";
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
export default function ComoEncontrarUnaFugaDeSprinklersEnTuJardinPage() {
  return (
    <BlogPost
      params={Promise.resolve({ slug: "how-to-find-sprinkler-leak-in-yard" })}
      locale="es"
    />
  );
}
