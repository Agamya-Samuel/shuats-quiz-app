'use client';

import { useEffect } from 'react';
import Navbar from '@/components/navbar';
import { useCookies } from '@/contexts/cookie-context';
import { getQuizResults } from '@/actions/question';

/**
 * Client component wrapper for Navbar
 * Note: Timer has been moved to the quiz interface and removed from navbar
 */
export default function ClientNavbar() {
	const { user: currentUser } = useCookies();

	// Check if user has already attempted the quiz - kept for future reference
	useEffect(() => {
		const checkAttemptStatus = async () => {
			if (!currentUser?.userId) return;

			try {
				const response = await getQuizResults(currentUser.userId);
				// We're not using this state anymore, but keeping the check for future reference
				if (
					response.success &&
					response.data &&
					response.data.results.length > 0
				) {
					// User has attempted the quiz
				} else {
					// User has not attempted the quiz
				}
			} catch (err) {
				console.error('Error checking attempt status:', err);
			}
		};

		checkAttemptStatus();
	}, [currentUser?.userId]);

	// Always pass false for showTime to never show the timer in the navbar
	// The timer is now displayed directly in the quiz interface
	return <Navbar showTime={false} />;
}
