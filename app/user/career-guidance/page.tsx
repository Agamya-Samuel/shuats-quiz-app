'use client';

import { useState, useEffect } from 'react';
import { getCareerGuidance } from '@/actions/career-guidance';
import { MarkdownPreview } from '@/components/markdown-preview';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Info, Printer } from 'lucide-react';

export default function CareerGuidancePage() {
	const [content, setContent] = useState<string>('');
	const [isLoading, setIsLoading] = useState(true);
	const [streamedContent, setStreamedContent] = useState<string>('');

	useEffect(() => {
		async function fetchGuidance() {
			try {
				setIsLoading(true);
				const response = await getCareerGuidance();
				setContent(response);
			} catch (error) {
				console.error('Failed to fetch career guidance:', error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchGuidance();
	}, []);

	// Text streaming effect
	useEffect(() => {
		if (!content || isLoading) return;

		let index = 0;
		const interval = setInterval(() => {
			if (index <= content.length) {
				setStreamedContent(content.slice(0, index));
				index += 5; // Adjust speed by changing this value
			} else {
				clearInterval(interval);
			}
		}, 10);

		return () => clearInterval(interval);
	}, [content, isLoading]);

	// Handle print functionality
	const handlePrint = () => {
		window.print();
	};

	return (
		<div className="container mx-auto py-8 px-4">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Career Guidance</h1>
				<Button
					onClick={handlePrint}
					variant="outline"
					className="flex items-center gap-2 print:hidden"
				>
					<Printer className="h-4 w-4" />
					Print
				</Button>
			</div>

			{content.includes('No subjects selected') ? (
				<Alert className="mb-6 bg-amber-50 border-amber-200 print:bg-white print:border-black">
					<Info className="h-4 w-4 text-amber-500" />
					<AlertDescription className="text-sm text-amber-700 print:text-black">
						Please select subjects in the Quiz section first to
						receive personalized career guidance. Your career
						guidance will be based on your subject preferences.
					</AlertDescription>
				</Alert>
			) : null}

			<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-6 print:shadow-none print:border print:border-gray-200">
				{isLoading ? (
					<div className="space-y-4">
						<Skeleton className="h-8 w-3/4" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-8 w-1/2 mt-6" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
					</div>
				) : (
					<div className="prose dark:prose-invert max-w-none print:prose-black">
						<MarkdownPreview content={streamedContent} />
					</div>
				)}
			</div>
		</div>
	);
}
