'use client';

import { useEffect, useState } from 'react';
import { useToast } from './use-toast';
import React from 'react';

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

// Global variable to track intentional fullscreen exit
// This is needed because the safeExitFullscreen function is called outside the hook
let isIntentionallyExiting = false;

/**
 * A hook that implements anti-cheating measures for quizzes
 * Currently supports:
 * - Disabling copy/paste functionality
 * - Disabling text selection
 * - Disabling inspect element and developer tools
 * - Warning messages when attempting to use these features
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
	// Add a ref to track when we're intentionally exiting fullscreen
	const intentionallyExitingRef = React.useRef(false);

	useEffect(() => {
		// Only apply anti-cheat measures if enabled
		if (!isEnabled) return;

		try {
			// Cast document to include browser-specific properties
			const doc = document as DocumentWithFullscreen;

			// Store original event handlers
			const originalCopy = document.oncopy;
			const originalCut = document.oncut;
			const originalPaste = document.onpaste;
			const originalSelectStart = document.onselectstart;
			const originalContextMenu = document.oncontextmenu;
			const originalKeyDown = document.onkeydown;

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
				try {
					e.preventDefault();
					toast({
						title: 'Action Blocked',
						description:
							'Copy and paste functions are disabled during the quiz.',
						variant: 'destructive',
					});
					return false;
				} catch (err) {
					console.error('Error in preventCopyPaste:', err);
					return false;
				}
			};

			// Function to prevent text selection
			const preventSelection = (e: Event) => {
				try {
					e.preventDefault();
					toast({
						title: 'Action Blocked',
						description:
							'Text selection is disabled during the quiz.',
						variant: 'destructive',
					});
					return false;
				} catch (err) {
					console.error('Error in preventSelection:', err);
					return false;
				}
			};

			// Function to prevent right-click context menu
			const preventContextMenu = (e: Event) => {
				try {
					e.preventDefault();
					toast({
						title: 'Action Blocked',
						description:
							'Right-click menu is disabled during the quiz.',
						variant: 'destructive',
					});
					return false;
				} catch (err) {
					console.error('Error in preventContextMenu:', err);
					return false;
				}
			};

			// Function to prevent keyboard shortcuts for developer tools
			const preventDevTools = (e: KeyboardEvent) => {
				try {
					// Prevent F12 key
					if (e.key === 'F12' || e.keyCode === 123) {
						e.preventDefault();
						showDevToolsWarning();
						return false;
					}

					// Prevent Ctrl+Shift+I / Cmd+Option+I (Inspect Element)
					if (
						(e.ctrlKey &&
							e.shiftKey &&
							(e.key === 'I' ||
								e.key === 'i' ||
								e.keyCode === 73)) ||
						(e.metaKey &&
							e.altKey &&
							(e.key === 'I' ||
								e.key === 'i' ||
								e.keyCode === 73))
					) {
						e.preventDefault();
						showDevToolsWarning();
						return false;
					}

					// Prevent Ctrl+Shift+J / Cmd+Option+J (Console)
					if (
						(e.ctrlKey &&
							e.shiftKey &&
							(e.key === 'J' ||
								e.key === 'j' ||
								e.keyCode === 74)) ||
						(e.metaKey &&
							e.altKey &&
							(e.key === 'J' ||
								e.key === 'j' ||
								e.keyCode === 74))
					) {
						e.preventDefault();
						showDevToolsWarning();
						return false;
					}

					// Prevent Ctrl+Shift+C / Cmd+Option+C (Inspector)
					if (
						(e.ctrlKey &&
							e.shiftKey &&
							(e.key === 'C' ||
								e.key === 'c' ||
								e.keyCode === 67)) ||
						(e.metaKey &&
							e.altKey &&
							(e.key === 'C' ||
								e.key === 'c' ||
								e.keyCode === 67))
					) {
						e.preventDefault();
						showDevToolsWarning();
						return false;
					}

					// Prevent Ctrl+U / Cmd+Option+U (View Source)
					if (
						(e.ctrlKey &&
							(e.key === 'U' ||
								e.key === 'u' ||
								e.keyCode === 85)) ||
						(e.metaKey &&
							e.altKey &&
							(e.key === 'U' ||
								e.key === 'u' ||
								e.keyCode === 85))
					) {
						e.preventDefault();
						showDevToolsWarning();
						return false;
					}

					return true;
				} catch (err) {
					console.error('Error in preventDevTools:', err);
					return true;
				}
			};

			// Function to show dev tools warning
			const showDevToolsWarning = () => {
				try {
					toast({
						title: 'Action Blocked',
						description:
							'Developer tools are disabled during the quiz.',
						variant: 'destructive',
					});
				} catch (err) {
					console.error('Error in showDevToolsWarning:', err);
				}
			};

			// Set up DevTools detection using console.clear trick
			const devToolsDetector = () => {
				try {
					const widthThreshold =
						window.outerWidth - window.innerWidth > 160;
					const heightThreshold =
						window.outerHeight - window.innerHeight > 160;

					if (widthThreshold || heightThreshold) {
						showDevToolsWarning();
					}
				} catch (err) {
					console.error('Error in devToolsDetector:', err);
				}
			};

			// Function to handle full-screen change attempts
			const handleFullScreenChange = () => {
				try {
					// If we're intentionally exiting, don't try to re-enter
					if (
						intentionallyExitingRef.current ||
						isIntentionallyExiting
					) {
						return;
					}

					// Check if we're still in full-screen mode
					if (
						!doc.fullscreenElement &&
						!doc.webkitFullscreenElement &&
						!doc.mozFullScreenElement &&
						!doc.msFullscreenElement
					) {
						// If anti-cheat is disabled or being disabled, don't try to re-enter fullscreen
						if (!isEnabled) {
							return;
						}

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
								// Double-check that anti-cheat is still enabled before requesting fullscreen
								if (
									isEnabled &&
									!intentionallyExitingRef.current &&
									!isIntentionallyExiting
								) {
									requestFullScreen(document.documentElement);
								}
							} catch (err) {
								console.error(
									'Error re-entering fullscreen:',
									err
								);
								setFullscreenPermissionDenied(true);
								showFullscreenWarning();
							}
						}, 500);
					}
				} catch (err) {
					console.error('Error in handleFullScreenChange:', err);
					// Mark as denied to prevent further attempts that might cause errors
					setFullscreenPermissionDenied(true);
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
				// If anti-cheat is disabled, don't try to enter fullscreen
				if (!isEnabled) {
					return;
				}

				// If permission was already denied, don't try again
				if (fullscreenPermissionDenied) {
					return;
				}

				const el = element as HTMLElementWithFullscreen;

				try {
					if (el.requestFullscreen) {
						// Wrap in try-catch to handle permission errors
						try {
							el.requestFullscreen().catch((err) => {
								console.error(
									'Error enabling full-screen mode:',
									err
								);
								// Mark as denied to prevent further attempts
								setFullscreenPermissionDenied(true);
								showFullscreenWarning();
							});
						} catch (err) {
							console.error(
								'Permission error requesting fullscreen:',
								err
							);
							setFullscreenPermissionDenied(true);
							showFullscreenWarning();
						}
					} else if (el.webkitRequestFullscreen) {
						try {
							el.webkitRequestFullscreen();
						} catch (err) {
							console.error(
								'Permission error with webkitRequestFullscreen:',
								err
							);
							setFullscreenPermissionDenied(true);
							showFullscreenWarning();
						}
					} else if (el.mozRequestFullScreen) {
						try {
							el.mozRequestFullScreen();
						} catch (err) {
							console.error(
								'Permission error with mozRequestFullScreen:',
								err
							);
							setFullscreenPermissionDenied(true);
							showFullscreenWarning();
						}
					} else if (el.msRequestFullscreen) {
						try {
							el.msRequestFullscreen();
						} catch (err) {
							console.error(
								'Permission error with msRequestFullscreen:',
								err
							);
							setFullscreenPermissionDenied(true);
							showFullscreenWarning();
						}
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

			// Disable right-click menu
			document.oncontextmenu = preventContextMenu;

			// Disable keyboard shortcuts
			document.onkeydown = preventDevTools;

			// Apply CSS to prevent selection using standard property
			document.body.style.userSelect = 'none';

			// Add event listeners for copy/paste/selection
			document.addEventListener('copy', preventCopyPaste);
			document.addEventListener('cut', preventCopyPaste);
			document.addEventListener('paste', preventCopyPaste);
			document.addEventListener('selectstart', preventSelection);
			document.addEventListener('contextmenu', preventContextMenu);
			document.addEventListener('keydown', preventDevTools);

			// Add event listeners for full-screen changes
			document.addEventListener(
				'fullscreenchange',
				handleFullScreenChange
			);
			document.addEventListener(
				'webkitfullscreenchange',
				handleFullScreenChange
			);
			document.addEventListener(
				'mozfullscreenchange',
				handleFullScreenChange
			);
			document.addEventListener(
				'MSFullscreenChange',
				handleFullScreenChange
			);

			// Set up interval to detect DevTools
			const devToolsInterval = setInterval(devToolsDetector, 1000);

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
				try {
					document.oncopy = originalCopy;
					document.oncut = originalCut;
					document.onpaste = originalPaste;
					document.onselectstart = originalSelectStart;
					document.oncontextmenu = originalContextMenu;
					document.onkeydown = originalKeyDown;

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
					document.removeEventListener(
						'selectstart',
						preventSelection
					);
					document.removeEventListener(
						'contextmenu',
						preventContextMenu
					);
					document.removeEventListener('keydown', preventDevTools);

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

					// Clear the DevTools detection interval
					clearInterval(devToolsInterval);

					// Exit full-screen mode if we're in it
					try {
						if (
							doc.fullscreenElement ||
							doc.webkitFullscreenElement ||
							doc.mozFullScreenElement ||
							doc.msFullscreenElement
						) {
							// Set the flag to indicate we're intentionally exiting
							intentionallyExitingRef.current = true;

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
						console.error(
							'Error exiting fullscreen on cleanup:',
							err
						);
					}
				} catch (err) {
					console.error('Error in anti-cheat cleanup:', err);
				}
			};
		} catch (err) {
			console.error('Error setting up anti-cheat measures:', err);
			return () => {}; // Return empty cleanup function in case of error
		}
	}, [isEnabled, toast, fullscreenPermissionDenied, fullscreenExitAttempts]);

	return {
		isAntiCheatEnabled: isEnabled,
		fullscreenPermissionDenied,
		setIntentionallyExiting: (value: boolean) => {
			intentionallyExitingRef.current = value;
		},
	};
};

/**
 * Helper function to safely exit fullscreen mode
 * This can be called directly when the quiz is submitted
 */
export const safeExitFullscreen = () => {
	try {
		// Set the global flag to indicate we're intentionally exiting
		isIntentionallyExiting = true;

		const doc = document as DocumentWithFullscreen;

		// Check if document is defined (for SSR safety)
		if (typeof document === 'undefined') {
			return;
		}

		// Check if we're in fullscreen mode
		const isInFullscreen = !!(
			doc.fullscreenElement ||
			doc.webkitFullscreenElement ||
			doc.mozFullScreenElement ||
			doc.msFullscreenElement
		);

		if (!isInFullscreen) {
			// Already not in fullscreen, no need to exit
			return;
		}

		// Try to exit fullscreen with the appropriate method
		if (doc.exitFullscreen) {
			try {
				doc.exitFullscreen().catch((err) => {
					// Silently catch the error to prevent it from bubbling up
					console.error('Error exiting full-screen mode:', err);
					isIntentionallyExiting = false;
				});
			} catch (err) {
				console.error('Error calling exitFullscreen:', err);
				isIntentionallyExiting = false;
			}
		} else if (doc.webkitExitFullscreen) {
			try {
				doc.webkitExitFullscreen();
			} catch (err) {
				console.error('Error calling webkitExitFullscreen:', err);
				isIntentionallyExiting = false;
			}
		} else if (doc.mozCancelFullScreen) {
			try {
				doc.mozCancelFullScreen();
			} catch (err) {
				console.error('Error calling mozCancelFullScreen:', err);
				isIntentionallyExiting = false;
			}
		} else if (doc.msExitFullscreen) {
			try {
				doc.msExitFullscreen();
			} catch (err) {
				console.error('Error calling msExitFullscreen:', err);
				isIntentionallyExiting = false;
			}
		}

		// Reset the flag after a short delay
		setTimeout(() => {
			isIntentionallyExiting = false;
		}, 1000);
	} catch (err) {
		// Catch any unexpected errors
		console.error('Unexpected error exiting fullscreen:', err);
		isIntentionallyExiting = false;
	}
};
