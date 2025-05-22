import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<div className="container mx-auto py-8 px-4">
			<Skeleton className="h-10 w-1/3 mb-6" />
			<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
				<div className="space-y-4">
					<Skeleton className="h-8 w-3/4" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-3/4" />
					<Skeleton className="h-8 w-1/2 mt-6" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-5/6" />
					<Skeleton className="h-8 w-2/3 mt-6" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
				</div>
			</div>
		</div>
	);
}
