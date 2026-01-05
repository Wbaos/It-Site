import { NextResponse } from "next/server";
import { sanity } from "@/lib/sanity";

export async function GET() {
  try {
    const query = `
      *[_type == "service" && enabled == true]{
        _id,
        title,
        "slug": slug.current,
        serviceType,
        description,
        price,
        showPrice,
        popular,
        parentService->{ _id },

        // CATEGORY
        category->{
          title,
          "slug": slug.current,
          icon {
            "url": asset->url,
            alt
          }
        },

        // PROMO BOX
        promo {
        enabled,
        title,
        subtitle,
        buttonText,
        items,
        icon {
          asset->{
            url
          },
          alt
        }
      }
      }
    `;

    const services = await sanity.fetch(query);

    const parents = services.filter((s: any) => !s.parentService);
    const subs = services.filter((s: any) => s.parentService);

    parents.forEach((p: any) => {
      p.subservices = subs
        .filter((s: any) => s.parentService._id === p._id)
        .map((s: any) => ({
          title: s.title,
          slug: s.slug,
          description: s.description,
          price: s.price,
          showPrice: s.showPrice,
          popular: s.popular,
          serviceType: s.serviceType,

          promo: s.promo || null,
        }));
    });

    const grouped: any[] = [];

    for (const parent of parents) {
      const cat = parent.category?.title ?? "Other";
      const catSlug = parent.category?.slug;
      if (!catSlug) continue; // skip categories with no slug

      let bucket = grouped.find((g) => g.category === cat);
      if (!bucket) {
        bucket = {
          category: cat,
          categorySlug: catSlug,
          icon: parent.category?.icon ?? "tag",
          items: [],
        };
        grouped.push(bucket);
      }

      bucket.items.push({
        title: parent.title,
        slug: parent.slug,
        promo: parent.promo || null,   
        subservices: parent.subservices,
      });
    }

    return NextResponse.json(grouped);
  } catch (err) {
    console.error("API ERROR:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
