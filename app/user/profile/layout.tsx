// app/user/profile/layout.tsx

import type { Metadata } from 'next';
import '@/app/globals.css';

export const metadata: Metadata = {
	title: 'SHUATS - Student Portal Profile',
	description: 'SHUATS - Student Portal Profile',
};

export default function UserProfileLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <div className={'antialiased'}>{children}</div>;
}

