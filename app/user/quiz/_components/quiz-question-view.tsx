// app/user/quiz/_components/quiz-question-view.tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Question, StoredAnswer, OptionsMapping } from './quiz-interface';
import { toast } from '@/hooks/use-toast';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { MarkdownPreview } from '@/components/markdown-preview';
import { cn } from '@/lib/utils';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

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
	const [showSubmitDialog, setShowSubmitDialog] = useState(false);
	const isLastQuestion = currentQuestionIndex === questions.length - 1;

	// Load saved answer when switching questions
	useEffect(() => {
		if (currentQuestion) {
			// Get the question ID as string
			const questionId = String(currentQuestion.id);
			const savedAnswer = answers[questionId];
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

		if (selectedAnswer && currentQuestion) {
			const option = currentQuestion.options.find(
				(opt) => opt.text === selectedAnswer
			);

			if (option) {
				// Use string ID
				const questionId = String(currentQuestion.id);
				setAnswers((prev) => ({
					...prev,
					[questionId]: {
						questionId: questionId,
						selectedOptionId: option.id,
						answerText: selectedAnswer,
					},
				}));

				// Auto-save to server
				await onAutoSave(questionId, selectedAnswer);
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

			// If it's the last question, show the confirmation dialog
			if (isLastQuestion) {
				setShowSubmitDialog(true);
			} else {
				handleNavigation('next');
			}
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

		if (currentQuestion) {
			const questionId = String(currentQuestion.id);
			setAnswers((prev) => {
				const newAnswers = { ...prev };
				delete newAnswers[questionId];
				return newAnswers;
			});
		}
	};

	return (
		<>
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
									'bg-red-100 text-red-800':
										currentQuestion.status ===
										'not-answered',
								})}
							>
								{currentQuestion.status === 'answered'
									? 'Answered'
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
											className="inline"
										/>
									</Label>
								</div>
							))}
						</RadioGroup>
					</div>

					<div className="flex justify-between items-center mt-auto">
						<div className="flex space-x-2">
							<Button
								variant="outline"
								onClick={() => handleNavigation('prev')}
								disabled={currentQuestionIndex === 0}
							>
								<ChevronLeft className="h-4 w-4 mr-1" /> Prev
							</Button>
							<Button
								variant="outline"
								onClick={() => handleNavigation('next')}
								disabled={isLastQuestion || isSubmitting}
							>
								Next <ChevronRight className="h-4 w-4 ml-1" />
							</Button>
						</div>
						<div className="flex space-x-2">
							<Button
								variant="secondary"
								onClick={handleClear}
								disabled={!selectedAnswer || isSubmitting}
							>
								Clear
							</Button>
							{isLastQuestion ? (
								<Button
									onClick={() => setShowSubmitDialog(true)}
									variant="default"
									disabled={isSubmitting}
								>
									{isSubmitting
										? 'Submitting...'
										: 'Submit Quiz'}
								</Button>
							) : (
								<Button
									onClick={handleSaveAndNext}
									variant="default"
									disabled={isSubmitting}
								>
									Save & Next
								</Button>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			<Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Submit Quiz</DialogTitle>
						<DialogDescription>
							Are you sure you want to submit the quiz? This
							action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setShowSubmitDialog(false)}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button
							variant="default"
							onClick={onSubmit}
							disabled={isSubmitting}
						>
							{isSubmitting ? 'Submitting...' : 'Submit Quiz'}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
