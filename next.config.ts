import path from "path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this directory. There is a stray package-lock.json
  // in a parent folder, and when Next finds more than one lockfile it walks up
  // and picks the outermost — it was selecting the parent, not this project.
  // That root is what output file tracing uses to decide which files ship with
  // a serverless function, so leaving it wrong risks /api/apply going out
  // without the deps it needs. Also silences the build warning.
  outputFileTracingRoot: path.join(__dirname),

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
