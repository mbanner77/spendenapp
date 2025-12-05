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
      {
        protocol: 'https',
        hostname: 'lichtblicke.de',
        pathname: '/assets/**',
      },
      {
        protocol: 'https',
        hostname: 'www.diospi-suyana.de',
        pathname: '/wp-content/**',
      },
    ],
  },
}

module.exports = nextConfig
