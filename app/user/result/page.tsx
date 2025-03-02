'use client';

import { useEffect, useState } from 'react';
import { getQuizResults } from '@/actions/question';
import { useCookies } from '@/contexts/cookie-context';
import ResultSummary from './_components/result-summary';
import ResultDetails from './_components/result-details';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
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
				<h1 className="text-3xl font-bold mb-8 text-center">
					Quiz Results
				</h1>

				{/* SHUATS Image Carousel */}
				<div className="mb-8">
					<h2 className="text-xl font-semibold mb-4">
						SHUATS Campus Highlights
					</h2>
					<ImageCarousel
						category={['env', 'hostel', 'sports', 'cultural']}
						className="shadow-md"
						autoSlideInterval={4000}
					/>
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
