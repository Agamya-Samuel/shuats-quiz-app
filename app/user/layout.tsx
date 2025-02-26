import type { Metadata } from 'next';
import ClientNavbar from './client-navbar';

export const metadata: Metadata = {
	title: 'SHUATS - Student Portal',
	description: 'SHUATS - Student Portal',
};

export default function UserLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="min-h-screen flex flex-col">
			<ClientNavbar />
			<main className="flex-grow">{children}</main>
		</div>
	);
}
