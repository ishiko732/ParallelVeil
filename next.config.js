/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "github.com", "dummyimage.com"],
  },
  experimental: {
    appDir: true,
    serverActions: true,
  },
};

module.exports = nextConfig
