'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function ManageQuizRedirectPage() {
	const router = useRouter();
	const searchParams = useSearchParams();

	// Keep the existing tab parameter if present
	const tab = searchParams.get('tab') || 'list';

	useEffect(() => {
		// Redirect to the main admin page with manage-quiz section and preserve tab
		router.push(`/admin?section=manage-quiz&tab=${tab}`);
	}, [router, tab]);

	return (
		<div className="flex items-center justify-center h-screen">
			<div className="flex flex-col items-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
				<p className="mt-4 text-muted-foreground">
					Redirecting to manage quiz...
				</p>
			</div>
		</div>
	);
}
