'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardRedirectPage() {
	const router = useRouter();

	useEffect(() => {
		// Redirect to the main admin page with dashboard section
		router.push('/admin?section=dashboard');
	}, [router]);

	return (
		<div className="flex items-center justify-center h-screen">
			<div className="flex flex-col items-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
				<p className="mt-4 text-muted-foreground">
					Redirecting to dashboard...
				</p>
			</div>
		</div>
	);
}
