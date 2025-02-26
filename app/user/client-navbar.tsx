'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';
import { useCookies } from '@/contexts/cookie-context';
import { getQuizResults } from '@/actions/question';

/**
 * Client component wrapper for Navbar
 * Handles path-based logic to determine when to show the timer
 */
export default function ClientNavbar() {
	const pathname = usePathname();
	const [showTimer, setShowTimer] = useState(false);
	const { user: currentUser } = useCookies();
	const [hasAttemptedQuiz, setHasAttemptedQuiz] = useState(false);

	// Check if user has already attempted the quiz
	useEffect(() => {
		const checkAttemptStatus = async () => {
			if (!currentUser?.userId) return;

			try {
				const response = await getQuizResults(currentUser.userId);
				if (
					response.success &&
					response.data &&
					response.data.results.length > 0
				) {
					setHasAttemptedQuiz(true);
				} else {
					setHasAttemptedQuiz(false);
				}
			} catch (err) {
				console.error('Error checking attempt status:', err);
				setHasAttemptedQuiz(false);
			}
		};

		checkAttemptStatus();
	}, [currentUser?.userId]);

	useEffect(() => {
		// Only show timer if on quiz page AND user hasn't attempted the quiz yet
		setShowTimer(pathname === '/user/quiz' && !hasAttemptedQuiz);
	}, [pathname, hasAttemptedQuiz]);

	return <Navbar showTime={showTimer} />;
}
