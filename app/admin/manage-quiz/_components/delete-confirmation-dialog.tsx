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
import { deleteQuestion, getAllQuestionsWithAnswers } from '@/actions/quiz';
import { toast } from '@/hooks/use-toast';

// Updated Question interface to match the schema
interface Question {
	id: number;
	text: string;
	options: { id: string; text: string }[];
	correctOptionId: string | null;
	subject: string;
}

interface DeleteConfirmationDialogProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	questionId: string | null;
	setQuestions: (questions: Question[]) => void;
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
				const response = await deleteQuestion(Number(questionId));
				if (response.success) {
					toast({
						title: 'Success',
						description:
							response.message || 'Question deleted successfully',
					});
					const updatedQuestions = await getAllQuestionsWithAnswers();
					if (
						updatedQuestions.success &&
						updatedQuestions.questions
					) {
						// Questions are already in the correct format, no need for complex conversions
						setQuestions(updatedQuestions.questions);
					}
				} else {
					throw new Error(
						response.message || 'Failed to delete question'
					);
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
