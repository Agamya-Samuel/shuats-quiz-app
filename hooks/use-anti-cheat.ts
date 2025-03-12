'use client';

import { useEffect, useState } from 'react';
import { useToast } from './use-toast';

// Define interfaces for browser-specific document and element properties
interface DocumentWithFullscreen extends Document {
	webkitFullscreenElement?: Element;
	mozFullScreenElement?: Element;
	msFullscreenElement?: Element;
	webkitExitFullscreen?: () => Promise<void>;
	mozCancelFullScreen?: () => Promise<void>;
	msExitFullscreen?: () => Promise<void>;
}

interface HTMLElementWithFullscreen extends HTMLElement {
	webkitRequestFullscreen?: () => Promise<void>;
	mozRequestFullScreen?: () => Promise<void>;
	msRequestFullscreen?: () => Promise<void>;
}

/**
 * A hook that implements anti-cheating measures for quizzes
 * Currently supports:
 * - Disabling copy/paste functionality
 * - Disabling text selection
 * - Forcing full-screen mode during the quiz (with fallback for permission issues)
 * - Warning messages when attempting to exit full-screen, copy/paste, or select text
 *
 * @param isEnabled - Boolean to control whether anti-cheat measures are active
 * @returns An object with the current state of anti-cheat measures
 */
export const useAntiCheat = (isEnabled: boolean = false) => {
	const { toast } = useToast();
	const [fullscreenPermissionDenied, setFullscreenPermissionDenied] =
		useState(false);
	const [fullscreenExitAttempts, setFullscreenExitAttempts] = useState(0);

	useEffect(() => {
		// Only apply anti-cheat measures if enabled
		if (!isEnabled) return;

		// Cast document to include browser-specific properties
		const doc = document as DocumentWithFullscreen;

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

		// Function to handle full-screen change attempts
		const handleFullScreenChange = () => {
			// Check if we're still in full-screen mode
			if (
				!doc.fullscreenElement &&
				!doc.webkitFullscreenElement &&
				!doc.mozFullScreenElement &&
				!doc.msFullscreenElement
			) {
				// If fullscreen permission was previously denied, don't try again
				if (fullscreenPermissionDenied) {
					showFullscreenWarning();
					return;
				}

				// Track exit attempts
				setFullscreenExitAttempts((prev) => prev + 1);

				// If user has tried to exit too many times, show a stronger warning
				if (fullscreenExitAttempts >= 2) {
					showFullscreenWarning(true);
					return;
				}

				// Try to go back to full-screen with a slight delay to avoid permission errors
				setTimeout(() => {
					try {
						requestFullScreen(document.documentElement);
					} catch (err) {
						console.error('Error re-entering fullscreen:', err);
						setFullscreenPermissionDenied(true);
						showFullscreenWarning();
					}
				}, 500);
			}
		};

		// Function to show fullscreen warning
		const showFullscreenWarning = (severe = false) => {
			toast({
				title: severe
					? 'Warning: Full-Screen Required'
					: 'Full-Screen Recommended',
				description: severe
					? 'Exiting full-screen mode may be considered a violation of quiz rules.'
					: 'Please remain in full-screen mode for the duration of the quiz.',
				variant: severe ? 'destructive' : 'warning',
				duration: 5000,
			});
		};

		// Function to request full-screen mode with cross-browser support
		const requestFullScreen = (element: HTMLElement) => {
			const el = element as HTMLElementWithFullscreen;

			try {
				if (el.requestFullscreen) {
					el.requestFullscreen().catch((err) => {
						console.error('Error enabling full-screen mode:', err);
						setFullscreenPermissionDenied(true);
						showFullscreenWarning();
					});
				} else if (el.webkitRequestFullscreen) {
					el.webkitRequestFullscreen();
				} else if (el.mozRequestFullScreen) {
					el.mozRequestFullScreen();
				} else if (el.msRequestFullscreen) {
					el.msRequestFullscreen();
				}
			} catch (err) {
				console.error('Error requesting fullscreen:', err);
				setFullscreenPermissionDenied(true);
				showFullscreenWarning();
			}
		};

		// Disable copy/cut/paste
		document.oncopy = preventCopyPaste;
		document.oncut = preventCopyPaste;
		document.onpaste = preventCopyPaste;

		// Disable text selection
		document.onselectstart = preventSelection;

		// Apply CSS to prevent selection using standard property
		document.body.style.userSelect = 'none';

		// Add event listeners for copy/paste/selection
		document.addEventListener('copy', preventCopyPaste);
		document.addEventListener('cut', preventCopyPaste);
		document.addEventListener('paste', preventCopyPaste);
		document.addEventListener('selectstart', preventSelection);

		// Add event listeners for full-screen changes
		document.addEventListener('fullscreenchange', handleFullScreenChange);
		document.addEventListener(
			'webkitfullscreenchange',
			handleFullScreenChange
		);
		document.addEventListener(
			'mozfullscreenchange',
			handleFullScreenChange
		);
		document.addEventListener('MSFullscreenChange', handleFullScreenChange);

		// Request full-screen mode when anti-cheat is enabled
		// Wrap in a try-catch to handle any permission errors
		try {
			// Only request fullscreen on initial activation, not on re-renders
			if (!fullscreenPermissionDenied) {
				requestFullScreen(document.documentElement);
			}
		} catch (err) {
			console.error('Error requesting fullscreen on init:', err);
			setFullscreenPermissionDenied(true);
			showFullscreenWarning();
		}

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

			// Remove event listeners
			document.removeEventListener('copy', preventCopyPaste);
			document.removeEventListener('cut', preventCopyPaste);
			document.removeEventListener('paste', preventCopyPaste);
			document.removeEventListener('selectstart', preventSelection);

			// Remove full-screen event listeners
			document.removeEventListener(
				'fullscreenchange',
				handleFullScreenChange
			);
			document.removeEventListener(
				'webkitfullscreenchange',
				handleFullScreenChange
			);
			document.removeEventListener(
				'mozfullscreenchange',
				handleFullScreenChange
			);
			document.removeEventListener(
				'MSFullscreenChange',
				handleFullScreenChange
			);

			// Exit full-screen mode if we're in it
			try {
				if (
					doc.fullscreenElement ||
					doc.webkitFullscreenElement ||
					doc.mozFullScreenElement ||
					doc.msFullscreenElement
				) {
					if (doc.exitFullscreen) {
						doc.exitFullscreen().catch((err) => {
							console.error(
								'Error exiting full-screen mode:',
								err
							);
						});
					} else if (doc.webkitExitFullscreen) {
						doc.webkitExitFullscreen();
					} else if (doc.mozCancelFullScreen) {
						doc.mozCancelFullScreen();
					} else if (doc.msExitFullscreen) {
						doc.msExitFullscreen();
					}
				}
			} catch (err) {
				console.error('Error exiting fullscreen on cleanup:', err);
			}
		};
	}, [isEnabled, toast, fullscreenPermissionDenied, fullscreenExitAttempts]);

	return {
		isAntiCheatEnabled: isEnabled,
		fullscreenPermissionDenied,
	};
};
