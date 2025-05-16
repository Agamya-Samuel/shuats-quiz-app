// app/user/quiz/page.tsx
'use client';

import QuizInterface from '@/app/user/quiz/_components/quiz-interface';
import { useCookies } from '@/contexts/cookie-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import GlobalLoading from '@/components/global-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function QuizPage() {
	const { user: currentUser } = useCookies();
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Redirect to login if user is not authenticated
	useEffect(() => {
		try {
			if (!currentUser?.userId) {
				router.push('/login');
			} else {
				setLoading(false);
			}
		} catch (err) {
			console.error('Error in authentication check:', err);
			setError(
				'There was a problem checking your login status. Please try refreshing the page.'
			);
			setLoading(false);
		}
	}, [currentUser?.userId, router]);

	// Error fallback
	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
				<Card className="w-full max-w-md">
					<CardContent className="p-6">
						<div className="text-center">
							<h2 className="text-xl font-semibold mb-4">
								Error
							</h2>
							<p className="text-muted-foreground mb-6">
								{error}
							</p>
							<Button
								onClick={() => window.location.reload()}
								className="mr-2"
							>
								Refresh Page
							</Button>
							<Button
								variant="outline"
								onClick={() => router.push('/user')}
							>
								Return to Dashboard
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	// If user is not authenticated, show loading while redirecting
	if (loading) {
		return <GlobalLoading />;
	}

	return (
		<div className="bg-gray-50 min-h-[calc(100vh-111px)]">
			<QuizInterface />
		</div>
	);
}
