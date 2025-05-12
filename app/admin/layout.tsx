import type { Metadata } from 'next';
import '@/app/globals.css';

export const metadata: Metadata = {
	title: 'SHUATS - Admin Portal',
	description: 'SHUATS Quiz App Admin Portal',
};

export default function AdminLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <div className="antialiased">{children}</div>;
}
