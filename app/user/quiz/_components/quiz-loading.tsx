/**
 * A loading spinner component for the quiz interface
 * Displays a centered spinner with appropriate spacing and a customizable message
 */
interface QuizLoadingProps {
	message?: string;
}

export default function QuizLoading({
	message = 'Loading quiz...',
}: QuizLoadingProps) {
	return (
		<div className="w-full h-full flex items-center justify-center">
			<div className="flex flex-col items-center gap-4">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
				<p className="text-gray-500 font-medium">{message}</p>
			</div>
		</div>
	);
}
