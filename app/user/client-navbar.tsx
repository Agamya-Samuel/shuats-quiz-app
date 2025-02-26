'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/navbar';

/**
 * Client component wrapper for Navbar
 * Handles path-based logic to determine when to show the timer
 */
export default function ClientNavbar() {
	const pathname = usePathname();
	const [showTimer, setShowTimer] = useState(false);

	useEffect(() => {
		// Check if the current path is the quiz page
		setShowTimer(pathname === '/user/quiz');
	}, [pathname]);

	return <Navbar showTime={showTimer} />;
}
