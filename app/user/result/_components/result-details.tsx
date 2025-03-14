import { Card, CardContent } from '@/components/ui/card';
import { OptionsMapping } from '@/app/user/quiz/_components/quiz-interface';
import { CheckCircle2, XCircle, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MarkdownPreview } from '@/components/markdown-preview';
import { subjects } from '@/lib/constants';
import { useState } from 'react';

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
	const subject = subjects.find((s) => s.key === subjectKey);
	return subject ? subject.value : subjectKey;
};

export default function ResultDetails({ results }: ResultDetailsProps) {
	const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

	// Group results by subject
	const resultsBySubject: Record<string, QuizResult[]> = {};
	results.forEach((result) => {
		const subject = result.subject || 'Unknown';
		if (!resultsBySubject[subject]) {
			resultsBySubject[subject] = [];
		}
		resultsBySubject[subject].push(result);
	});

	// Get list of subjects
	const subjectList = Object.keys(resultsBySubject).sort();

	// Filter results by selected subject or show all if none selected
	const filteredResults = selectedSubject
		? resultsBySubject[selectedSubject]
		: results;

	// Calculate subject statistics
	const subjectStats = subjectList.map((subject) => {
		const subjectResults = resultsBySubject[subject];
		const total = subjectResults.length;
		const correct = subjectResults.filter((r) => r.isCorrect).length;
		const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

		return {
			subject,
			total,
			correct,
			percentage,
		};
	});

	return (
		<div>
			<h3 className="text-xl font-semibold mb-6">Detailed Analysis</h3>

			{/* Subject filter */}
			{subjectList.length > 1 && (
				<div className="mb-6">
					<h4 className="text-sm font-medium mb-2">
						Filter by Subject:
					</h4>
					<div className="flex flex-wrap gap-2">
						<button
							onClick={() => setSelectedSubject(null)}
							className={cn(
								'px-3 py-1 rounded-full text-sm font-medium transition-colors',
								selectedSubject === null
									? 'bg-primary text-white'
									: 'bg-gray-100 hover:bg-gray-200'
							)}
						>
							All Subjects
						</button>
						{subjectList.map((subject) => (
							<button
								key={subject}
								onClick={() => setSelectedSubject(subject)}
								className={cn(
									'px-3 py-1 rounded-full text-sm font-medium transition-colors',
									selectedSubject === subject
										? 'bg-primary text-white'
										: 'bg-gray-100 hover:bg-gray-200'
								)}
							>
								{getSubjectName(subject)}
							</button>
						))}
					</div>
				</div>
			)}

			{/* Subject statistics */}
			{subjectList.length > 1 && (
				<div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{subjectStats.map((stat) => (
						<Card
							key={stat.subject}
							className={cn(
								'overflow-hidden',
								selectedSubject === stat.subject
									? 'ring-2 ring-primary'
									: ''
							)}
						>
							<CardContent className="p-4">
								<h4 className="font-medium flex items-center">
									<BookOpen className="w-4 h-4 mr-2" />
									{getSubjectName(stat.subject)}
								</h4>
								<div className="mt-2 grid grid-cols-3 gap-2 text-center">
									<div>
										<p className="text-xs text-gray-500">
											Questions
										</p>
										<p className="font-medium">
											{stat.total}
										</p>
									</div>
									<div>
										<p className="text-xs text-gray-500">
											Correct
										</p>
										<p className="font-medium">
											{stat.correct}
										</p>
									</div>
									<div>
										<p className="text-xs text-gray-500">
											Score
										</p>
										<p
											className={cn(
												'font-medium',
												stat.percentage >= 70
													? 'text-green-600'
													: stat.percentage >= 40
													? 'text-amber-600'
													: 'text-red-600'
											)}
										>
											{stat.percentage}%
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{/* Grid layout for questions */}
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
				{filteredResults.map((result, index) => (
					<Card
						key={result.questionId}
						className={cn(
							'overflow-hidden h-full flex flex-col',
							result.subject === selectedSubject
								? 'ring-2 ring-primary/30'
								: ''
						)}
					>
						<CardContent className="p-4 flex-1 flex flex-col">
							{/* Question Header */}
							<div className="flex items-start justify-between mb-3">
								<div className="flex-1">
									<h4 className="text-base font-medium flex items-center">
										<span className="mr-2">
											Question {index + 1}
										</span>
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
											<span>
												{getSubjectName(result.subject)}
											</span>
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
										option.id ===
										result.userSelectedOptionId;

									return (
										<div
											key={option.id}
											className={cn(
												'p-2 rounded-lg border text-sm',
												{
													'bg-green-50 border-green-200':
														isCorrect,
													'bg-red-50 border-red-200':
														isSelected &&
														!isCorrect,
													'border-gray-200':
														!isSelected &&
														!isCorrect,
												}
											)}
										>
											<div className="flex items-start">
												<span className="font-medium mr-1 mt-0.5">
													{OptionsMapping[option.id]})
												</span>
												<span
													className={cn('flex-1', {
														'text-green-700':
															isCorrect,
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
											<span className="font-medium">
												Your:
											</span>{' '}
											{result.userSelectedOptionId &&
												OptionsMapping[
													result.userSelectedOptionId
												]}{' '}
											<span className="font-medium ml-2">
												Correct:
											</span>{' '}
											{
												OptionsMapping[
													result.correctOptionId
												]
											}
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
