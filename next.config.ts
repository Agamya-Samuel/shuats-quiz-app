import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 2678400,
    formats: ['image/webp'],
    localPatterns: [],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-shuatsquiz.agamya.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'shuats.org',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Add webpack configuration to handle markdown files
  webpack: (config) => {
    // Add rule for markdown files
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });

    // Add HTML loader for email templates
    config.module.rules.push({
      test: /\.html$/,
      type: 'asset/source',
    });

    return config;
  },
  // need to investigate this, how safe is this?
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
};

export default nextConfig;
