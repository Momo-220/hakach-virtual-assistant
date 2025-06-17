/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  compress: true,
  poweredByHeader: false,
  images: {
    domains: ['widget.hakach.com'],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/gemini/:path*',
        destination: 'https://hakach.net/api/gemini/:path*',
      },
    ];
  },
  webpack: (config, { dev, isServer }) => {
    // Ajout de résolutions pour React
    config.resolve.alias = {
      ...config.resolve.alias,
      // Suppression des alias Preact qui causaient des problèmes
    };

    return config;
  },
}

module.exports = nextConfig 