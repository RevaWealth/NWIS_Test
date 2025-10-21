/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Redirect marketing pages to main site
  async redirects() {
    return [
      {
        source: '/about/:path*',
        destination: 'https://nwis.io/about/:path*',
        permanent: true,
      },
      {
        source: '/tokenomics',
        destination: 'https://nwis.io/tokenomics',
        permanent: true,
      },
      {
        source: '/institutions',
        destination: 'https://nwis.io/institutions',
        permanent: true,
      },
      {
        source: '/careers',
        destination: 'https://nwis.io/careers',
        permanent: true,
      },
      {
        source: '/contact',
        destination: 'https://nwis.io/contact',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
