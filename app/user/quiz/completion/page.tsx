'use client';

import QuizCompletion from '@/app/user/quiz/_components/quiz-completion';
import { useCookies } from '@/contexts/cookie-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CompletionPage() {
	const { user: currentUser } = useCookies();
	const router = useRouter();

	// Redirect to login if user is not authenticated
	useEffect(() => {
		if (!currentUser?.userId) {
			router.push('/login');
		}
	}, [currentUser?.userId, router]);

	// If user is not authenticated, show nothing while redirecting
	if (!currentUser?.userId) {
		return null;
	}

	return <QuizCompletion />;
}
