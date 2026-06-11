/** @type {import('next').NextConfig} */
const nextConfig = {
  // pdf-parse / pdfjs-dist must run as native Node modules — webpack breaks them
  experimental: {
    serverComponentsExternalPackages: [
      "pdf-parse",
      "pdfjs-dist",
      "@napi-rs/canvas",
      "mammoth",
    ],
  },
  async redirects() {
    return [
      { source: "/about", destination: "/global-talent", permanent: true },
      { source: "/services", destination: "/", permanent: true },
      { source: "/case-studies", destination: "/customers", permanent: true },
      { source: "/case-studies/:slug", destination: "/customers", permanent: true },
      { source: "/career-consultation", destination: "/book-consultation", permanent: true },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
