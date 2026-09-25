import type { NextConfig } from "next";

// Static export for GitHub Pages. The workflow sets BASE_PATH=/<repository>.
const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.BASE_PATH ?? "",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
