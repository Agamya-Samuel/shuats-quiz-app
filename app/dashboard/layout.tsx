// app/dashboard/layout.tsx

import type { Metadata } from 'next';
import '@/app/globals.css';
import { Sidebar } from '@/components/Sidebar';

export const metadata: Metadata = {
	title: 'SHUATS - Student Portal Dashboard',
	description: 'SHUATS - Student Portal Dashboard',
};

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
	);
}
