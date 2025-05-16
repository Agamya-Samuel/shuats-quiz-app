// app/layout.tsx

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/app/globals.css';
import { Toaster } from '@/components/ui/toaster';
import { CookieProvider } from '@/contexts/cookie-context';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
// Import the database initialization promise
import '@/lib/db-init';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'SHUATS National Talent Search Exam (SNTSE)',
	description: 'SHUATS National Talent Search Exam (SNTSE). An Online Quiz Competition to find the best talent in the field of Computer Science & Information Technology (DCS & IT). Developed by Department of Computer Science & Information Technology (DCS & IT), SHUATS.',
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Get token from cookie
	const cookieStore = await cookies();
	const token = cookieStore.get('token')?.value;

	// Verify token and get user data
	const user = token ? await verifyToken(token) : null;

	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				suppressHydrationWarning={true}
			>
				<CookieProvider token={token} user={user}>
					{children}
					<Toaster />
				</CookieProvider>
			</body>
		</html>
	);
}
