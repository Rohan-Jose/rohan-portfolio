/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/rohan-portfolio',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rohan-jose.github.io',
        pathname: '/rohan-portfolio/**',
      },
    ],
  },
  eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 
