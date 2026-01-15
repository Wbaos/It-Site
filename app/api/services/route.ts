
import { NextResponse } from "next/server";
import { sanity } from "@/lib/sanity";


export async function GET() {
  try {
    // Fetch all service groups with promo and category
    const groupsQuery = `*[_type == "serviceGroup"]{
      _id,
      title,
      "slug": slug.current,
      description,
      order,
      promo {
        enabled,
        title,
        subtitle,
        buttonText,
        items,
        icon {
          asset->{url},
          alt
        }
      },
      category->{
        title,
        "slug": slug.current,
        icon {
          "url": asset->url,
          alt
        }
      }
    }`;

    // Fetch all services
    const servicesQuery = `*[_type == "service" && enabled == true]{
      _id,
      title,
      "slug": slug.current,
      serviceType,
      description,
      price,
      showPrice,
      popular,
      group->{_id}
    }`;

    const [groups, services] = await Promise.all([
      sanity.fetch(groupsQuery),
      sanity.fetch(servicesQuery)
    ]);

    // Group services by group _id
    const servicesByGroup: Record<string, any[]> = {};
    for (const srv of services) {
      const groupId = srv.group?._id;
      if (!groupId) continue;
      if (!servicesByGroup[groupId]) servicesByGroup[groupId] = [];
      servicesByGroup[groupId].push({
        title: srv.title,
        slug: srv.slug,
        description: srv.description,
        price: srv.price,
        showPrice: srv.showPrice,
        popular: srv.popular,
        serviceType: srv.serviceType,
      });
    }

    // Group by category
    const grouped: any[] = [];
    for (const group of groups) {
      const catTitle = group.category?.title;
      const catSlug = group.category?.slug;
      if (!catSlug) continue;

      let categoryBucket = grouped.find((g) => g.category === catTitle);
      if (!categoryBucket) {
        categoryBucket = {
          category: catTitle,
          categorySlug: catSlug,
          icon: group.category?.icon ?? "tag",
          groups: [],
        };
        grouped.push(categoryBucket);
      }

      categoryBucket.groups.push({
        title: group.title,
        slug: group.slug,
        description: group.description,
        promo: group.promo || null,
        services: servicesByGroup[group._id] || [],
      });
    }

    return NextResponse.json(grouped);
  } catch (err) {
    console.error("API ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load services" },
      { status: 500 }
    );
  }
}
