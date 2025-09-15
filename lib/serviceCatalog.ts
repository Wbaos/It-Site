// lib/serviceCatalog.ts

export type SubItem = {
  title: string;
  slug: string;
};

export type NavService = {
  title: string;
  slug: string;
  subItems?: SubItem[];
};

export type NavCategory = {
  category: string;
  items: NavService[];
};

export const NAV_SERVICES: NavCategory[] = [
  {
    category: "Device Setup",
    items: [
      {
        title: "Phone & Tablet Setup",
        slug: "phone-tablet-setup",
        subItems: [
          { title: "iPhone Setup", slug: "iphone-setup" },
          { title: "Android Setup", slug: "android-setup" },
          { title: "Accessibility Setup", slug: "accessibility-setup" },
          { title: "Tablet Family Setup", slug: "tablet-family-setup" },
        ],
      },
      {
        title: "Computer Setup & Support",
        slug: "computer-support",
        subItems: [
          { title: "Windows PC Setup", slug: "windows-setup" },
          { title: "Mac Setup", slug: "mac-setup" },
          { title: "Printer Setup", slug: "printer-setup" },
          { title: "Data Transfer", slug: "data-transfer" },
        ],
      },
      {
        title: "Smart TV & Streaming Setup",
        slug: "smart-tv-streaming",
        subItems: [
          { title: "Netflix & Streaming", slug: "streaming-setup" },
          { title: "Cable / Firestick Setup", slug: "firestick-setup" },
        ],
      },
    ],
  },
  {
    category: "Home & Internet",
    items: [
      { title: "Wi-Fi & Internet Fixes", slug: "wifi-internet" },
      { title: "Smart Home Devices", slug: "smart-home-devices" },
    ],
  },
];
