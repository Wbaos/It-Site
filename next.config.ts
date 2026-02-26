import type { NextConfig } from "next";

/** @type {NextConfig} */
const nextConfig: NextConfig = {
  // ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Images
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    formats: ["image/avif", "image/webp"],
    unoptimized: false,
  },

  // 🔹 REDIRECTS (FIXES GOOGLE SMART TV ISSUE)
  async redirects() {
    return [
      // 🔹 Existing TV Redirects
      {
        source: "/services/smart-tv",
        destination: "/services/tv-mounting-and-setup",
        permanent: true,
      },
      {
        source: "/services/tv-mounting",
        destination: "/services/tv-mounting-and-setup",
        permanent: true,
      },
      {
        source: "/services/large-tv",
        destination: "/services/tv-mounting-and-setup",
        permanent: true,
      },
      {
        source: "/services/small-tv-mounting-up-to-32",
        destination: "/services/small-tv-up-to-32",
        permanent: true,
      },
      {
        source: "/services/standard-tv",
        destination: "/services/tv-mounting-and-setup",
        permanent: true,
      },

      // 🔹 Removed / Old Services Redirect Cleanup
      {
        source: "/services/wi-fi-network-setup",
        destination: "/services/wifi-and-internet",
        permanent: true,
      },
      {
        source: "/services/virus-malware-removal",
        destination: "/services/computer-and-printers",
        permanent: true,
      },
      {
        source: "/services/smart-home-device",
        destination: "/services/smart-home",
        permanent: true,
      },
      {
        source: "/services/computer",
        destination: "/services/computer-and-printers",
        permanent: true,
      },
    ];
  },

  // Security Headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
         {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com blob:",
              "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://api.stripe.com https://cdn.sanity.io https://speed.cloudflare.com",
              "img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com https:",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              "frame-src https://js.stripe.com https://www.googletagmanager.com",
            ].join("; "),
          },
        ],
      },
    ];
  },

  // Misc
  poweredByHeader: false,
  reactStrictMode: true,

  // SVG Support
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
