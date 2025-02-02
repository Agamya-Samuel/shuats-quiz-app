// app/user/quiz/_components/quiz-question-view.tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Question, OptionsMapping } from './quiz-interface';
import { toast } from '@/hooks/use-toast';
import { Dispatch, SetStateAction } from 'react';

type SetAnswersType = Dispatch<SetStateAction<Record<string, string>>>;

interface QuizQuestionViewProps {
	questions: Question[];
	currentQuestionIndex: number;
	selectedAnswer: string;
	setSelectedAnswer: (answer: string) => void;
	setQuestions: (questions: Question[]) => void;
	setAnswers: SetAnswersType;
	setCurrentQuestionIndex: (index: number) => void;
	answers: Record<string, string>;
}

export default function QuizQuestionView({
    questions,
    currentQuestionIndex,
    selectedAnswer,
    setSelectedAnswer,
    setQuestions,
    setAnswers,
    setCurrentQuestionIndex,
    // answers,
}: QuizQuestionViewProps) {
	const currentQuestion = questions[currentQuestionIndex];

	const saveCurrentQuestionState = (status: Question['status']) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
        ...currentQuestion,
        status,
        userAnswer: selectedAnswer,
    };
    setQuestions(updatedQuestions);

    if (selectedAnswer) {
        setAnswers((prev: Record<string, string>) => ({
            ...prev,
            [currentQuestion._id]: selectedAnswer,
        }));
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
			setSelectedAnswer(questions[newIndex].userAnswer || '');
		}
	};

	const handleSaveAndNext = () => {
		if (selectedAnswer) {
			saveCurrentQuestionState('answered');
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

        setAnswers((prev: Record<string, string>) => {
            const newAnswers = { ...prev };
            delete newAnswers[currentQuestion._id];
            return newAnswers;
        });
    };

	const handleMarkForReview = (saveAnswer: boolean) => {
		saveCurrentQuestionState(
			saveAnswer ? 'answered-marked' : 'marked-review'
		);
		handleNavigation('next');
	};

	const handleSubmit = async () => {
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
			// Implement your submission logic here
			// await submitQuiz(answers);
			toast({
				title: 'Quiz Submitted',
				description: 'Your answers have been recorded successfully.',
			});
		} catch (err: unknown) {
			const errorMessage =
				err instanceof Error
					? err.message
					: 'An unknown error occurred';
			toast({
				title: 'Submission Failed',
				description: `There was an error submitting your quiz: ${errorMessage}`,
				variant: 'destructive',
			});
		}
	};

	return (
		<div className="flex-1">
			<Card>
				<CardContent className="p-6">
					<div className="mb-6">
						<span className="text-sm text-gray-500">
							Question {currentQuestionIndex + 1} of{' '}
							{questions.length}
						</span>
						<h3 className="text-lg font-semibold mt-2">
							{currentQuestion.text}
						</h3>
					</div>

					<RadioGroup
						value={selectedAnswer}
						onValueChange={setSelectedAnswer}
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
									className="flex-1 cursor-pointer"
								>
									<span className="font-medium mr-2">
										{OptionsMapping[option.id]}.
									</span>
									{option.text}
								</Label>
							</div>
						))}
					</RadioGroup>

					<div className="flex justify-between items-center mt-6">
						<Button
							variant="outline"
							onClick={() => handleNavigation('prev')}
							disabled={currentQuestionIndex === 0}
						>
							<ChevronLeft className="h-4 w-4 mr-2" />
							Previous
						</Button>
						<Button
							variant="outline"
							onClick={() => handleNavigation('next')}
							disabled={
								currentQuestionIndex === questions.length - 1
							}
						>
							Next
							<ChevronRight className="h-4 w-4 ml-2" />
						</Button>
					</div>

					<div className="flex gap-4 mt-6 flex-wrap">
						<Button variant="default" onClick={handleSaveAndNext}>
							Save & Next
						</Button>
						<Button variant="outline" onClick={handleClear}>
							Clear Response
						</Button>
						<Button
							variant="secondary"
							onClick={() => handleMarkForReview(true)}
						>
							Save & Mark for Review
						</Button>
						<Button
							variant="secondary"
							onClick={() => handleMarkForReview(false)}
						>
							Mark for Review
						</Button>
					</div>

					{currentQuestionIndex === questions.length - 1 && (
						<div className="mt-6">
							<Button
								onClick={handleSubmit}
								className="w-full"
								variant="default"
							>
								Submit Quiz
							</Button>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
