'use client';

import { useEffect } from 'react';
import { useToast } from './use-toast';

/**
 * A hook that implements anti-cheating measures for quizzes
 * Currently supports:
 * - Disabling copy/paste functionality
 * - Disabling text selection
 * - Warning messages when attempting to copy/paste or select text
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
		const originalSelectStart = document.onselectstart;

		// Store original CSS properties
		const originalUserSelect = document.body.style.userSelect;

		// Create a style element for cross-browser selection prevention
		const styleElement = document.createElement('style');
		styleElement.innerHTML = `
			body {
				user-select: none !important;
				-webkit-user-select: none !important;
				-moz-user-select: none !important;
				-ms-user-select: none !important;
			}
		`;
		document.head.appendChild(styleElement);

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

		// Function to prevent text selection
		const preventSelection = (e: Event) => {
			e.preventDefault();
			toast({
				title: 'Action Blocked',
				description: 'Text selection is disabled during the quiz.',
				variant: 'destructive',
			});
			return false;
		};

		// Disable copy/cut/paste
		document.oncopy = preventCopyPaste;
		document.oncut = preventCopyPaste;
		document.onpaste = preventCopyPaste;

		// Disable text selection
		document.onselectstart = preventSelection;

		// Apply CSS to prevent selection using standard property
		document.body.style.userSelect = 'none';

		// Also add event listeners to catch browser-specific implementations
		document.addEventListener('copy', preventCopyPaste);
		document.addEventListener('cut', preventCopyPaste);
		document.addEventListener('paste', preventCopyPaste);
		document.addEventListener('selectstart', preventSelection);

		// Cleanup function to restore original functionality
		return () => {
			document.oncopy = originalCopy;
			document.oncut = originalCut;
			document.onpaste = originalPaste;
			document.onselectstart = originalSelectStart;

			// Restore original CSS property
			document.body.style.userSelect = originalUserSelect;

			// Remove the style element
			if (styleElement.parentNode) {
				styleElement.parentNode.removeChild(styleElement);
			}

			document.removeEventListener('copy', preventCopyPaste);
			document.removeEventListener('cut', preventCopyPaste);
			document.removeEventListener('paste', preventCopyPaste);
			document.removeEventListener('selectstart', preventSelection);
		};
	}, [isEnabled, toast]);

	return {
		isAntiCheatEnabled: isEnabled,
	};
};
