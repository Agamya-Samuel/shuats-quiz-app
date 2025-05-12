'use client';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { QuestionForm } from '@/app/admin/manage-quiz/_components/question-form';
import { updateQuestion, getAllQuestionsWithAnswers } from '@/actions/quiz';

// Updated Question interface to match the schema
interface Question {
	id: number;
	text: string;
	options: { id: string; text: string }[];
	correctOptionId: string | null;
	subject: string;
}

interface EditDialogProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	question: Question | null;
	setQuestions: (questions: Question[]) => void;
}

export function EditDialog({
	isOpen,
	onOpenChange,
	question,
	setQuestions,
}: EditDialogProps) {
	// Define the possible answer options as a type
	type CorrectAnswer = 'A' | 'B' | 'C' | 'D';

	// Map option ID to corresponding letter (A, B, C, D)
	const getCorrectAnswerLetter = (optionId: string | null): CorrectAnswer => {
		if (!optionId) return 'A';
		const mapping: Record<string, CorrectAnswer> = {
			'1': 'A',
			'2': 'B',
			'3': 'C',
			'4': 'D',
		};
		return mapping[optionId] || 'A';
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl">
				<DialogHeader>
					<DialogTitle>Edit Question</DialogTitle>
				</DialogHeader>
				{question && (
					<QuestionForm
						defaultValues={{
							question: question.text,
							subject: question.subject,
							optionA:
								question.options.find((o) => o.id === '1')
									?.text || '',
							optionB:
								question.options.find((o) => o.id === '2')
									?.text || '',
							optionC:
								question.options.find((o) => o.id === '3')
									?.text || '',
							optionD:
								question.options.find((o) => o.id === '4')
									?.text || '',
							correctAnswer: getCorrectAnswerLetter(
								question.correctOptionId
							),
						}}
						onSubmit={async (formData) => {
							const options = [
								{ id: '1', value: formData.optionA },
								{ id: '2', value: formData.optionB },
								{ id: '3', value: formData.optionC },
								{ id: '4', value: formData.optionD },
							];

							const correctOptionIdMap: Record<string, string> = {
								A: '1',
								B: '2',
								C: '3',
								D: '4',
							};

							const correctOptionId =
								correctOptionIdMap[formData.correctAnswer];

							const response = await updateQuestion({
								questionId: question.id,
								newText: formData.question,
								newOptions: options,
								newCorrectOptionId: correctOptionId,
								newSubject: formData.subject,
							});

							if (response.success) {
								const updatedQuestions =
									await getAllQuestionsWithAnswers();

								if (
									updatedQuestions.success &&
									updatedQuestions.questions
								) {
									// Questions are already in the correct format, no need for conversion
									setQuestions(updatedQuestions.questions);
								}
								onOpenChange(false);
							} else {
								console.error(
									'Failed to update question:',
									response.message
								);
							}
						}}
					/>
				)}
			</DialogContent>
		</Dialog>
	);
}
