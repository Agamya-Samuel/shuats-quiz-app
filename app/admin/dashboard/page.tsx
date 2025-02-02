// app/admin/dashboard/page.tsx
'use client';

import { getAllQuestionsWithAnswers } from '@/actions/question';
import { useState, useEffect, useCallback } from 'react';

// Define proper TypeScript interfaces
interface Option {
	id: number;
	text: string;
}

interface Question {
	_id: string;
	text: string;
	options: Option[];
	correctOptionId: number | null;
}

export default function AdminDashboardPage() {
	const [questions, setQuestions] = useState<Question[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// new

	const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
		null
	);
	const [isViewOpen, setIsViewOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);

	// Move the fetch logic to a memoized function
	const fetchQuestions = useCallback(async () => {
		try {
			console.log('Client: Starting to fetch questions');
			const result = await getAllQuestionsWithAnswers();

			if (!result) {
				throw new Error('No response from server');
			}

			if (result.success && Array.isArray(result.questions)) {
				setQuestions(result.questions);
			} else {
				throw new Error(result.error || 'Failed to load questions');
			}
		} catch (err) {
			console.error('Client Error:', err);
			setError(
				err instanceof Error
					? err.message
					: 'An unexpected error occurred'
			);
		} finally {
			setLoading(false);
		}
	}, []);

	// Use the memoized fetch function in useEffect
	useEffect(() => {
		let mounted = true;

		if (mounted) {
			fetchQuestions();
		}

		return () => {
			mounted = false;
		};
	}, [fetchQuestions]);

	// new

	// Simplified handlers
	const handleEdit = useCallback(
		(values: any) => {
			if (!selectedQuestion?._id) return;

			setQuestions((prev) =>
				prev.map((q) =>
					q._id === selectedQuestion._id
						? { ...values, _id: q._id }
						: q
				)
			);
			setIsEditOpen(false);
			setSelectedQuestion(null);
		},
		[selectedQuestion]
	);

	const handleDelete = useCallback(() => {
		if (!selectedQuestion?._id) return;

		setQuestions((prev) =>
			prev.filter((q) => q._id !== selectedQuestion._id)
		);
		setIsDeleteOpen(false);
		setSelectedQuestion(null);
	}, [selectedQuestion]);

	// new end

	if (loading) {
		return (
			<div className="flex items-center justify-center p-8">
				<div className="text-lg">Loading questions...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-8 bg-red-50 border border-red-200 rounded-lg">
				<h2 className="text-red-600 font-semibold mb-2">
					Error Loading Questions
				</h2>
				<p className="text-red-700">{error}</p>
			</div>
		);
	}

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-2xl font-bold mb-6">Question Dashboard</h1>
			{questions.length === 0 ? (
				<p className="text-gray-500">No questions available.</p>
			) : (
				<div className="space-y-4">
					{questions.map((question) => (
						<div
							key={question._id}
							className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
						>
							<h3 className="font-bold text-lg mb-4">
								{question.text}
							</h3>
							<div className="space-y-3">
								{question.options.map((option) => (
									<div
										key={option.id}
										className={`p-3 border rounded-md ${
											option.id ===
											question.correctOptionId
												? 'bg-green-50 border-green-200'
												: 'bg-white'
										}`}
									>
										<span className="font-medium">
											Option {option.id}:
										</span>{' '}
										{option.text}
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
