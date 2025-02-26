import { Card, CardContent } from '@/components/ui/card';
import { OptionsMapping } from '@/app/user/quiz/_components/quiz-interface';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizResult {
	questionId: string;
	question: string;
	options: Array<{ id: number; text: string }>;
	correctOptionId: number | null;
	userSelectedOptionId: number | null;
	isCorrect: boolean;
}

interface ResultDetailsProps {
	results: QuizResult[];
}

export default function ResultDetails({ results }: ResultDetailsProps) {
	return (
		<div className="space-y-6">
			<h3 className="text-xl font-semibold mb-4">Detailed Analysis</h3>

			{results.map((result, index) => (
				<Card key={result.questionId} className="overflow-hidden">
					<CardContent className="p-6">
						{/* Question Header */}
						<div className="flex items-start justify-between mb-4">
							<div className="flex-1">
								<h4 className="text-lg font-medium">
									Question {index + 1}
								</h4>
								<p className="mt-2">{result.question}</p>
							</div>
							<div className="ml-4">
								{result.isCorrect ? (
									<CheckCircle2 className="w-6 h-6 text-green-500" />
								) : (
									<XCircle className="w-6 h-6 text-red-500" />
								)}
							</div>
						</div>

						{/* Options */}
						<div className="space-y-3 mt-4">
							{result.options.map((option) => {
								const isCorrect =
									option.id === result.correctOptionId;
								const isSelected =
									option.id === result.userSelectedOptionId;

								return (
									<div
										key={option.id}
										className={cn('p-3 rounded-lg border', {
											'bg-green-50 border-green-200':
												isCorrect,
											'bg-red-50 border-red-200':
												isSelected && !isCorrect,
											'border-gray-200':
												!isSelected && !isCorrect,
										})}
									>
										<div className="flex items-center">
											<span className="font-medium mr-2">
												{OptionsMapping[option.id]})
											</span>
											<span
												className={cn({
													'text-green-700': isCorrect,
													'text-red-700':
														isSelected &&
														!isCorrect,
												})}
											>
												{option.text}
											</span>
										</div>
									</div>
								);
							})}
						</div>

						{/* Explanation */}
						{!result.isCorrect &&
							result.userSelectedOptionId &&
							result.correctOptionId && (
								<div className="mt-4 text-sm text-gray-600">
									<p>
										<span className="font-medium">
											Your answer:
										</span>{' '}
										{result.userSelectedOptionId &&
											OptionsMapping[
												result.userSelectedOptionId
											]}
									</p>
									<p>
										<span className="font-medium">
											Correct answer:
										</span>{' '}
										{OptionsMapping[result.correctOptionId]}
									</p>
								</div>
							)}
					</CardContent>
				</Card>
			))}
		</div>
	);
}
