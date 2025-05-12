
import type { Metadata } from 'next';
import '@/app/globals.css';

export const metadata: Metadata = {
	title: 'SHUATS - Super Admin Portal',
	description: 'SHUATS Quiz App Super Admin Portal',
};

export default function SuperAdminLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <div className="antialiased">{children}</div>;
}
