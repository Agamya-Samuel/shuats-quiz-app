'use client';

import { useEffect, useState } from 'react';
import { getQuizResults } from '@/actions/question';
import { useCookies } from '@/contexts/cookie-context';
import ResultSummary from './_components/result-summary';
import ResultDetails from './_components/result-details';
import LoadingState from '@/components/loading-component';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';

export interface QuizResult {
	questionId: string;
	question: string;
	options: Array<{ id: number; text: string }>;
	correctOptionId: number | null;
	userSelectedOptionId: number | null;
	isCorrect: boolean;
}

export interface QuizSummary {
	totalQuestions: number;
	attemptedQuestions: number;
	correctAnswers: number;
	score: number;
	submittedAt: string;
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
		};
	};
	error?: string;
	hasAttempted?: boolean;
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

	if (isLoading) return <LoadingState />;

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
					<Card>
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
								<Button
									onClick={() => router.push('/user/quiz')}
								>
									Take Quiz Now
								</Button>
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

				{summary && <ResultSummary summary={summary} />}

				<div className="mt-8">
					<h2 className="text-2xl font-semibold mb-4">
						Detailed Results
					</h2>
					<ResultDetails results={results} />
				</div>
			</div>
		</div>
	);
}
