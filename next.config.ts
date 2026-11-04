import type { NextConfig } from "next";

/** @type {NextConfig} */
const nextConfig: NextConfig = {
  // ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Client router cache: back/forward navigation to dynamic pages (e.g.
  // service pages) must restore instantly from cache instead of refetching
  // the RSC payload on every back press, which on slower mobile connections
  // leaves a visible gap/flash during the transition. 30s is enough for
  // navigation bursts; a hard reload always fetches fresh content. Static
  // pages keep Next's 300s default, stated explicitly.
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 300,
    },
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
      // Cleanup 2026-11-03: no cart, checkout, login, accounts, notifications,
      // bookings or plans anymore (call + in-person quote only). Old URLs go
      // to the quote form instead of 404ing.
      { source: "/cart", destination: "/request-quote", permanent: true },
      { source: "/checkout", destination: "/request-quote", permanent: true },
      { source: "/login", destination: "/request-quote", permanent: true },
      { source: "/signup", destination: "/request-quote", permanent: true },
      { source: "/forgot-password", destination: "/request-quote", permanent: true },
      { source: "/account", destination: "/request-quote", permanent: true },
      { source: "/account/:path*", destination: "/request-quote", permanent: true },
      { source: "/book/:path*", destination: "/request-quote", permanent: true },
      { source: "/plans/:path*", destination: "/request-quote", permanent: true },
      { source: "/services/:slug/book/:path*", destination: "/request-quote", permanent: true },
      { source: "/success", destination: "/request-quote", permanent: true },
      { source: "/cancel", destination: "/request-quote", permanent: true },
      { source: "/thank-you", destination: "/request-quote", permanent: true },
      { source: "/reviews/write", destination: "/contact", permanent: true },
      { source: "/es/carrito", destination: "/es/solicita-una-cotizacion", permanent: true },
      { source: "/es/pago", destination: "/es/solicita-una-cotizacion", permanent: true },
      { source: "/es/iniciar-sesion", destination: "/es/solicita-una-cotizacion", permanent: true },
      { source: "/es/registrarse", destination: "/es/solicita-una-cotizacion", permanent: true },
      { source: "/es/olvido-contrasena", destination: "/es/solicita-una-cotizacion", permanent: true },
      { source: "/es/cuenta", destination: "/es/solicita-una-cotizacion", permanent: true },

      {
        source: "/services/smart-tv",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/tv-mounting",
        destination: "/services",
        permanent: true,
      },
        {
        source: "/services/tv-mounting-and-setup",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/large-tv",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/small-tv-mounting-up-to-32",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/standard-tv",
        destination: "/services",
        permanent: true,
      },

      {
        source: "/services/wi-fi-network-setup",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/virus-malware-removal",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/smart-home-device",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/computer",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/senior-tech-help",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/senior-help",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/computer-and-printer-support",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/blog/home-office-setup-guide",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog/network-infrastructure-upgrade-when-and-why",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog/how-to-set-up-your-new-phone-or-tablet-like-a-pro",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/blog/tree-trimming-near-me-miami",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/services/internet-setup",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/modem-and-router-replacement",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/new-wi-fi",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/router-modem-relocation-or-upgrade",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/whole-home-wi-fi-assessment",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/wi-fi-access-point-extender",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/wi-fi-speed-boost",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/wi-fi-troubleshooting",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/computer-setup",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/printer-troubleshooting",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/wireless-printer-setup",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/large-tv-61",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/small-tv-up-to-32",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/standard-tv-33-60",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/wifi-and-internet",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/computer-and-printers",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/tv-wall-mount-installation-services",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/speed-test",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/assessment/free-wi-fi-speed-and-coverage-assessment",
        destination: "/assessment",
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
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
         {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://googleads.g.doubleclick.net https://www.googleadservices.com https://js.stripe.com blob:",
              "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://googleads.g.doubleclick.net https://stats.g.doubleclick.net https://ad.doubleclick.net https://www.googleadservices.com https://www.google.com https://api.stripe.com https://cdn.sanity.io https://celkrwoq.apicdn.sanity.io https://celkrwoq.api.sanity.io",
              "img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net https:",
              "media-src 'self' https://cdn.sanity.io",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              "frame-src https://js.stripe.com https://www.googletagmanager.com https://googleads.g.doubleclick.net",
              "object-src 'none'",
              "base-uri 'self'",
              "frame-ancestors 'self'",
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
