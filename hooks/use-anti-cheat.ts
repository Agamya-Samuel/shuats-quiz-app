'use client';

import { useEffect } from 'react';
import { useToast } from './use-toast';

/**
 * A hook that implements anti-cheating measures for quizzes
 * Currently supports:
 * - Disabling copy/paste functionality
 * - Disabling text selection
 * - Disabling inspect element and developer tools
 * - Warning messages when attempting to use these features
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

		// Function to prevent right-click context menu
		const preventContextMenu = (e: Event) => {
			e.preventDefault();
			toast({
				title: 'Action Blocked',
				description: 'Right-click menu is disabled during the quiz.',
				variant: 'destructive',
			});
			return false;
		};

		// Function to prevent keyboard shortcuts for developer tools
		const preventDevTools = (e: KeyboardEvent) => {
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
					(e.key === 'I' || e.key === 'i' || e.keyCode === 73)) ||
				(e.metaKey &&
					e.altKey &&
					(e.key === 'I' || e.key === 'i' || e.keyCode === 73))
			) {
				e.preventDefault();
				showDevToolsWarning();
				return false;
			}

			// Prevent Ctrl+Shift+J / Cmd+Option+J (Console)
			if (
				(e.ctrlKey &&
					e.shiftKey &&
					(e.key === 'J' || e.key === 'j' || e.keyCode === 74)) ||
				(e.metaKey &&
					e.altKey &&
					(e.key === 'J' || e.key === 'j' || e.keyCode === 74))
			) {
				e.preventDefault();
				showDevToolsWarning();
				return false;
			}

			// Prevent Ctrl+Shift+C / Cmd+Option+C (Inspector)
			if (
				(e.ctrlKey &&
					e.shiftKey &&
					(e.key === 'C' || e.key === 'c' || e.keyCode === 67)) ||
				(e.metaKey &&
					e.altKey &&
					(e.key === 'C' || e.key === 'c' || e.keyCode === 67))
			) {
				e.preventDefault();
				showDevToolsWarning();
				return false;
			}

			// Prevent Ctrl+U / Cmd+Option+U (View Source)
			if (
				(e.ctrlKey &&
					(e.key === 'U' || e.key === 'u' || e.keyCode === 85)) ||
				(e.metaKey &&
					e.altKey &&
					(e.key === 'U' || e.key === 'u' || e.keyCode === 85))
			) {
				e.preventDefault();
				showDevToolsWarning();
				return false;
			}

			return true;
		};

		// Function to show dev tools warning
		const showDevToolsWarning = () => {
			toast({
				title: 'Action Blocked',
				description: 'Developer tools are disabled during the quiz.',
				variant: 'destructive',
			});
		};

		// Set up DevTools detection using console.clear trick
		const devToolsDetector = () => {
			const widthThreshold = window.outerWidth - window.innerWidth > 160;
			const heightThreshold =
				window.outerHeight - window.innerHeight > 160;

			if (widthThreshold || heightThreshold) {
				showDevToolsWarning();
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

		// Set up interval to detect DevTools
		const devToolsInterval = setInterval(devToolsDetector, 1000);

		// Cleanup function to restore original functionality
		return () => {
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
			document.removeEventListener('selectstart', preventSelection);
			document.removeEventListener('contextmenu', preventContextMenu);
			document.removeEventListener('keydown', preventDevTools);

			// Clear the DevTools detection interval
			clearInterval(devToolsInterval);
		};
	}, [isEnabled, toast]);

	return {
		isAntiCheatEnabled: isEnabled,
	};
};
