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

// Navigation catalog (for Navbar dropdowns)
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

// Full service catalog with details
export const SERVICES: Record<
  string,
  {
    title: string;
    image: string;
    price: number;
    description: string;
    details?: string[];
    faqs?: { q: string; a: string }[];
    testimonials?: {
      name: string;
      text: string;
      date: string;
      rating: number;
    }[];
    questions?: {
      id: string;
      label: string;
      shortLabel?: string;

      type: "checkbox" | "radio" | "text" | "select";
      extraCost?: number;
      options?: { label: string; value: string; extraCost?: number }[];
    }[];

    parent?: { category: string; service: string; slug: string };
  }
> = {
  // Parent
  "phone-tablet-setup": {
    title: "Phone & Tablet Setup",
    image: "/PhoneSetuP.png",
    price: 49,
    description:
      "We’ll set up your smartphone or tablet so it’s easy and safe to use.",
    details: [
      "iPhone & Android configuration",
      "Contacts, email, and calendar setup",
      "Accessibility features for seniors",
      "App installations & tutorials",
    ],
    faqs: [
      { q: "How long does setup take?", a: "Most setups take 30–45 minutes." },
      {
        q: "Do I need to buy anything extra?",
        a: "No, just have your device charged.",
      },
    ],
    testimonials: [
      {
        name: "Ana N.",
        text: "They set up my mom’s iPhone and added bigger text — she can finally read her messages!",
        date: "2025-05-12",
        rating: 5,
      },
    ],
  },

  // Subservices
  "iphone-setup": {
    title: "iPhone Setup",
    parent: {
      category: "Device Setup",
      service: "Phone & Tablet Setup",
      slug: "phone-tablet-setup",
    },
    image: "/PhoneSetuP.png",
    price: 1,
    description:
      "We configure your iPhone with Apple ID, iCloud, email, FaceTime, and accessibility features.",
    details: [
      "Apple ID & iCloud setup",
      "Email, contacts, and calendar sync",
      "FaceTime & iMessage configuration",
      "Accessibility setup (text size, voiceover, etc.)",
    ],
    faqs: [
      { q: "Can you transfer my data?", a: "Yes, from old iPhone or Android." },
      { q: "Do I need my Apple ID?", a: "Yes, please have it ready." },
    ],
    testimonials: [
      {
        name: "Luis R.",
        text: "They moved everything from my old iPhone to my new one — smooth and stress-free!",
        date: "2025-04-28",
        rating: 5,
      },
    ],
    questions: [
      {
        id: "icloud-setup",
        label: "Do you also need iCloud setup?",
        shortLabel: "Icloud setup",
        type: "checkbox",
        extraCost: 20,
      },
      {
        id: "email-setup",
        label: "Do you also want us to configure email?",
        shortLabel: "Configure email",

        type: "checkbox",
        extraCost: 1,
      },
      {
        id: "data-transfer",
        label: "Need data transfer from old phone?",
        shortLabel: "Data transfer",

        type: "checkbox",
        extraCost: 25,
      },
    ],
  },

  "android-setup": {
    title: "Android Setup",
    image: "/PhoneSetuP.png",
    price: 35,
    description:
      "We set up your Android phone with Google account, apps, email, and data transfer.",
    details: [
      "Google account setup & sync",
      "Contacts, Gmail, and calendar setup",
      "Play Store apps installation",
      "Data transfer from old device",
    ],
    faqs: [
      {
        q: "Will my WhatsApp chats transfer?",
        a: "Yes, if you back them up in Google Drive.",
      },
      {
        q: "Can you move photos?",
        a: "Yes, we’ll transfer your gallery to the new phone.",
      },
    ],
    testimonials: [
      {
        name: "Marta G.",
        text: "Got my new Samsung ready with all my apps and contacts in no time!",
        date: "2025-03-11",
        rating: 5,
      },
    ],
  },

  "accessibility-setup": {
    title: "Accessibility Setup",
    image: "/Accessibility.png",
    price: 29,
    description:
      "We enable accessibility features for seniors or people with vision/hearing challenges.",
    details: [
      "Large text & high contrast mode",
      "VoiceOver / TalkBack setup",
      "Hearing aid compatibility",
      "Easy shortcuts for daily use",
    ],
    faqs: [
      {
        q: "Can you make it easier for my mom to read messages?",
        a: "Yes, larger text and higher contrast help a lot.",
      },
    ],
    testimonials: [
      {
        name: "George K.",
        text: "My dad can now use his phone thanks to the bigger text and voice assistant.",
        date: "2025-02-17",
        rating: 5,
      },
    ],
  },

  "tablet-family-setup": {
    title: "Tablet Family Setup",
    image: "/TabletSetup.png",
    price: 45,
    description:
      "We prepare tablets for family sharing — safe for kids, easy for grandparents.",
    details: [
      "Parental controls & app restrictions",
      "Multiple user profiles",
      "Video call setup (Zoom, WhatsApp, FaceTime)",
      "Entertainment apps (YouTube, Netflix, Disney+)",
    ],
    faqs: [
      {
        q: "Can you lock apps for kids?",
        a: "Yes, we set up parental controls.",
      },
      {
        q: "Do you install streaming apps?",
        a: "Yes, Netflix, Disney+, Prime Video, and more.",
      },
    ],
    testimonials: [
      {
        name: "Elisa M.",
        text: "Now my kids have their profiles and my parents can video call easily — all on one tablet!",
        date: "2025-01-22",
        rating: 5,
      },
    ],
  },
};
