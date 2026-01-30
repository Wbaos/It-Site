export type SelectedService = {
  categorySlug: string;
  groupSlug: string;
  serviceSlug: string;
  title: string;
};

export type SelectableService = SelectedService & {
  popular?: boolean;
  description?: string;
  navDescription?: string;
  icon?: { alt?: string; asset?: { url?: string } };
  price?: number;
  showPrice?: boolean;
};

export type UrgencyOptionId = "within-week" | "2-3-days" | "asap";

export type UrgencyOption = {
  id: UrgencyOptionId;
  label: string;
};
