// app/user/quiz/_components/quiz-interface.tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getAllQuestions } from '@/actions/question';
import { submitAnswer, submitQuiz } from '@/actions/submit-answers';
import { getQuizResults } from '@/actions/question';
import Legend from './legend';
import QuizQuestionView from './quiz-question-view';
import { cn } from '@/lib/utils';
import QuizLoading from './quiz-loading';
import { useToast } from '@/hooks/use-toast';
import { useCookies } from '@/contexts/cookie-context';
import { useRouter } from 'next/navigation';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

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

// Interface for stored answers
export interface StoredAnswer {
	questionId: string;
	selectedOptionId: number;
	answerText: string; // Keep text for UI display
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
	<div className="w-full h-full flex items-center justify-center">
		<Card className="max-w-lg w-full">
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
	</div>
);

// Format time function
const formatTime = (seconds: number): string => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
		.toString()
		.padStart(2, '0')}`;
};

export default function QuizInterface() {
	const { toast } = useToast();
	const [questions, setQuestions] = useState<Question[]>([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [selectedAnswer, setSelectedAnswer] = useState<string>('');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [answers, setAnswers] = useState<Record<string, StoredAnswer>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [hasAlreadyAttempted, setHasAlreadyAttempted] = useState(false);
	const { user: currentUser } = useCookies();
	const router = useRouter();

	// Timer state
	const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
	const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);
	const [isTimeUp, setIsTimeUp] = useState(false);

	// Check if user has already attempted the quiz
	useEffect(() => {
		const checkAttemptStatus = async () => {
			if (!currentUser?.userId) return;

			try {
				const response = await getQuizResults(currentUser.userId);
				if (
					response.success &&
					response.data &&
					response.data.results.length > 0
				) {
					setHasAlreadyAttempted(true);
				}
			} catch (err) {
				console.error('Error checking attempt status:', err);
			}
		};

		checkAttemptStatus();
	}, [currentUser?.userId]);

	// Timer effect
	useEffect(() => {
		// Only start the timer if the quiz is loaded and not already attempted
		if (isLoading || hasAlreadyAttempted || isTimeUp) return;

		const timerId = setInterval(() => {
			setTimeRemaining((prev) => {
				if (prev <= 1) {
					clearInterval(timerId);
					setIsTimeUp(true);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timerId);
	}, [isLoading, hasAlreadyAttempted, isTimeUp]);

	// Handle time up
	useEffect(() => {
		if (isTimeUp && !isSubmitting && !showTimeUpDialog) {
			handleTimeUp();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isTimeUp, isSubmitting, showTimeUpDialog]);

	// Handle time up function
	const handleTimeUp = async () => {
		if (isSubmitting) return;

		try {
			setIsSubmitting(true);
			setShowTimeUpDialog(true);

			// Format answers for submission using stored optionIds
			const formattedAnswers = Object.values(answers)
				.map(({ questionId, selectedOptionId }) => ({
					questionId,
					selectedOptionId,
				}))
				.filter((a) => a.selectedOptionId > 0);

			if (!currentUser?.userId) {
				throw new Error('You must be logged in to submit the quiz');
			}

			const result = await submitQuiz(
				currentUser.userId,
				formattedAnswers
			);

			if (result.success) {
				// Clear local storage after successful submission
				localStorage.removeItem('quiz_answers');
				setAnswers({});
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

	// Load answers from localStorage on mount ONLY
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
	}, []); // Empty dependency array - run only on mount

	// Update questions when answers change
	useEffect(() => {
		if (questions.length > 0 && Object.keys(answers).length > 0) {
			const updatedQuestions = questions.map((q) => {
				const savedAnswer = answers[q._id];
				if (savedAnswer) {
					return {
						...q,
						status: 'answered' as const,
						userAnswer: savedAnswer.answerText,
					};
				}
				return q;
			});
			setQuestions(updatedQuestions);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [answers]); // Only run when answers change

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
				const question = questions[currentQuestionIndex];
				const option = question.options.find(
					(opt) => opt.text === answer
				);

				if (!option) return;

				const result = await submitAnswer(
					currentUser.userId,
					questionId,
					option.id
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

			// Format answers for submission using stored optionIds
			const formattedAnswers = Object.values(answers)
				.map(({ questionId, selectedOptionId }) => ({
					questionId,
					selectedOptionId,
				}))
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
					variant: 'success',
				});
				// Clear local storage after successful submission
				localStorage.removeItem('quiz_answers');
				setAnswers({});
				// Redirect to results page
				router.push('/user/result');
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

	// Handle time up dialog close
	const handleTimeUpDialogClose = () => {
		router.push('/user/result');
	};

	if (isLoading) {
		return (
			<div
				className="max-w-7xl mx-auto w-full px-4 flex items-center justify-center"
				style={{ minHeight: 'calc(100vh - 150px)' }}
			>
				<QuizLoading />
			</div>
		);
	}

	if (hasAlreadyAttempted) {
		return (
			<div
				className="max-w-7xl mx-auto w-full px-4 flex items-center justify-center"
				style={{ minHeight: 'calc(100vh - 150px)' }}
			>
				<Card className="max-w-lg w-full">
					<CardContent className="p-6">
						<div className="text-center">
							<h3 className="text-xl font-semibold mb-4">
								Quiz Already Attempted
							</h3>
							<p className="mb-6 text-gray-600">
								You have already attempted this quiz. You can
								only take the quiz once.
							</p>
							<div className="flex justify-center gap-4">
								<Button
									variant="outline"
									onClick={() =>
										router.push('/user/dashboard')
									}
								>
									Return to Dashboard
								</Button>
								<Button
									onClick={() => router.push('/user/result')}
								>
									View Results
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (error) {
		return (
			<div
				className="max-w-7xl mx-auto w-full px-4"
				style={{ minHeight: 'calc(100vh - 150px)' }}
			>
				<ErrorState message={error} retry={fetchQuestions} />
			</div>
		);
	}

	if (!questions.length) {
		return (
			<div
				className="max-w-7xl mx-auto w-full px-4 flex items-center justify-center"
				style={{ minHeight: 'calc(100vh - 150px)' }}
			>
				<Card className="max-w-lg w-full">
					<CardContent className="p-6">
						<div className="text-center">
							No questions available.
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<>
			<div className="max-w-7xl mx-auto w-full px-4 py-6">
				{/* Timer Display */}
				<div className="mb-4 flex justify-end">
					<div
						className={`px-4 py-2 rounded-md font-mono text-lg font-bold ${
							timeRemaining < 60
								? 'bg-red-100 text-red-800 animate-pulse'
								: timeRemaining < 300
								? 'bg-yellow-100 text-yellow-800'
								: 'bg-blue-100 text-blue-800'
						}`}
					>
						Time Remaining: {formatTime(timeRemaining)}
					</div>
				</div>

				<div className="w-full flex flex-col">
					<div className="flex flex-col-reverse lg:flex-row gap-6">
						{/* Question Palette */}
						<div className="w-full lg:w-64">
							<Card className="h-full">
								<CardContent className="p-4 h-full flex flex-col">
									<h3 className="font-semibold mb-4">
										Question Palette
									</h3>
									<div className="grid grid-cols-5 gap-2 mb-4">
										{questions.map((question, index) => (
											<Button
												key={question._id}
												variant="outline"
												className={cn('h-8 w-8 p-0', {
													'bg-green-100':
														question.status ===
														'answered',
													'bg-purple-100':
														question.status ===
														'marked-review',
													'bg-yellow-100':
														question.status ===
														'answered-marked',
													'bg-red-100':
														question.status ===
														'not-answered',
												})}
												onClick={() =>
													setCurrentQuestionIndex(
														index
													)
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
						<div className="flex-grow">
							<QuizQuestionView
								questions={questions}
								currentQuestionIndex={currentQuestionIndex}
								selectedAnswer={selectedAnswer}
								setSelectedAnswer={setSelectedAnswer}
								setQuestions={setQuestions}
								setAnswers={setAnswers}
								setCurrentQuestionIndex={
									setCurrentQuestionIndex
								}
								answers={answers}
								onAutoSave={autoSaveAnswer}
								onSubmit={handleSubmit}
								isSubmitting={isSubmitting}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Time Up Dialog */}
			<Dialog open={showTimeUpDialog} onOpenChange={() => {}}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Time&apos;s Up!</DialogTitle>
						<DialogDescription>
							Your time has expired and your quiz has been
							automatically submitted.
						</DialogDescription>
					</DialogHeader>
					<div className="mt-6 flex justify-center">
						<Button onClick={handleTimeUpDialogClose}>
							View Results
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
