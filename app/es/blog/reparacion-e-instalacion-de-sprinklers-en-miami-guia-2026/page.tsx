import type { Metadata } from "next";
import { sanity } from "@/lib/sanity";
import BlogPost from "@/app/blog/[slug]/page";

const ES_PAGE_URL = "https://www.calltechcare.com/es/blog/reparacion-e-instalacion-de-sprinklers-en-miami-guia-2026";
const EN_POST_URL = "https://www.calltechcare.com/blog/sprinkler-repair-and-installation-in-miami-2026-guide";

export async function generateMetadata(): Promise<Metadata> {
  const post = await sanity.fetch(
    `*[_type == "post" && slug.current == "sprinkler-repair-and-installation-in-miami-2026-guide"][0]{
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
    "Reparación e Instalación de Sprinklers en Miami (Guía 2026)";
  const description =
    post?.metaDescriptionEs ||
    post?.excerptEs ||
    "Guías de reparación de sprinklers y riego para Miami y Broward — fugas, válvulas, temporizadores, bombas y sistemas nuevos — además de guías de cámaras de seguridad de CallTechCare.";
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
export default function ReparacionEInstalacionDeSprinklersEnMiamiGuia2026Page() {
  return (
    <BlogPost
      params={Promise.resolve({ slug: "sprinkler-repair-and-installation-in-miami-2026-guide" })}
      locale="es"
    />
  );
}
