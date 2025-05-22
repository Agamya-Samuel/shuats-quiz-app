import { cn } from '@/lib/utils';
import React from 'react';

// Skeleton component for displaying loading states
// We're extending HTMLAttributes to inherit all standard div properties
type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
	return (
		<div
			className={cn(
				'animate-pulse rounded-md bg-gray-200 dark:bg-gray-700',
				className
			)}
			{...props}
		/>
	);
}
