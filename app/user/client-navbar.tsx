'use client';

import Navbar from '@/components/navbar';

/**
 * Client component wrapper for Navbar
 * Note: Timer has been moved to the quiz interface and removed from navbar
 */
export default function ClientNavbar() {
	// Always pass false for showTime to never show the timer in the navbar
	// The timer is now displayed directly in the quiz interface
	return (
		<div className="container mx-auto px-4 max-w-5xl">
			<Navbar showTime={false} />
		</div>
	);
}
