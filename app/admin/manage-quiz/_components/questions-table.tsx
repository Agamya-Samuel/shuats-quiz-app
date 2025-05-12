'use client';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye } from 'lucide-react';

// Define Question type for reuse
interface Question {
	id: number;
	text: string;
	options: { id: string; text: string }[];
	correctOptionId: string | null;
	subject: string;
}

interface QuestionsTableProps {
	questions: Question[];
	onView: (question: Question) => void;
	onEdit: (question: Question) => void;
	onDelete: (question: Question) => void;
}

export function QuestionsTable({
	questions,
	onView,
	onEdit,
	onDelete,
}: QuestionsTableProps) {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Question</TableHead>
					<TableHead>Options</TableHead>
					<TableHead>Correct Answer</TableHead>
					<TableHead className="w-[100px]">Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{questions.map((question) => (
					<TableRow key={question.id}>
						<TableCell className="font-medium">
							{question.text}
						</TableCell>
						<TableCell>
							{question.options.map((option) => (
								<div key={option.id}>
									{option.id}) {option.text}
								</div>
							))}
						</TableCell>
						<TableCell>
							<Badge>
								{question.correctOptionId !== null
									? question.correctOptionId
									: 'Not set'}
							</Badge>
						</TableCell>
						<TableCell>
							<div className="flex space-x-2">
								{/* Action buttons */}
								<Button
									variant="ghost"
									size="icon"
									onClick={() => onView(question)}
								>
									<Eye className="h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => onEdit(question)}
								>
									<Edit className="h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => onDelete(question)}
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
