import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'delirio.com.br',
        pathname: '/wp-content/**',
      },
    ],
  },
}

export default nextConfig
