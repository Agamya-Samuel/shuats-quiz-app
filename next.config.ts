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
};

export default nextConfig;
