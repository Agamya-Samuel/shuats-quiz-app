'use client';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface ViewDialogProps {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	question: {
		text: string;
		options: { id: string; text: string }[];
		correctOptionId: string | null;
		subject?: string;
	} | null;
}

export function ViewDialog({
	isOpen,
	onOpenChange,
	question,
}: ViewDialogProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>View Question</DialogTitle>
				</DialogHeader>
				{question && (
					<div className="space-y-4">
						<div>
							<h4 className="font-medium">Question:</h4>
							<p>{question.text}</p>
						</div>
						<div>
							<h4 className="font-medium">Options:</h4>
							{question.options.map((option) => (
								<p key={option.id}>
									{option.id}) {option.text}
								</p>
							))}
						</div>
						<div>
							<h4 className="font-medium">Correct Answer:</h4>
							<Badge>
								{question.correctOptionId !== null
									? question.correctOptionId
									: 'Not set'}
							</Badge>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
