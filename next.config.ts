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
        source: "/services/small-tv-mounting-up-to-32",
        destination: "/services/small-tv-up-to-32",
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
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },

          // ✅ ADD THIS
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
              "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com",
              "img-src 'self' data: https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              "frame-src 'self'",
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
