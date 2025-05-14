import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn-shuatsquiz.agamya.dev',
				port: '',
				pathname: '/catalogue-pics/**',
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

		return config;
	},
};

export default nextConfig;
