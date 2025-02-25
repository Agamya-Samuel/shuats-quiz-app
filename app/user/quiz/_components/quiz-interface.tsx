// app/user/quiz/_components/quiz-interface.tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getAllQuestions } from '@/actions/question';
import { submitAnswer, submitQuiz } from '@/actions/submit-answers';
import Legend from './legend';
import QuizQuestionView from './quiz-question-view';
import { cn } from '@/lib/utils';
import LoadingState from '@/components/loading-component';
import { useToast } from '@/hooks/use-toast';
import { useCookies } from '@/contexts/cookie-context';

// Types
export interface Option {
	id: number;
	text: string;
}

export interface Question {
	_id: string;
	text: string;
	options: Option[];
	status:
		| 'not-visited'
		| 'not-answered'
		| 'answered'
		| 'marked-review'
		| 'answered-marked';
	userAnswer?: string;
}

export const OptionsMapping: Record<number, string> = {
	1: 'A',
	2: 'B',
	3: 'C',
	4: 'D',
};

// Error Component
const ErrorState = ({
	message,
	retry,
}: {
	message: string;
	retry: () => void;
}) => (
	<Card className="w-full">
		<CardContent className="p-6">
			<div className="text-center text-red-500">
				<h3 className="text-lg font-semibold mb-2">Error</h3>
				<p>{message}</p>
				<Button variant="outline" className="mt-4" onClick={retry}>
					Retry
				</Button>
			</div>
		</CardContent>
	</Card>
);

export default function QuizInterface() {
	const { toast } = useToast();
	const [questions, setQuestions] = useState<Question[]>([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [selectedAnswer, setSelectedAnswer] = useState<string>('');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [answers, setAnswers] = useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { user: currentUser } = useCookies();

	// Load answers from localStorage on mount
	useEffect(() => {
		const savedAnswers = localStorage.getItem('quiz_answers');
		if (savedAnswers) {
			try {
				const parsed = JSON.parse(savedAnswers);
				setAnswers(parsed);
			} catch (err) {
				console.error('Error parsing saved answers:', err);
			}
		}
	}, []);

	// Save answers to localStorage whenever they change
	useEffect(() => {
		if (Object.keys(answers).length > 0) {
			localStorage.setItem('quiz_answers', JSON.stringify(answers));
		}
	}, [answers]);

	const fetchQuestions = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const response = await getAllQuestions();

			if (response.success && Array.isArray(response.questions)) {
				const initializedQuestions = response.questions.map(
					(q, index) => ({
						...q,
						status: index === 0 ? 'not-answered' : 'not-visited',
						userAnswer: undefined,
					})
				);
				setQuestions(initializedQuestions as Question[]);
			} else {
				throw new Error(response.error || 'Failed to fetch questions');
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchQuestions();
	}, [fetchQuestions]);

	// Auto-save answer to server
	const autoSaveAnswer = useCallback(
		async (questionId: string, answer: string) => {
			if (!currentUser?.userId) return;

			try {
				const optionId = questions[currentQuestionIndex].options.find(
					(opt) => opt.text === answer
				)?.id;

				if (!optionId) return;

				const result = await submitAnswer(
					currentUser.userId,
					questionId,
					optionId
				);

				if (!result.success) {
					console.error('Auto-save failed:', result.message);
				}
			} catch (err) {
				console.error('Error auto-saving answer:', err);
			}
		},
		[currentUser?.userId, questions, currentQuestionIndex]
	);

	// Handle final quiz submission
	const handleSubmit = async () => {
		if (!currentUser?.userId) {
			toast({
				title: 'Error',
				description: 'You must be logged in to submit the quiz',
				variant: 'destructive',
			});
			return;
		}

		const unansweredCount = questions.filter(
			(q) => q.status === 'not-visited' || q.status === 'not-answered'
		).length;

		if (unansweredCount > 0) {
			const confirm = window.confirm(
				`You have ${unansweredCount} unanswered questions. Are you sure you want to submit?`
			);
			if (!confirm) return;
		}

		try {
			setIsSubmitting(true);

			// Format answers for submission
			const formattedAnswers = Object.entries(answers)
				.map(([questionId, answer]) => {
					const question = questions.find(
						(q) => q._id === questionId
					);
					const optionId = question?.options.find(
						(opt) => opt.text === answer
					)?.id;
					return {
						questionId,
						selectedOptionId: optionId || 0,
					};
				})
				.filter((a) => a.selectedOptionId > 0);

			const result = await submitQuiz(
				currentUser.userId,
				formattedAnswers
			);

			if (result.success) {
				toast({
					title: 'Quiz Submitted',
					description:
						'Your answers have been recorded successfully.',
				});
				// Clear local storage after successful submission
				localStorage.removeItem('quiz_answers');
			} else {
				throw new Error(result.message);
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: 'An unknown error occurred';
			toast({
				title: 'Submission Failed',
				description: `There was an error submitting your quiz: ${errorMessage}`,
				variant: 'destructive',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) return <LoadingState />;
	if (error) return <ErrorState message={error} retry={fetchQuestions} />;
	if (!questions.length) {
		return (
			<Card>
				<CardContent className="p-6">
					<div className="text-center">No questions available.</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 py-6 flex flex-col-reverse lg:flex-row gap-6">
			{/* Question Palette */}
			<div className="w-full lg:w-64">
				<Card>
					<CardContent className="p-4">
						<h3 className="font-semibold mb-4">Question Palette</h3>
						<div className="grid grid-cols-5 gap-2">
							{questions.map((question, index) => (
								<Button
									key={question._id}
									variant="outline"
									className={cn('h-8 w-8 p-0', {
										'bg-green-100':
											question.status === 'answered',
										'bg-purple-100':
											question.status === 'marked-review',
										'bg-yellow-100':
											question.status ===
											'answered-marked',
										'bg-red-100':
											question.status === 'not-answered',
									})}
									onClick={() =>
										setCurrentQuestionIndex(index)
									}
								>
									{index + 1}
								</Button>
							))}
						</div>
						<Legend questions={questions} />
					</CardContent>
				</Card>
			</div>

			{/* Quiz Question View */}
			<QuizQuestionView
				questions={questions}
				currentQuestionIndex={currentQuestionIndex}
				selectedAnswer={selectedAnswer}
				setSelectedAnswer={setSelectedAnswer}
				setQuestions={setQuestions}
				setAnswers={setAnswers}
				setCurrentQuestionIndex={setCurrentQuestionIndex}
				answers={answers}
				onAutoSave={autoSaveAnswer}
				onSubmit={handleSubmit}
				isSubmitting={isSubmitting}
			/>
		</div>
	);
}
