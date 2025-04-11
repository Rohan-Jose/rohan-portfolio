/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/rohan-portfolio',
  images: {
    unoptimized: true,
  },
  eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 
