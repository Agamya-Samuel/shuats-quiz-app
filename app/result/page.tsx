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
}

export default function ResultPage() {
	const router = useRouter();
	const { user: currentUser } = useCookies();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [results, setResults] = useState<QuizResult[]>([]);
	const [summary, setSummary] = useState<QuizSummary | null>(null);

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
				if (response.success && response.data) {
					setResults(response.data.results);
					setSummary({
						...response.data.summary,
						submittedAt: response.data.summary.submittedAt,
					});
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
			<Card>
				<CardContent className="p-6">
					<div className="text-center text-red-500">
						<h3 className="text-lg font-semibold mb-2">Error</h3>
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
		);
	}

	return (
		<div className="max-w-4xl mx-auto px-4 py-8">
			{summary && <ResultSummary summary={summary} />}
			{results.length > 0 && <ResultDetails results={results} />}

			<div className="mt-8 text-center">
				<Button
					variant="outline"
					onClick={() => router.push('/user/quiz')}
				>
					Take Another Quiz
				</Button>
			</div>
		</div>
	);
}
