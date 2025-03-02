import { Card, CardContent } from '@/components/ui/card';
import { OptionsMapping } from '@/app/user/quiz/_components/quiz-interface';
import { CheckCircle2, XCircle, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MarkdownPreview } from '@/components/markdown-preview';
import { subjects } from '@/lib/constants';

interface QuizResult {
	questionId: string;
	question: string;
	options: Array<{ id: number; text: string }>;
	correctOptionId: number | null;
	userSelectedOptionId: number | null;
	isCorrect: boolean;
	subject?: string;
}

interface ResultDetailsProps {
	results: QuizResult[];
}

// Helper function to get subject name from key
const getSubjectName = (subjectKey: string): string => {
	const subject = subjects.find(s => s.key === subjectKey);
	return subject ? subject.value : subjectKey;
};

export default function ResultDetails({ results }: ResultDetailsProps) {
	return (
		<div>
			<h3 className="text-xl font-semibold mb-6">Detailed Analysis</h3>

			{/* Grid layout for questions */}
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
				{results.map((result, index) => (
					<Card key={result.questionId} className="overflow-hidden h-full flex flex-col">
						<CardContent className="p-4 flex-1 flex flex-col">
							{/* Question Header */}
							<div className="flex items-start justify-between mb-3">
								<div className="flex-1">
									<h4 className="text-base font-medium flex items-center">
										<span className="mr-2">Question {index + 1}</span>
										<span className="ml-auto">
											{result.isCorrect ? (
												<CheckCircle2 className="w-5 h-5 text-green-500" />
											) : (
												<XCircle className="w-5 h-5 text-red-500" />
											)}
										</span>
									</h4>
									{result.subject && (
										<div className="flex items-center text-xs text-muted-foreground mt-1">
											<BookOpen className="w-3 h-3 mr-1" />
											<span>{getSubjectName(result.subject)}</span>
										</div>
									)}
								</div>
							</div>

							{/* Question Content */}
							<div className="mb-3 flex-grow">
								<div className="text-sm">
									<MarkdownPreview
										content={result.question}
										className="prose-sm max-w-none"
									/>
								</div>
							</div>

							{/* Options */}
							<div className="space-y-2 mt-auto">
								{result.options.map((option) => {
									const isCorrect =
										option.id === result.correctOptionId;
									const isSelected =
										option.id === result.userSelectedOptionId;

									return (
										<div
											key={option.id}
											className={cn('p-2 rounded-lg border text-sm', {
												'bg-green-50 border-green-200':
													isCorrect,
												'bg-red-50 border-red-200':
													isSelected && !isCorrect,
												'border-gray-200':
													!isSelected && !isCorrect,
											})}
										>
											<div className="flex items-start">
												<span className="font-medium mr-1 mt-0.5">
													{OptionsMapping[option.id]})
												</span>
												<span
													className={cn('flex-1', {
														'text-green-700': isCorrect,
														'text-red-700':
															isSelected &&
															!isCorrect,
													})}
												>
													<MarkdownPreview
														content={option.text}
														className="inline prose-sm max-w-none"
													/>
												</span>
											</div>
										</div>
									);
								})}
							</div>

							{/* Explanation - Simplified for grid view */}
							{!result.isCorrect &&
								result.userSelectedOptionId &&
								result.correctOptionId && (
									<div className="mt-3 text-xs text-gray-600 border-t pt-2">
										<p>
											<span className="font-medium">Your:</span>{' '}
											{result.userSelectedOptionId &&
												OptionsMapping[
													result.userSelectedOptionId
												]}
											{' '}
											<span className="font-medium ml-2">Correct:</span>{' '}
											{OptionsMapping[result.correctOptionId]}
										</p>
									</div>
								)}
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
