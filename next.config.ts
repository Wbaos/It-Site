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
        source: "/services/small-tv",
        destination: "/services/tv-mounting-and-setup",
        permanent: true,
      },
      {
        source: "/services/standard-tv",
        destination: "/services/tv-mounting-and-setup",
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
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
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
