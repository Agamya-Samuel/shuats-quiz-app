// actions/submit-answers.ts

'use server';

import { connectToDB } from '@/db';
import SubmittedAnswer from '@/db/models/submitted-answer';
import { revalidatePath } from 'next/cache';

// Submit a single answer (used for auto-saving)
export async function submitAnswer(
	userId: string,
	questionId: string,
	selectedOptionId: number
) {
	await connectToDB();

	try {
		// Upsert the answer (update if exists, insert if not)
		await SubmittedAnswer.findOneAndUpdate(
			{ userId, questionId },
			{ selectedOptionId },
			{ upsert: true, new: true }
		);

		return { success: true, message: 'Answer submitted successfully' };
	} catch (error) {
		console.error('Error submitting answer:', error);
		return { success: false, message: 'Failed to submit answer' };
	}
}

// Submit all answers for the quiz
export async function submitQuiz(
	userId: string,
	answers: { questionId: string; selectedOptionId: number }[]
) {
	await connectToDB();

	try {
		// Use Promise.all to submit all answers in parallel
		await Promise.all(
			answers.map(({ questionId, selectedOptionId }) =>
				SubmittedAnswer.findOneAndUpdate(
					{ userId, questionId },
					{ selectedOptionId },
					{ upsert: true, new: true }
				)
			)
		);

		// Revalidate the quiz page to reflect the changes
		revalidatePath('/user/quiz');

		return {
			success: true,
			message: 'Quiz submitted successfully',
		};
	} catch (error) {
		console.error('Error submitting quiz:', error);
		return {
			success: false,
			message: 'Failed to submit quiz',
		};
	}
}
