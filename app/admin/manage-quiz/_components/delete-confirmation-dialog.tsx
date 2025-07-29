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
import { deleteQuestion } from '@/actions/quiz';
import { useToast } from '@/hooks/use-toast';

interface DeleteConfirmationDialogProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	questionId: string;
	setQuestions: (questions: any[]) => void;
}

export function DeleteConfirmationDialog({
	isOpen,
	onOpenChange,
	questionId,
	setQuestions,
}: DeleteConfirmationDialogProps) {
	const { toast } = useToast();

	const handleDelete = async () => {
		try {
			const response = await deleteQuestion(parseInt(questionId, 10));
			if (response.success) {
				toast({
					title: 'Success',
					description: 'Question deleted successfully',
				});
				// Optimistically update the UI
				// setQuestions((prev) =>
				// 	prev.filter((q) => q.id !== questionId)
				// );
			} else {
				toast({
					variant: 'destructive',
					title: 'Error',
					description:
						response.message || 'Failed to delete question',
				});
			}
		} catch (error) {
			toast({
				variant: 'destructive',
				title: 'Error',
				description: 'An unexpected error occurred',
			});
		}
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently
						delete the question.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete}>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

interface DeleteAllConfirmationDialogProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onConfirm: () => void;
}

export function DeleteAllConfirmationDialog({
	isOpen,
	onOpenChange,
	onConfirm,
}: DeleteAllConfirmationDialogProps) {
	return (
		<AlertDialog open={isOpen} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you absolutely sure?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently
						delete all questions from the database.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						className="bg-red-500 hover:bg-red-600"
					>
						Delete All
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
