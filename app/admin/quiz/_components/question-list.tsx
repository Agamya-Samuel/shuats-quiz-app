'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAllQuestionsWithAnswers, deleteQuestion } from '@/actions/question';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
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
import { Edit, Trash2, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { subjects } from '@/lib/constants';
import LoadingComponent from '@/components/loading-component';
import { EditQuestionForm } from './edit-question-form';
import { toast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

interface Option {
	id: number;
	text: string;
}

export interface Question {
	_id: string;
	text: string;
	options: Option[];
	correctOptionId: number;
	subject: string;
}

const OptionsMapping = {
	1: 'A',
	2: 'B',
	3: 'C',
	4: 'D',
};

export function QuestionList() {
	const [questions, setQuestions] = useState<Question[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
		null
	);
	const [isViewOpen, setIsViewOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
	const [subjectCounts, setSubjectCounts] = useState<Record<string, number>>(
		{}
	);

	const fetchQuestions = useCallback(async () => {
		try {
			setIsLoading(true);
			const response = await getAllQuestionsWithAnswers();

			if (response.success && Array.isArray(response.questions)) {
				const fetchedQuestions = response.questions as Question[];
				setQuestions(fetchedQuestions);

				// Calculate subject counts
				const counts = fetchedQuestions.reduce(
					(acc: Record<string, number>, q: Question) => {
						acc[q.subject] = (acc[q.subject] || 0) + 1;
						return acc;
					},
					{}
				);
				setSubjectCounts(counts);
				setError(null);
			} else {
				setError(response.error || 'Failed to fetch questions');
			}
		} catch (err) {
			console.error('Fetch error:', err);
			setError('An error occurred while fetching questions');
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchQuestions();
	}, [fetchQuestions]);

	const handleDelete = useCallback(async () => {
		if (!selectedQuestion?._id) return;

		try {
			const response = await deleteQuestion(selectedQuestion._id);

			if (response.success) {
				toast({
					title: 'Success',
					description: response.success,
					variant: 'success',
				});
				setIsDeleteOpen(false);
				setSelectedQuestion(null);
				fetchQuestions(); // Refresh the list after successful delete
			} else {
				toast({
					title: 'Error',
					description: response.error || 'Failed to delete question',
					variant: 'destructive',
				});
			}
		} catch {
			toast({
				title: 'Error',
				description: 'An error occurred while deleting the question',
				variant: 'destructive',
			});
		}
	}, [selectedQuestion, fetchQuestions]);

	if (isLoading) return <LoadingComponent />;
	if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

	// Get questions for display
	const displayQuestions = selectedSubject
		? questions.filter((q) => q.subject === selectedSubject)
		: questions;

	return (
		<Card className="shadow-lg">
			<CardHeader>
				<CardTitle className="text-2xl font-bold mb-4">
					Question Bank
				</CardTitle>
				<div className="flex flex-wrap gap-2">
					<Button
						variant={!selectedSubject ? 'default' : 'outline'}
						onClick={() => setSelectedSubject(null)}
						className="flex items-center gap-2"
					>
						All Questions
						<Badge variant="secondary">{questions.length}</Badge>
					</Button>
					{subjects.map((subject) => (
						<Button
							key={subject.key}
							variant={
								selectedSubject === subject.key
									? 'default'
									: 'outline'
							}
							onClick={() => setSelectedSubject(subject.key)}
							className="flex items-center gap-2"
						>
							{subject.value}
							<Badge variant="secondary">
								{subjectCounts[subject.key] || 0}
							</Badge>
						</Button>
					))}
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-8">
					{displayQuestions.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{displayQuestions.map((question) => (
								<Card key={question._id} className="bg-white">
									<CardHeader className="p-4">
										<div className="flex justify-between items-start mb-2">
											<div className="font-medium flex-grow">
												{question.text}
											</div>
											<Badge className="ml-2">
												{
													subjects.find(
														(s) =>
															s.key ===
															question.subject
													)?.value
												}
											</Badge>
										</div>
										<div className="space-y-2 mt-2">
											{question.options.map((option) => (
												<div
													key={option.id}
													className={`p-2 text-sm border rounded-md ${
														option.id ===
														question.correctOptionId
															? 'bg-green-50 border-green-200 text-green-700'
															: 'bg-gray-50'
													}`}
												>
													<span className="font-medium">
														{
															OptionsMapping[
																option.id as keyof typeof OptionsMapping
															]
														}
														:
													</span>{' '}
													{option.text}
												</div>
											))}
										</div>
									</CardHeader>
									<CardContent className="p-4 pt-0">
										<div className="flex justify-end space-x-2">
											<Button
												variant="ghost"
												size="sm"
												onClick={() => {
													setSelectedQuestion(
														question
													);
													setIsViewOpen(true);
												}}
											>
												<Eye className="h-4 w-4 mr-1" />
												View
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => {
													setSelectedQuestion(
														question
													);
													setIsEditOpen(true);
												}}
											>
												<Edit className="h-4 w-4 mr-1" />
												Edit
											</Button>
											<Button
												variant="ghost"
												size="sm"
												className="text-red-500 hover:text-red-700"
												onClick={() => {
													setSelectedQuestion(
														question
													);
													setIsDeleteOpen(true);
												}}
											>
												<Trash2 className="h-4 w-4 mr-1" />
												Delete
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					) : (
						<div className="text-center py-8 text-gray-500">
							No questions found{' '}
							{selectedSubject &&
								`for ${
									subjects.find(
										(s) => s.key === selectedSubject
									)?.value
								}`}
						</div>
					)}
				</div>

				{/* View Dialog */}
				<Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Question Details</DialogTitle>
						</DialogHeader>
						{selectedQuestion && (
							<div className="space-y-4">
								<div>
									<h4 className="font-medium">Subject:</h4>
									<Badge className="mt-1">
										{
											subjects.find(
												(s) =>
													s.key ===
													selectedQuestion.subject
											)?.value
										}
									</Badge>
								</div>
								<Separator className="my-4 h-1" />
								<div>
									<h4 className="font-medium">Question:</h4>
									<p className="mt-1">
										{selectedQuestion.text}
									</p>
								</div>
								<div>
									<h4 className="font-medium">Options:</h4>
									<div className="space-y-2 mt-1">
										{selectedQuestion.options.map(
											(option) => (
												<div
													key={option.id}
													className={`p-2 text-sm border rounded-md ${
														option.id ===
														selectedQuestion.correctOptionId
															? 'bg-green-50 border-green-200 text-green-700'
															: 'bg-gray-50'
													}`}
												>
													<span className="font-medium">
														{
															OptionsMapping[
																option.id as keyof typeof OptionsMapping
															]
														}
														:
													</span>{' '}
													{option.text}
												</div>
											)
										)}
									</div>
								</div>
							</div>
						)}
					</DialogContent>
				</Dialog>

				{/* Edit Dialog */}
				<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
					<DialogContent className="max-w-3xl">
						<DialogHeader>
							<DialogTitle>Edit Question</DialogTitle>
						</DialogHeader>
						{selectedQuestion && (
							<EditQuestionForm
								questionId={selectedQuestion._id}
								defaultValues={{
									question: selectedQuestion.text,
									subject: selectedQuestion.subject,
									optionA:
										selectedQuestion.options.find(
											(o) => o.id === 1
										)?.text || '',
									optionB:
										selectedQuestion.options.find(
											(o) => o.id === 2
										)?.text || '',
									optionC:
										selectedQuestion.options.find(
											(o) => o.id === 3
										)?.text || '',
									optionD:
										selectedQuestion.options.find(
											(o) => o.id === 4
										)?.text || '',
									correctAnswer: OptionsMapping[
										selectedQuestion.correctOptionId as keyof typeof OptionsMapping
									] as 'A' | 'B' | 'C' | 'D',
								}}
								onSuccess={() => {
									setIsEditOpen(false);
									fetchQuestions();
								}}
							/>
						)}
					</DialogContent>
				</Dialog>

				{/* Delete Alert Dialog */}
				<AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Delete Question</AlertDialogTitle>
							<AlertDialogDescription>
								Are you sure you want to delete this question?
								This action cannot be undone.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={handleDelete}
								className="bg-red-500 hover:bg-red-600"
							>
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</CardContent>
		</Card>
	);
}
