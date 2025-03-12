'use client';

import { useEffect } from 'react';
import { useToast } from './use-toast';

/**
 * A hook that implements anti-cheating measures for quizzes
 * Currently supports:
 * - Disabling copy/paste functionality
 * - Warning messages when attempting to copy/paste
 *
 * @param isEnabled - Boolean to control whether anti-cheat measures are active
 * @returns An object with the current state of anti-cheat measures
 */
export const useAntiCheat = (isEnabled: boolean = false) => {
	const { toast } = useToast();

	useEffect(() => {
		// Only apply anti-cheat measures if enabled
		if (!isEnabled) return;

		// Store original event handlers
		const originalCopy = document.oncopy;
		const originalCut = document.oncut;
		const originalPaste = document.onpaste;

		// Function to handle copy/cut/paste attempts
		const preventCopyPaste = (e: Event) => {
			e.preventDefault();
			toast({
				title: 'Action Blocked',
				description:
					'Copy and paste functions are disabled during the quiz.',
				variant: 'destructive',
			});
			return false;
		};

		// Disable copy/cut/paste
		document.oncopy = preventCopyPaste;
		document.oncut = preventCopyPaste;
		document.onpaste = preventCopyPaste;

		// Also add event listeners to catch browser-specific implementations
		document.addEventListener('copy', preventCopyPaste);
		document.addEventListener('cut', preventCopyPaste);
		document.addEventListener('paste', preventCopyPaste);

		// Cleanup function to restore original functionality
		return () => {
			document.oncopy = originalCopy;
			document.oncut = originalCut;
			document.onpaste = originalPaste;
			document.removeEventListener('copy', preventCopyPaste);
			document.removeEventListener('cut', preventCopyPaste);
			document.removeEventListener('paste', preventCopyPaste);
		};
	}, [isEnabled, toast]);

	return {
		isAntiCheatEnabled: isEnabled,
	};
};
