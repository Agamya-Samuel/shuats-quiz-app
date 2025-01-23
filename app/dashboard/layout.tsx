// app/dashboard/layout.tsx

import type { Metadata } from 'next';
import '@/app/globals.css';

export const metadata: Metadata = {
	title: 'SHUATS - Student Portal Dashboard',
	description: 'SHUATS - Student Portal Dashboard',
};

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <div className={'antialiased'}>{children}</div>;
}
