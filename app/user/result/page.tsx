'use client';

import { useEffect, useState } from 'react';
import { getQuizResults } from '@/actions/question';
import { useCookies } from '@/contexts/cookie-context';
import ResultSummary from './_components/result-summary';
import ResultDetails from './_components/result-details';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { AlertCircle, Printer } from 'lucide-react';
import ImageCarousel from '@/components/image-carousel';

export interface QuizResult {
	questionId: string;
	question: string;
	options: Array<{ id: number; text: string }>;
	correctOptionId: number | null;
	userSelectedOptionId: number | null;
	isCorrect: boolean;
	subject?: string;
}

export interface QuizSummary {
	totalQuestions: number;
	attemptedQuestions: number;
	correctAnswers: number;
	score: number;
	submittedAt: string;
	timeTaken: number | null;
	attemptedSubjects?: string[];
}

export interface ServerResponse {
	success: boolean;
	data?: {
		results: QuizResult[];
		summary: {
			totalQuestions: number;
			attemptedQuestions: number;
			correctAnswers: number;
			score: number;
			submittedAt: string;
			timeTaken: number | null;
			attemptedSubjects?: string[];
		};
	};
	error?: string;
	hasAttempted?: boolean;
}

/**
 * Custom loading component for the result page
 * Displays a centered spinner with text
 */
function ResultLoading() {
	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center">
			<div className="flex flex-col items-center gap-4">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
				<p className="text-gray-500 font-medium">
					Loading quiz results...
				</p>
			</div>
		</div>
	);
}

export default function ResultPage() {
	const router = useRouter();
	const { user: currentUser } = useCookies();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [results, setResults] = useState<QuizResult[]>([]);
	const [summary, setSummary] = useState<QuizSummary | null>(null);
	const [hasAttempted, setHasAttempted] = useState(false);

	useEffect(() => {
		const fetchResults = async () => {
			if (!currentUser?.userId) {
				router.push('/login');
				return;
			}

			try {
				const response: ServerResponse = await getQuizResults(
					currentUser.userId
				);

				if (
					response.success &&
					response.data &&
					response.data.results.length > 0
				) {
					setResults(response.data.results);
					setSummary({
						...response.data.summary,
						submittedAt: response.data.summary.submittedAt,
					});
					setHasAttempted(true);
				} else if (
					response.success &&
					(!response.data || response.data.results.length === 0)
				) {
					// User hasn't attempted the quiz yet
					setHasAttempted(false);
				} else {
					throw new Error(
						response.error || 'Failed to fetch results'
					);
				}
			} catch (err) {
				setError(
					err instanceof Error ? err.message : 'An error occurred'
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchResults();
	}, [currentUser?.userId, router]);

	// Handle print functionality
	const handlePrint = () => {
		window.print();
	};

	if (isLoading) return <ResultLoading />;

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50">
				<div className="max-w-4xl mx-auto px-4 py-8">
					<Card>
						<CardContent className="p-6">
							<div className="text-center text-red-500">
								<h3 className="text-lg font-semibold mb-2">
									Error
								</h3>
								<p>{error}</p>
								<Button
									variant="outline"
									className="mt-4"
									onClick={() => router.push('/user/quiz')}
								>
									Return to Quiz
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	if (!hasAttempted) {
		return (
			<div className="min-h-screen bg-gray-50">
				<div className="max-w-4xl mx-auto px-4 py-8">
					<Card className="shadow-md">
						<CardContent className="p-6">
							<div className="text-center">
								<AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
								<h3 className="text-xl font-semibold mb-2">
									No Quiz Results Available
								</h3>
								<p className="mb-6 text-gray-600">
									You need to attempt the quiz first to view
									your results.
								</p>
								<div className="flex flex-col sm:flex-row justify-center gap-4">
									<Button
										onClick={() =>
											router.push('/user/quiz')
										}
										className="flex items-center gap-2"
									>
										Take Quiz Now
									</Button>
									<Button
										variant="outline"
										onClick={() =>
											router.push('/user/dashboard')
										}
										className="flex items-center gap-2"
									>
										Return to Dashboard
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-center">
						Quiz Results
					</h1>
					<Button
						onClick={handlePrint}
						variant="outline"
						className="flex items-center gap-2 print:hidden"
					>
						<Printer className="h-4 w-4" />
						Print Results
					</Button>
				</div>

				{/* SHUATS Image Carousel */}
				<div className="mb-8 print:hidden">
					<h2 className="text-xl font-semibold mb-4">
						SHUATS Campus Highlights
					</h2>
					<ImageCarousel
						category={['env', 'hostel', 'sports', 'cultural']}
						className="shadow-md"
						autoSlideInterval={4000}
					/>
				</div>

				{/* Career Guidance CTA */}
				<div className="my-8 print:hidden">
					<Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-md overflow-hidden">
						<CardContent className="p-6">
							<div className="flex flex-col md:flex-row items-center gap-6">
								<div className="flex-1">
									<h2 className="text-2xl font-bold text-blue-800 mb-2">
										Discover Your Career Path
									</h2>
									<p className="text-blue-700 mb-4">
										Based on your quiz performance and
										subject preferences, we can provide
										personalized career guidance to help you
										make informed decisions about your
										future.
									</p>
									<Button
										onClick={() =>
											router.push('/user/career-guidance')
										}
										className="bg-blue-600 hover:bg-blue-700 text-white"
									>
										Get Career Guidance
									</Button>
								</div>
								<div className="hidden md:block">
									<div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-16 w-16 text-blue-500"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
											/>
										</svg>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{summary && (
					<ResultSummary summary={summary} results={results} />
				)}

				<div className="mt-8">
					<h2 className="text-2xl font-semibold mb-4">
						Question Analysis
					</h2>
					<ResultDetails results={results} />
				</div>
			</div>
		</div>
	);
}
