'use client';

import { useEffect } from 'react';
import Navbar from '@/components/navbar';
import { useCookies } from '@/contexts/cookie-context';
import { getQuizResults } from '@/actions/quiz';
import { usePathname } from 'next/navigation';

/**
 * Client component wrapper for Navbar
 * Note: Timer has been moved to the quiz interface and removed from navbar
 */
export default function ClientNavbar() {
	const { user: currentUser } = useCookies();
	const pathname = usePathname();

	// Only check attempt status on quiz-related pages
	const isQuizRelatedPage =
		pathname?.includes('/quiz') || pathname?.includes('/result');

	// Check if user has already attempted the quiz - kept for future reference
	useEffect(() => {
		// Skip this check on document-upload and other non-quiz pages
		if (!isQuizRelatedPage) return;

		const checkAttemptStatus = async () => {
			if (!currentUser?.userId) return;

			try {
				// Convert userId from string to number
				const response = await getQuizResults(
					Number(currentUser.userId)
				);

				// Check if the user has attempted the quiz based on the actual response structure
				if (
					response.success &&
					response.results &&
					response.results.questions.length > 0
				) {
					// User has attempted the quiz
					console.log('User has attempted the quiz');
				} else {
					// User has not attempted the quiz
					console.log('User has not attempted the quiz yet');
				}
			} catch (err) {
				console.error('Error checking attempt status:', err);
			}
		};

		checkAttemptStatus();
	}, [currentUser?.userId, isQuizRelatedPage, pathname]);

	// Always pass false for showTime to never show the timer in the navbar
	// The timer is now displayed directly in the quiz interface
	return (
		<div className="container mx-auto px-4 max-w-5xl">
			<Navbar showTime={false} />
		</div>
	);
}
