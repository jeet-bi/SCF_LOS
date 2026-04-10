/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@los-scf/types'],
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;
