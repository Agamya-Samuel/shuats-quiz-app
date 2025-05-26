import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
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
