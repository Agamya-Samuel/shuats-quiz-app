// app/user/quiz/_components/quiz-question-view.tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Question, OptionsMapping } from './quiz-interface';
import { toast } from '@/hooks/use-toast';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { MarkdownPreview } from '@/components/markdown-preview';
import { cn } from '@/lib/utils';

interface StoredAnswer {
	questionId: string;
	selectedOptionId: number;
	answerText: string;
}

type SetAnswersType = Dispatch<SetStateAction<Record<string, StoredAnswer>>>;

interface QuizQuestionViewProps {
	questions: Question[];
	currentQuestionIndex: number;
	selectedAnswer: string;
	setSelectedAnswer: (answer: string) => void;
	setQuestions: (questions: Question[]) => void;
	setAnswers: SetAnswersType;
	setCurrentQuestionIndex: (index: number) => void;
	answers: Record<string, StoredAnswer>;
	onAutoSave: (questionId: string, answer: string) => Promise<void>;
	onSubmit: () => Promise<void>;
	isSubmitting: boolean;
}

export default function QuizQuestionView({
	questions,
	currentQuestionIndex,
	selectedAnswer,
	setSelectedAnswer,
	setQuestions,
	setAnswers,
	setCurrentQuestionIndex,
	answers,
	onAutoSave,
	onSubmit,
	isSubmitting,
}: QuizQuestionViewProps) {
	const currentQuestion = questions[currentQuestionIndex];

	// Load saved answer when switching questions
	useEffect(() => {
		if (currentQuestion) {
			const savedAnswer = answers[currentQuestion._id];
			setSelectedAnswer(savedAnswer?.answerText || '');
		}
	}, [currentQuestion, answers, setSelectedAnswer]);

	const saveCurrentQuestionState = async (status: Question['status']) => {
		const updatedQuestions = [...questions];
		updatedQuestions[currentQuestionIndex] = {
			...currentQuestion,
			status,
			userAnswer: selectedAnswer,
		};
		setQuestions(updatedQuestions);

		if (selectedAnswer) {
			const option = currentQuestion.options.find(
				(opt) => opt.text === selectedAnswer
			);

			if (option) {
				setAnswers((prev) => ({
					...prev,
					[currentQuestion._id]: {
						questionId: currentQuestion._id,
						selectedOptionId: option.id,
						answerText: selectedAnswer,
					},
				}));

				// Auto-save to server
				await onAutoSave(currentQuestion._id, selectedAnswer);
			}
		}
	};

	const handleNavigation = (direction: 'prev' | 'next') => {
		const newIndex =
			direction === 'next'
				? currentQuestionIndex + 1
				: currentQuestionIndex - 1;

		if (newIndex >= 0 && newIndex < questions.length) {
			saveCurrentQuestionState(
				selectedAnswer ? 'answered' : 'not-answered'
			);
			setCurrentQuestionIndex(newIndex);
		}
	};

	const handleSaveAndNext = async () => {
		if (selectedAnswer) {
			await saveCurrentQuestionState('answered');
			handleNavigation('next');
		} else {
			toast({
				title: 'No Answer Selected',
				description: 'Please select an answer before proceeding.',
				variant: 'destructive',
			});
		}
	};

	const handleClear = () => {
		setSelectedAnswer('');
		const updatedQuestions = [...questions];
		updatedQuestions[currentQuestionIndex] = {
			...currentQuestion,
			status: 'not-answered',
			userAnswer: undefined,
		};
		setQuestions(updatedQuestions);

		setAnswers((prev) => {
			const newAnswers = { ...prev };
			delete newAnswers[currentQuestion._id];
			return newAnswers;
		});
	};

	const handleMarkForReview = async (saveAnswer: boolean) => {
		await saveCurrentQuestionState(
			saveAnswer ? 'answered-marked' : 'marked-review'
		);
		handleNavigation('next');
	};

	return (
		<Card className="flex flex-col">
			<CardContent className="p-6 flex flex-col">
				<div className="mb-6">
					<div className="flex justify-between items-center mb-2">
						<h3 className="text-lg font-semibold">
							Question {currentQuestionIndex + 1} of{' '}
							{questions.length}
						</h3>
						<span
							className={cn('px-2 py-1 rounded text-sm', {
								'bg-green-100 text-green-800':
									currentQuestion.status === 'answered',
								'bg-purple-100 text-purple-800':
									currentQuestion.status === 'marked-review',
								'bg-yellow-100 text-yellow-800':
									currentQuestion.status ===
									'answered-marked',
								'bg-red-100 text-red-800':
									currentQuestion.status === 'not-answered',
							})}
						>
							{currentQuestion.status === 'answered'
								? 'Answered'
								: currentQuestion.status === 'marked-review'
								? 'Marked for Review'
								: currentQuestion.status === 'answered-marked'
								? 'Answered & Marked'
								: 'Not Answered'}
						</span>
					</div>

					<div className="mb-4">
						<MarkdownPreview
							content={currentQuestion.text}
							className="prose max-w-none"
						/>
					</div>

					<RadioGroup
						value={selectedAnswer}
						onValueChange={setSelectedAnswer}
						className="flex-grow overflow-auto"
					>
						{currentQuestion.options.map((option) => (
							<div
								key={option.id}
								className="flex items-center space-x-2 p-4 rounded-lg hover:bg-gray-50"
							>
								<RadioGroupItem
									value={option.text}
									id={`option-${option.id}`}
								/>
								<Label
									htmlFor={`option-${option.id}`}
									className="flex-1 cursor-pointer flex items-center"
								>
									<span className="font-medium mr-2">
										{OptionsMapping[option.id]}
										{')'}
									</span>
									<MarkdownPreview
										content={option.text}
										className="flex pt-3.5"
									/>
								</Label>
							</div>
						))}
					</RadioGroup>
				</div>

				<div className="mt-auto">
					<div className="flex gap-4 flex-wrap">
						<Button
							variant="outline"
							onClick={() => handleNavigation('prev')}
							disabled={currentQuestionIndex === 0}
						>
							<ChevronLeft className="h-4 w-4 mr-2" />
							Previous
						</Button>
						<Button variant="success" onClick={handleSaveAndNext}>
							Save & Next
							<ChevronRight className="h-4 w-4 ml-2" />
						</Button>
						<Button
							variant="destructive"
							onClick={() => handleNavigation('next')}
							disabled={
								currentQuestionIndex === questions.length - 1
							}
						>
							Skip
							<ChevronRight className="h-4 w-4 ml-2" />
						</Button>
						<Button variant="outline" onClick={handleClear}>
							Clear Response
						</Button>
						<Button
							variant="yellow"
							onClick={() => handleMarkForReview(true)}
							disabled={
								currentQuestionIndex === questions.length - 1
							}
						>
							Save & Mark for Review
						</Button>
						<Button
							variant="purple"
							onClick={() => handleMarkForReview(false)}
							disabled={
								currentQuestionIndex === questions.length - 1
							}
						>
							Mark for Review
						</Button>
					</div>

					{currentQuestionIndex === questions.length - 1 && (
						<div className="mt-6">
							<Button
								onClick={onSubmit}
								className="w-full"
								variant="default"
								disabled={isSubmitting}
							>
								{isSubmitting ? 'Submitting...' : 'Submit Quiz'}
							</Button>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
