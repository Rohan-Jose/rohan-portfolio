import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/rohan-portfolio',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
