'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAllQuestionsWithAnswers } from '@/actions/quiz';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, RefreshCw, Filter, Eye, Pencil, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ViewDialog } from './view-dialog';
import { EditDialog } from './edit-dialog';
import { DeleteConfirmationDialog } from './delete-confirmation-dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Define type for the API response
interface ApiQuestion {
	id: number;
	text?: string;
	question?: string;
	subject: string;
	topic?: string;
	difficulty?: 'easy' | 'medium' | 'hard';
	options: {
		id: string;
		text: string;
	}[];
	correctOptionId?: string | null;
	explanation?: string;
}

// Interface for our internal use that matches all component requirements
interface IQuestion {
	id: string;
	question: string;
	text: string;
	subject: string;
	topic: string;
	difficulty: 'easy' | 'medium' | 'hard';
	options: { id: string; text: string; isCorrect: boolean }[];
	correctOptionId: string | null;
	explanation?: string;
}

// Type for the ViewDialog component props
interface ViewQuestion {
	text: string;
	options: { id: string; text: string }[];
	correctOptionId: string | null;
	subject?: string;
}

// Type for the EditDialog component props
interface EditQuestion {
	id: number;
	text: string;
	options: { id: string; text: string }[];
	correctOptionId: string | null;
	subject: string;
}

export function EnhancedQuestionList() {
	const [questions, setQuestions] = useState<IQuestion[]>([]);
	const [loading, setLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [filterSubject, setFilterSubject] = useState<string | null>(null);
	const [viewDialogOpen, setViewDialogOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(
		null
	);
	const { toast } = useToast();

	const fetchQuestions = useCallback(async () => {
		setLoading(true);
		try {
			const response = await getAllQuestionsWithAnswers();
			if (response.success && Array.isArray(response.questions)) {
				// Transform the questions to match our interface
				const formattedQuestions = response.questions.map((q: ApiQuestion) => ({
					id: q.id.toString(),
					question: q.text || q.question || '',
					text: q.text || q.question || '',
					subject: q.subject || 'General',
					topic: q.topic || 'General',
					difficulty: q.difficulty || 'medium',
					options: Array.isArray(q.options)
						? q.options.map((opt) => ({
								id: opt.id?.toString() || '',
								text: opt.text || '',
								isCorrect:
									opt.id?.toString() === q.correctOptionId,
						  }))
						: [],
					correctOptionId: q.correctOptionId || null,
					explanation: q.explanation || '',
				}));

				setQuestions(formattedQuestions);
			} else {
				toast({
					variant: 'destructive',
					title: 'Error',
					description: 'Failed to load questions',
				});
			}
		} catch (error) {
			console.error('Error fetching questions:', error);
			toast({
				variant: 'destructive',
				title: 'Error',
				description: 'An error occurred while loading questions',
			});
		} finally {
			setLoading(false);
		}
	}, [toast]);

	useEffect(() => {
		fetchQuestions();
	}, [fetchQuestions]);

	const handleViewQuestion = (question: IQuestion) => {
		setSelectedQuestion(question);
		setViewDialogOpen(true);
	};

	const handleEditQuestion = (question: IQuestion) => {
		setSelectedQuestion(question);
		setEditDialogOpen(true);
	};

	const handleDeleteQuestion = (question: IQuestion) => {
		setSelectedQuestion(question);
		setDeleteDialogOpen(true);
	};

	// const handleQuestionUpdated = () => {
	// 	fetchQuestions();
	// 	setEditDialogOpen(false);
	// };

	// const handleQuestionDeleted = () => {
	// 	fetchQuestions();
	// 	setDeleteDialogOpen(false);
	// };

	// Get unique subjects for filter
	const subjects = Array.from(
		new Set(questions.map((question) => question.subject))
	);

	const filteredQuestions = questions.filter(
		(question) =>
			question.question
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) &&
			(!filterSubject || question.subject === filterSubject)
	);

	const getDifficultyBadge = (difficulty: string) => {
		switch (difficulty) {
			case 'easy':
				return (
					<Badge className="bg-green-500 hover:bg-green-600">
						Easy
					</Badge>
				);
			case 'medium':
				return (
					<Badge className="bg-yellow-500 hover:bg-yellow-600">
						Medium
					</Badge>
				);
			case 'hard':
				return (
					<Badge className="bg-red-500 hover:bg-red-600">Hard</Badge>
				);
			default:
				return <Badge>Unknown</Badge>;
		}
	};

	// Loading Component
	const LoadingState = () => (
		<div className="space-y-4">
			{[1, 2, 3].map((i) => (
				<div
					key={i}
					className="flex items-center gap-4 p-4 border rounded-lg"
				>
					<div className="flex-1 space-y-2">
						<Skeleton className="h-4 w-3/4" />
						<div className="flex gap-2">
							<Skeleton className="h-3 w-16" />
							<Skeleton className="h-3 w-16" />
						</div>
					</div>
					<Skeleton className="h-8 w-24" />
				</div>
			))}
		</div>
	);

	return (
		<div className="space-y-4">
			<div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
				<div className="relative w-full sm:w-64">
					<Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="text"
						placeholder="Search questions..."
						className="pl-10"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<div className="flex gap-2 w-full sm:w-auto">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="w-full sm:w-auto"
							>
								<Filter className="h-4 w-4 mr-2" />
								{filterSubject || 'All Subjects'}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={() => setFilterSubject(null)}
							>
								All Subjects
							</DropdownMenuItem>
							{subjects.map((subject) => (
								<DropdownMenuItem
									key={subject}
									onClick={() => setFilterSubject(subject)}
								>
									{subject}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
					<Button
						variant="outline"
						size="sm"
						onClick={fetchQuestions}
						disabled={loading}
						className="w-full sm:w-auto"
					>
						<RefreshCw
							className={`h-4 w-4 mr-2 ${
								loading ? 'animate-spin' : ''
							}`}
						/>
						Refresh
					</Button>
				</div>
			</div>

			{loading ? (
				<LoadingState />
			) : filteredQuestions.length === 0 ? (
				<div className="text-center py-8 border rounded-lg bg-muted/20">
					{searchQuery || filterSubject ? (
						<>
							<p className="text-lg font-medium">
								No matching questions found
							</p>
							<p className="text-sm text-muted-foreground mt-1">
								Try different search terms or filters
							</p>
						</>
					) : (
						<>
							<p className="text-lg font-medium">
								No questions found
							</p>
							<p className="text-sm text-muted-foreground mt-1">
								Add a question to get started
							</p>
						</>
					)}
				</div>
			) : (
				<div className="grid gap-4">
					{filteredQuestions.map((question) => (
						<div
							key={question.id}
							className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/20 transition-colors gap-4"
						>
							<div className="flex-1">
								<h3 className="font-medium line-clamp-2">
									{question.question}
								</h3>
								<div className="flex flex-wrap gap-2 mt-2">
									<Badge
										variant="outline"
										className="bg-primary/10"
									>
										{question.subject}
									</Badge>
									<Badge
										variant="outline"
										className="bg-secondary/10"
									>
										{question.topic}
									</Badge>
									{getDifficultyBadge(question.difficulty)}
								</div>
							</div>
							<div className="flex items-center gap-2 self-end sm:self-auto">
								<Button
									variant="outline"
									size="sm"
									onClick={() => handleViewQuestion(question)}
								>
									<Eye className="h-4 w-4 mr-2" />
									View
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => handleEditQuestion(question)}
								>
									<Pencil className="h-4 w-4 mr-2" />
									Edit
								</Button>
								<Button
									variant="destructive"
									size="sm"
									onClick={() =>
										handleDeleteQuestion(question)
									}
								>
									<Trash2 className="h-4 w-4 mr-2" />
									Delete
								</Button>
							</div>
						</div>
					))}
				</div>
			)}

			{selectedQuestion && (
				<>
					<ViewDialog
						isOpen={viewDialogOpen}
						onOpenChange={setViewDialogOpen}
						question={selectedQuestion as unknown as ViewQuestion}
					/>
					<EditDialog
						isOpen={editDialogOpen}
						onOpenChange={setEditDialogOpen}
						question={{
							...selectedQuestion,
							id: parseInt(selectedQuestion.id)
						} as EditQuestion}
						setQuestions={(updatedQuestions) => {
							// Transform the API questions to match our IQuestion interface
							const formattedQuestions = updatedQuestions.map((q) => ({
								id: q.id.toString(),
								question: q.text,
								text: q.text,
								subject: q.subject,
								topic: 'General', // Assuming this is not in the API response
								difficulty: 'medium' as const, // Assuming this is not in the API response
								options: q.options.map((opt) => ({
									id: opt.id,
									text: opt.text,
									isCorrect: opt.id === q.correctOptionId
								})),
								correctOptionId: q.correctOptionId,
								explanation: ''
							}));
							setQuestions(formattedQuestions);
						}}
					/>
					<DeleteConfirmationDialog
						isOpen={deleteDialogOpen}
						onOpenChange={setDeleteDialogOpen}
						questionId={selectedQuestion.id}
						setQuestions={(updatedQuestions) => {
							// Transform the API questions to match our IQuestion interface
							const formattedQuestions = updatedQuestions.map((q) => ({
								id: q.id.toString(),
								question: q.text,
								text: q.text,
								subject: q.subject,
								topic: 'General', // Assuming this is not in the API response
								difficulty: 'medium' as const, // Assuming this is not in the API response
								options: q.options.map((opt) => ({
									id: opt.id,
									text: opt.text,
									isCorrect: opt.id === q.correctOptionId
								})),
								correctOptionId: q.correctOptionId,
								explanation: ''
							}));
							setQuestions(formattedQuestions);
						}}
					/>
				</>
			)}
		</div>
	);
}
