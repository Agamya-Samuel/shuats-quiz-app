/**
 * A global loading spinner component
 * Displays a centered spinner with appropriate spacing and a customizable message
 * Can be used throughout the application as a consistent loading indicator
 */
'use client';

interface GlobalLoadingProps {
	message?: string;
	className?: string;
}

export default function GlobalLoading({
	message = 'Loading...',
	className = '',
}: GlobalLoadingProps) {
	return (
		<div
			className={`w-full h-full flex items-center justify-center ${className}`}
		>
			<div className="flex flex-col items-center gap-4">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
				<p className="text-gray-500 font-medium">{message}</p>
			</div>
		</div>
	);
}
