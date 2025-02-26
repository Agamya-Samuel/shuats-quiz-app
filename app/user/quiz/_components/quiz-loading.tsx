/**
 * A loading spinner component for the quiz interface
 * Displays a centered spinner with appropriate spacing
 */
export default function QuizLoading() {
	return (
		<div className="w-full h-full flex items-center justify-center">
			<div className="flex flex-col items-center gap-4">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
				<p className="text-gray-500 font-medium">Loading quiz...</p>
			</div>
		</div>
	);
}
