import { client } from "./sanity.client";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

export interface LocationTestimonial {
  name: string;
  text: string;
  rating: number;
}

export interface LocationStat {
  value: string;
  label: string;
}

export interface LocationAddress {
  street?: string;
  suite?: string;
  zipCode?: string;
}

export interface LocationHours {
  weekday?: string;
  weekend?: string;
  emergency?: string;
}

export interface LocationServiceRadius {
  miles?: number;
  population?: string;
}

export interface LocationPopularService {
  name: string;
  price: string;
  icon?: string;
  slug?: string;
}

export interface Location {
  _id: string;
  title: string;
  slug: { current: string };
  city: string;
  state: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  heroImage?: SanityImageSource;
  services?: string[];
  neighborhoods?: string[];
  testimonials?: LocationTestimonial[];
  stats?: LocationStat[];
  ctaTitle?: string;
  ctaDescription?: string;
  phone?: string;
  email?: string;
  address?: LocationAddress;
  hours?: LocationHours;
  serviceRadius?: LocationServiceRadius;
  whyChooseUs?: string[];
  popularServices?: LocationPopularService[];
  badges?: string[];
  isActive: boolean;
}

export async function getAllActiveLocations(): Promise<Location[]> {
  const query = `*[_type == "location" && isActive == true] | order(city asc) {
    _id,
    title,
    slug,
    city,
    state,
    description,
    metaTitle,
    metaDescription,
    heroImage,
    services,
    neighborhoods,
    testimonials,
    stats,
    ctaTitle,
    ctaDescription,
    phone,
    email,
    address,
    hours,
    serviceRadius,
    whyChooseUs,
    popularServices[]{
      "name": coalesce(service->name, service->title, service->serviceName),
      "price": coalesce(priceOverride, service->price),
      "icon": string(service->icon),
      "slug": service->slug.current
    },
    badges,
    isActive
  }`;
  
  return client.fetch(query);
}

export async function getLocationBySlug(slug: string): Promise<Location | null> {
  const query = `*[_type == "location" && slug.current == $slug && isActive == true][0] {
    _id,
    title,
    slug,
    city,
    state,
    description,
    metaTitle,
    metaDescription,
    heroImage,
    services,
    neighborhoods,
    testimonials,
    stats,
    ctaTitle,
    ctaDescription,
    phone,
    email,
    address,
    hours,
    serviceRadius,
    whyChooseUs,
    popularServices[]{
      "name": coalesce(service->name, service->title, service->serviceName),
      "price": coalesce(priceOverride, service->price),
      "icon": string(service->icon),
      "slug": service->slug.current
    },
    badges,
    isActive
  }`;
  
  return client.fetch(query, { slug });
}

export async function getAllLocationSlugs(): Promise<string[]> {
  const query = `*[_type == "location" && isActive == true].slug.current`;
  return client.fetch(query);
}
