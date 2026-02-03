import { sanity } from "@/lib/sanity";

export type ApiService = {
  title: string;
  slug: string;
  description?: string;
  navDescription?: string;
  icon?: { alt?: string; asset?: { url?: string } };
  price?: number;
  showPrice?: boolean;
  pricingModel?: "flat" | "hourly";
  hourlyConfig?: {
    minimumHours?: number;
    maximumHours?: number;
    billingIncrement?: number;
  };
  popular?: boolean;
  serviceType?: string;
};

export type ApiGroup = {
  title: string;
  slug: string;
  description?: string;
  promo?: {
    enabled?: boolean;
    title?: string;
    subtitle?: string;
    buttonText?: string;
    items?: string[];
    icon?: { alt?: string; asset?: { url?: string } };
  };
  services: ApiService[];
};

export type ApiCategory = {
  category: string;
  categorySlug: string;
  icon?: any;
  groups: ApiGroup[];
};

export type RequestQuoteContent = {
  sidebarBenefitsTitle?: string;
  sidebarBenefits?: Array<{
    title?: string;
    desc?: string;
    icon?: { alt?: string; asset?: { url?: string } };
  }>;
  socialProof?: {
    icon?: { alt?: string; asset?: { url?: string } };
    quotesThisMonthText?: string;
    ratingValue?: number;
    reviewsText?: string;
  };
  immediateHelp?: {
    title?: string;
    subtitle?: string;
    phoneNumber?: string;
    phoneIcon?: { alt?: string; asset?: { url?: string } };
    phoneLabel?: string;
    phoneSubLabel?: string;
    chatLabel?: string;
    chatSubLabel?: string;
    chatUrl?: string;
    chatIcon?: { alt?: string; asset?: { url?: string } };
  };
};

export async function getServiceCategories(): Promise<ApiCategory[]> {
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
    navDescription,
    icon {
      asset->{url},
      alt
    },
    price,
    showPrice,
    pricingModel,
    hourlyConfig{minimumHours, maximumHours, billingIncrement},
    popular,
    group->{_id}
  }`;

  const [groups, services] = await Promise.all([
    sanity.fetch(groupsQuery),
    sanity.fetch(servicesQuery),
  ]);

  // Group services by group _id
  const servicesByGroup: Record<string, ApiService[]> = {};
  for (const srv of services as any[]) {
    const groupId = srv.group?._id;
    if (!groupId) continue;
    if (!servicesByGroup[groupId]) servicesByGroup[groupId] = [];
    servicesByGroup[groupId].push({
      title: srv.title,
      slug: srv.slug,
      description: srv.description,
      navDescription: srv.navDescription,
      icon: srv.icon,
      price: srv.price,
      showPrice: srv.showPrice,
      pricingModel: srv.pricingModel,
      hourlyConfig: srv.hourlyConfig,
      popular: srv.popular,
      serviceType: srv.serviceType,
    });
  }

  // Group by category
  const grouped: ApiCategory[] = [];
  for (const group of groups as any[]) {
    const catTitle = group.category?.title;
    const catSlug = group.category?.slug;
    if (!catSlug) continue;

    let categoryBucket = grouped.find((g) => g.categorySlug === catSlug);
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
      promo: group.promo,
      services: servicesByGroup[group._id] || [],
    });
  }

  return grouped;
}

export async function getRequestQuoteContent(): Promise<RequestQuoteContent | null> {
  const query = `*[_type == "requestQuotePage"][0]{
    sidebarBenefitsTitle,
    sidebarBenefits[]{
      title,
      desc,
      icon{
        alt,
        asset->{url}
      }
    },
    socialProof{
      icon{
        alt,
        asset->{url}
      },
      quotesThisMonthText,
      ratingValue,
      reviewsText
    },
    immediateHelp{
      title,
      subtitle,
      phoneNumber,
      phoneIcon{
        alt,
        asset->{url}
      },
      phoneLabel,
      phoneSubLabel,
      chatLabel,
      chatSubLabel,
      chatUrl,
      chatIcon{
        alt,
        asset->{url}
      }
    }
  }`;

  const data = await sanity.fetch(query);
  return (data ?? null) as RequestQuoteContent | null;
}
