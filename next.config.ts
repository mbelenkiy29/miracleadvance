import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The brief called for next.config.js; this project was scaffolded with the
    // TypeScript variant, so the config lives here instead.
    //
    // Photography is hotlinked from the Unsplash CDN rather than committed to
    // the repo, so sources in lib/images.ts can be swapped without shipping new
    // binary assets. Scoped to the image CDN host only.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
