/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'realcore.info',
        pathname: '/bilder/**',
      },
    ],
  },
}

module.exports = nextConfig
