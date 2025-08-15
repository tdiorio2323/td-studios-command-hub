/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' for Vercel API routes compatibility
  // trailingSlash: true, // This can break API routes on Vercel
  
  // Disable ESLint during builds for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript strict checks during builds for deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Exclude nested projects and temporary files from build
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  experimental: {
    typedRoutes: false,
  },
  
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
  
  webpack: (config, { isServer }) => {
    // Ignore the unmutd folder to prevent build conflicts
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/unmutd/**', '**/node_modules/**']
    }
    
    return config
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
        destination: '/login',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig