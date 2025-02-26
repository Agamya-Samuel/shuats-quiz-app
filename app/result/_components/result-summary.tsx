import { Card, CardContent } from '@/components/ui/card';

export interface ResultSummaryProps {
	summary: {
		totalQuestions: number;
		attemptedQuestions: number;
		correctAnswers: number;
		score: number;
		submittedAt: string;
	};
}

export default function ResultSummary({ summary }: ResultSummaryProps) {
	const {
		totalQuestions,
		attemptedQuestions,
		correctAnswers,
		score,
		submittedAt,
	} = summary;
	const attemptedPercentage = (attemptedQuestions / totalQuestions) * 100;
	const accuracy = (correctAnswers / attemptedQuestions) * 100;

	return (
		<Card className="mb-8">
			<CardContent className="p-6">
				<h2 className="text-2xl font-bold mb-6 text-center">
					Quiz Results Summary
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div className="text-center p-4 bg-gray-50 rounded-lg">
						<h3 className="text-lg font-semibold mb-2">
							Total Questions
						</h3>
						<p className="text-3xl font-bold">{totalQuestions}</p>
					</div>
					<div className="text-center p-4 bg-gray-50 rounded-lg">
						<h3 className="text-lg font-semibold mb-2">
							Attempted
						</h3>
						<p className="text-3xl font-bold">
							{attemptedQuestions}
						</p>
						<p className="text-sm text-gray-600">
							({attemptedPercentage.toFixed(1)}%)
						</p>
					</div>
					<div className="text-center p-4 bg-gray-50 rounded-lg">
						<h3 className="text-lg font-semibold mb-2">
							Correct Answers
						</h3>
						<p className="text-3xl font-bold">{correctAnswers}</p>
						<p className="text-sm text-gray-600">
							{attemptedQuestions > 0
								? `(${accuracy.toFixed(1)}% accuracy)`
								: '(0% accuracy)'}
						</p>
					</div>
					<div className="text-center p-4 bg-gray-50 rounded-lg">
						<h3 className="text-lg font-semibold mb-2">
							Final Score
						</h3>
						<p className="text-3xl font-bold">{score}</p>
					</div>
					<div className="text-center p-4 bg-gray-50 rounded-lg">
						<h3 className="text-lg font-semibold mb-2">
							Submitted At
						</h3>
						<p className="text-lg">
							{new Date(submittedAt).toLocaleString()}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
