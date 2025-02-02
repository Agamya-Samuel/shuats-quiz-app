// app/user/quiz/_components/quiz-interface.tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getAllQuestions } from '@/actions/question';
import Legend from './legend';
import QuizQuestionView from './quiz-question-view';
import { cn } from '@/lib/utils';
import LoadingState from '@/components/loading-component';

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
	const [questions, setQuestions] = useState<Question[]>([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [selectedAnswer, setSelectedAnswer] = useState<string>('');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [answers, setAnswers] = useState<Record<string, string>>({});

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

	// Auto-save warning
	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (Object.keys(answers).length > 0) {
				e.preventDefault();
				e.returnValue = '';
			}
		};

		window.addEventListener('beforeunload', handleBeforeUnload);
		return () =>
			window.removeEventListener('beforeunload', handleBeforeUnload);
	}, [answers]);

	if (isLoading)
		return (
			<div className="max-w-7xl mx-auto px-4 py-6 flex flex-col-reverse lg:flex-row gap-6 h-[calc(100vh-20rem)]">
				<LoadingState />
			</div>
		);
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
			/>
		</div>
	);
}
