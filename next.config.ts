import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 's3.tebi.io',
				port: '',
				pathname: '/shuats-quiz-app/catalogue-pics/**',
			},
		],
	},
};

export default nextConfig;
