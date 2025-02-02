'use client';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { deleteQuestion, getAllQuestionsWithAnswers } from '@/actions/question';
import { toast } from '@/hooks/use-toast';
import { Question } from './question-list';

interface DeleteConfirmationDialogProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	questionId: string | null;
	setQuestions: (questions: Question[]) => void; // Use the Question type
}

export function DeleteConfirmationDialog({
	isOpen,
	onOpenChange,
	questionId,
	setQuestions,
}: DeleteConfirmationDialogProps) {
	const handleDelete = async () => {
		if (questionId) {
			try {
				const response = await deleteQuestion(questionId);
				if (response.success) {
					toast({
						title: 'Success',
						description: 'Question deleted successfully',
					});
					const updatedQuestions = await getAllQuestionsWithAnswers();
					if (
						updatedQuestions.success &&
						updatedQuestions.questions
					) {
						// Ensure options are correctly formatted
						const formattedQuestions =
							updatedQuestions.questions.map((question: Question) => ({
								...question,
								options: question.options.map(
									(option: { id: number; text: string }) => ({
										id: option.id,
										text:
											typeof option.text === 'string'
												? option.text
												: option.text,
									})
								),
							}));
						setQuestions(formattedQuestions);
					}
				} else {
					throw new Error(response.error);
				}
			} catch (error) {
				toast({
					title: 'Error',
					description:
						error instanceof Error
							? error.message
							: 'Failed to delete question',
					variant: 'destructive',
				});
			} finally {
				onOpenChange(false);
			}
		}
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently
						delete the question from the database.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete}>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
