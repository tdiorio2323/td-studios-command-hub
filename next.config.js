/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' for Vercel API routes compatibility
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: [
      'localhost',
      'tdstudioshq.com',
      'app.tdstudioshq.com',
      'portal.tdstudioshq.com',
      'vercel.app'
    ],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN', // Changed for Wix integration
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://tdstudioshq.com',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/dashboard',
        permanent: true,
      },
      {
        source: '/',
        destination: '/dashboard',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig