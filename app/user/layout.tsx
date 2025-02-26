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
		<div className="flex flex-col">
			<ClientNavbar />
			<main>{children}</main>
		</div>
	);
}
