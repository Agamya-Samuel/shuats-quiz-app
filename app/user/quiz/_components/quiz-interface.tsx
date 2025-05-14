// app/user/quiz/_components/quiz-interface.tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getAllQuestions } from '@/actions/quiz';
import {
	submitAnswer,
	submitQuiz,
	recordQuizStartTime,
} from '@/actions/submit-answers';
import { getQuizResults } from '@/actions/quiz';
import Legend from './legend';
import QuizQuestionView from './quiz-question-view';
import { cn } from '@/lib/utils';
import GlobalLoading from '@/components/global-loading';
import { useToast } from '@/hooks/use-toast';
import { useCookies as useAuthCookies } from '@/contexts/cookie-context';
import { useCookies } from '@/hooks/use-cookies';
import { useRouter } from 'next/navigation';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import ImageCarousel from '@/components/image-carousel';
import SubjectSelector from './subject-selector';
import { subjects } from '@/lib/constants';
import { useAntiCheat, safeExitFullscreen } from '@/hooks/use-anti-cheat';

// Types
export interface Option {
	id: string; // Using string to match database schema
	text: string;
}

export interface Question {
	id: number; // Use ID from database schema
	_id?: string; // Keep for backward compatibility with components
	text: string;
	question?: string; // Add this for compatibility with API responses
	options: Option[];
	subject: string;
	status:
		| 'not-visited'
		| 'not-answered'
		| 'answered'
		| 'marked-review'
		| 'answered-marked';
	userAnswer?: string;
}

// Interface for stored answers - keep string keys for compatibility with child components
export interface StoredAnswer {
	questionId: string;
	selectedOptionId: string;
	answerText: string; // Keep text for UI display
}

// Define mapping from option IDs to display letters
export const OptionsMapping: Record<string, string> = {
	'1': 'A',
	'2': 'B',
	'3': 'C',
	'4': 'D',
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
	const [answers, setAnswers] = useState<Record<string, StoredAnswer>>({}); // Keep string keys for compatibility
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [hasAlreadyAttempted, setHasAlreadyAttempted] = useState(false);
	const [isCheckingAttemptStatus, setIsCheckingAttemptStatus] =
		useState(true);
	const { user: currentUser } = useAuthCookies();
	const { setCookie } = useCookies();
	const router = useRouter();

	// Subject selection state
	const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
	const [showSubjectSelector, setShowSubjectSelector] = useState(false);

	// Timer state
	const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes in seconds
	const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);
	const [isTimeUp, setIsTimeUp] = useState(false);

	// Quiz start time state
	const [, setQuizStartTime] = useState<Date | null>(null);

	// Anti-cheat state
	const [quizStarted, setQuizStarted] = useState(false);

	// Enable anti-cheat measures when quiz is active
	const antiCheat = useAntiCheat(quizStarted);

	// Check if user has already attempted the quiz
	useEffect(() => {
		const checkAttemptStatus = async () => {
			if (!currentUser?.userId) return;

			setIsCheckingAttemptStatus(true);

			try {
				const response = await getQuizResults(
					Number(currentUser.userId)
				);
				if (
					response.success &&
					response.results &&
					response.results.questions.length > 0
				) {
					setHasAlreadyAttempted(true);
					setShowSubjectSelector(false);
				} else {
					// User hasn't attempted the quiz, show subject selector
					setHasAlreadyAttempted(false);
					setShowSubjectSelector(true);
				}
			} catch (err) {
				console.error('Error checking attempt status:', err);
				setError(
					'Failed to check quiz attempt status. Please try again.'
				);
			} finally {
				setIsCheckingAttemptStatus(false);
			}
		};

		checkAttemptStatus();
	}, [currentUser?.userId]);

	// Timer effect
	useEffect(() => {
		// Only start the timer if the quiz is loaded, not already attempted, and subject is selected
		if (isLoading || hasAlreadyAttempted || isTimeUp || showSubjectSelector)
			return;

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
	}, [isLoading, hasAlreadyAttempted, isTimeUp, showSubjectSelector]);

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
					questionId: Number(questionId), // Convert to number for API
					selectedOption: selectedOptionId,
				}))
				.filter((a) => a.selectedOption);

			if (!currentUser?.userId) {
				throw new Error('You must be logged in to submit the quiz');
			}

			const result = await submitQuiz(
				Number(currentUser.userId),
				formattedAnswers
			);

			if (result.success) {
				// Clear local storage after successful submission
				localStorage.removeItem('quiz_answers');
				localStorage.removeItem('quiz_start_time');
				setAnswers({});

				// IMPORTANT: First mark that we're intentionally exiting fullscreen
				if (antiCheat.setIntentionallyExiting) {
					antiCheat.setIntentionallyExiting(true);
				}

				// Then disable anti-cheat measures
				setQuizStarted(false);

				// Wait a moment for the anti-cheat to fully disable before exiting fullscreen
				setTimeout(() => {
					safeExitFullscreen();
					// Redirect to completion page after a short delay
					setTimeout(() => {
						router.push('/user/quiz/completion');
					}, 100);
				}, 100);
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

		// Load quiz start time from localStorage if it exists
		const savedStartTime = localStorage.getItem('quiz_start_time');
		if (savedStartTime) {
			try {
				const startTime = new Date(JSON.parse(savedStartTime));
				setQuizStartTime(startTime);
			} catch (err) {
				console.error('Error parsing saved start time:', err);
			}
		}
	}, []); // Empty dependency array - run only on mount

	// Update questions when answers change
	useEffect(() => {
		if (questions.length > 0 && Object.keys(answers).length > 0) {
			const updatedQuestions = questions.map((q) => {
				// Use _id for compatibility with how answers are stored
				const savedAnswer = answers[String(q.id)];
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

	// Handle subject selection
	const handleSubjectSelect = async (subjects: string[]) => {
		setSelectedSubjects(subjects);
		setShowSubjectSelector(false);
		await fetchQuestions(subjects);

		// Set quiz as started to enable anti-cheat
		setQuizStarted(true);

		// Save selected subjects to cookies for Career Guidance feature
		setCookie(
			'selectedSubjects',
			encodeURIComponent(JSON.stringify(subjects)),
			{ expires: 7 }
		);

		// Record quiz start time after subject selection
		const startTime = new Date();
		setQuizStartTime(startTime);
		localStorage.setItem('quiz_start_time', JSON.stringify(startTime));
		await recordQuizStartTime(currentUser?.userId || '', startTime);
	};

	// Fetch questions only from selected subjects
	const fetchQuestions = useCallback(async (selectedSubjects?: string[]) => {
		try {
			setIsLoading(true);
			setError(null);
			const response = await getAllQuestions();

			if (response.success && Array.isArray(response.questions)) {
				let filteredQuestions = [...response.questions];

				// Filter questions to only include those from selected subjects
				if (selectedSubjects && selectedSubjects.length > 0) {
					// Only keep questions from selected subjects
					filteredQuestions = filteredQuestions.filter((q) =>
						selectedSubjects.includes(q.subject)
					);

					// Create a map for subject priority (lower index = higher priority)
					const subjectPriority = new Map(
						selectedSubjects.map((subject, index) => [
							subject,
							index,
						])
					);

					// Sort questions based on subject priority
					filteredQuestions.sort((a, b) => {
						const aPriority = subjectPriority.get(a.subject) || 0;
						const bPriority = subjectPriority.get(b.subject) || 0;
						return aPriority - bPriority;
					});
				}

				// If no questions match the selected subjects, show an error
				if (filteredQuestions.length === 0) {
					setError(
						'No questions available for the selected subjects. Please select different subjects.'
					);
					setIsLoading(false);
					return;
				}

				// Initialize question status and properly format data for our UI
				const initializedQuestions = filteredQuestions.map(
					(q, index) => {
						// Type assertion to handle the possibility that q might have either text or question property
						const questionData = q as {
							id: number;
							text?: string;
							question?: string;
							options: Array<{
								id?: string | number;
								text?: string;
								value?: string;
							}>;
							subject: string;
						};

						// Extract question from API response and format as needed
						const formattedQuestion: Question = {
							id: questionData.id,
							_id: String(questionData.id), // Add _id for compatibility with components
							text:
								questionData.text ||
								questionData.question ||
								'',
							question: questionData.question,
							options: Array.isArray(questionData.options)
								? questionData.options.map(
										(opt: {
											id?: string | number;
											text?: string;
											value?: string;
										}) => ({
											id: String(
												opt.id || opt.value || ''
											),
											text: opt.text || opt.value || '',
										})
								  )
								: [],
							subject: questionData.subject || '',
							status:
								index === 0 ? 'not-answered' : 'not-visited',
						};
						return formattedQuestion;
					}
				);

				setQuestions(initializedQuestions);
			} else {
				throw new Error('Failed to fetch questions');
			}
		} catch (err) {
			console.error('Error fetching questions:', err);
			setError(
				'Failed to load questions. Please refresh the page and try again.'
			);
		} finally {
			setIsLoading(false);
		}
	}, []);

	// Handle answer selection
	const handleAnswerSelect = async (optionId: string, optionText: string) => {
		if (isSubmitting) return;

		const currentQuestion = questions[currentQuestionIndex];
		if (!currentQuestion) return;

		// Store the answer using ID as string
		const updatedAnswers = {
			...answers,
			[String(currentQuestion.id)]: {
				questionId: String(currentQuestion.id), // Keep as string for UI
				selectedOptionId: optionId,
				answerText: optionText,
			},
		};
		setAnswers(updatedAnswers);

		// Update the current question's status
		const updatedQuestions = [...questions];
		updatedQuestions[currentQuestionIndex] = {
			...currentQuestion,
			status: 'answered',
			userAnswer: optionText,
		};
		setQuestions(updatedQuestions);

		// Auto-save the answer to the server
		if (currentUser?.userId) {
			try {
				await submitAnswer(
					Number(currentUser.userId),
					currentQuestion.id,
					optionId
				);
			} catch (err) {
				console.error('Error auto-saving answer:', err);
			}
		}
	};

	// Adapter function to match the expected onAutoSave signature in QuizQuestionView
	const handleAutoSave = async (questionId: string, answerText: string) => {
		// Find the question using string ID (backward compatibility)
		const question = questions.find((q) => String(q.id) === questionId);
		if (!question) return;

		// Find the option that matches the answer text
		const option = question.options.find((opt) => opt.text === answerText);
		if (!option) return;

		// Call handleAnswerSelect with the correct parameters
		await handleAnswerSelect(option.id, answerText);
	};

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
					questionId: Number(questionId), // Convert to number for API
					selectedOption: selectedOptionId,
				}))
				.filter((a) => a.selectedOption);

			const result = await submitQuiz(
				Number(currentUser.userId),
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
				localStorage.removeItem('quiz_start_time');
				setAnswers({});

				// IMPORTANT: First mark that we're intentionally exiting fullscreen
				if (antiCheat.setIntentionallyExiting) {
					antiCheat.setIntentionallyExiting(true);
				}

				// Then disable anti-cheat measures
				setQuizStarted(false);

				// Wait a moment for the anti-cheat to fully disable before exiting fullscreen
				setTimeout(() => {
					safeExitFullscreen();
					// Redirect to completion page after a short delay
					setTimeout(() => {
						router.push('/user/quiz/completion');
					}, 100);
				}, 100);
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
		router.push('/user/quiz/completion');
	};

	// Show loading state while checking attempt status
	if (isCheckingAttemptStatus) {
		return (
			<div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
				<GlobalLoading message="Checking quiz status..." />
			</div>
		);
	}

	// If user has already attempted the quiz, show a message
	if (hasAlreadyAttempted) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<Card className="max-w-lg w-full">
					<CardContent className="p-6">
						<div className="text-center">
							<h3 className="text-xl font-semibold mb-2">
								Quiz Already Attempted
							</h3>
							<p className="mb-6">
								You have already attempted this quiz. You can
								view your results below.
							</p>
							<Button onClick={() => router.push('/user/result')}>
								View Results
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Show subject selector before starting the quiz
	if (showSubjectSelector) {
		return <SubjectSelector onSubjectSelect={handleSubjectSelect} />;
	}

	// Show loading state while fetching questions
	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
				<GlobalLoading
					message={
						isSubmitting
							? 'Submitting your answers...'
							: 'Loading quiz questions...'
					}
				/>
			</div>
		);
	}

	if (error) {
		return (
			<div
				className="max-w-7xl mx-auto w-full px-4"
				style={{ minHeight: 'calc(100vh - 150px)' }}
			>
				<ErrorState
					message={error}
					retry={() => fetchQuestions(selectedSubjects)}
				/>
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
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-7xl mx-auto px-4">
				{/* SHUATS Image Carousel */}
				<div>
					{/* <h2 className="text-xl font-semibold mb-4">
						SHUATS Campus Highlights
					</h2> */}
					<ImageCarousel
						category={['env', 'hostel', 'sports', 'cultural']}
						className="shadow-md"
						autoSlideInterval={4000}
					/>
				</div>
				{/* Quiz Header */}
				<div className="flex flex-col md:flex-row justify-between items-center mb-6 my-6">
					<div className="flex flex-wrap gap-2">
						{selectedSubjects.map((subject, index) => (
							<div key={subject} className="flex items-center">
								<span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
									{index + 1}.{' '}
									{subjects.find((s) => s.key === subject)
										?.value || subject}
								</span>
							</div>
						))}
					</div>
					<div className="mt-4 md:mt-0 flex items-center">
						<div
							className={cn(
								'text-lg font-semibold px-4 py-2 rounded-md',
								timeRemaining < 300
									? 'bg-red-100 text-red-700'
									: 'bg-blue-100 text-blue-700'
							)}
						>
							Time: {formatTime(timeRemaining)}
						</div>
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
												key={question.id}
												variant="outline"
												className={cn('h-8 w-8 p-0', {
													'bg-green-100':
														question.status ===
														'answered',
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
								onAutoSave={handleAutoSave}
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
		</div>
	);
}
