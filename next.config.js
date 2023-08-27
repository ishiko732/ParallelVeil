/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['localhost', "github.com"],
    },
    experimental: {
        appDir: true,
        serverActions: true,
    },
}

module.exports = nextConfig
