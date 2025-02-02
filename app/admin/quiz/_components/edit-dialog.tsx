'use client';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { QuestionForm } from '@/app/admin/quiz/_components/question-form';
import { updateQuestion, getAllQuestionsWithAnswers } from '@/actions/question';
import { Question } from './question-list';

interface EditDialogProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	question: Question | null; // Use the Question type
	setQuestions: (questions: Question[]) => void; // Use the Question type
}

export function EditDialog({
	isOpen,
	onOpenChange,
	question,
	setQuestions,
}: EditDialogProps) {
	const ANSWER_OPTIONS = ['A', 'B', 'C', 'D'] as const;
	type CorrectAnswer = (typeof ANSWER_OPTIONS)[number];

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
							subject: question.subject, // Add missing required subject field
							optionA: question.options[0]?.text || '',
							optionB: question.options[1]?.text || '',
							optionC: question.options[2]?.text || '',
							optionD: question.options[3]?.text || '',
							correctAnswer: ANSWER_OPTIONS[
								question.correctOptionId
									? question.correctOptionId - 1
									: 0
							] as CorrectAnswer,
						}}
						onSubmit={async (formData) => {
							const response = await updateQuestion({
								questionId: question._id,
								newText: formData.question,
								newOptions: [
									{ id: 1, text: formData.optionA },
									{ id: 2, text: formData.optionB },
									{ id: 3, text: formData.optionC },
									{ id: 4, text: formData.optionD },
								],
								newCorrectOptionId:
									ANSWER_OPTIONS.indexOf(formData.correctAnswer) + 1,
								newSubject: formData.subject,
							});

							if (response.success) {
								const updatedQuestions = 
									await getAllQuestionsWithAnswers();
								if (
									updatedQuestions.success &&
									updatedQuestions.questions
								) {
									// Ensure options are correctly formatted
									const formattedQuestions =
										updatedQuestions.questions.map(
											(question: Question) => ({
												...question,
												options: question.options.map(
													(option: {
														id: number;
														text: string;
													}) => ({
														id: option.id,
														text: option.text,
													})
												),
											})
										);
									setQuestions(formattedQuestions);
								}
								onOpenChange(false);
							} else {
								console.error(
									'Failed to update question:',
									response.error
								);
							}
						}}
					/>
				)}
			</DialogContent>
		</Dialog>
	);
}
