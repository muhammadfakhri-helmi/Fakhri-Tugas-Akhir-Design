import type { NextConfig } from "next";

// Static export for GitHub Pages. The workflow sets BASE_PATH=/<repository>.
const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.BASE_PATH ?? "",
  trailingSlash: true,
  images: { unoptimized: true },
  // Two root layouts ("/" English, "/id/" Indonesian) have no single layout to
  // compose a 404 from, so app/global-not-found.tsx provides a bilingual one.
  experimental: { globalNotFound: true },
};

export default nextConfig;
