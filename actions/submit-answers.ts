// actions/submit-answers.ts

'use server';

import { connectToDB } from '@/db';
import SubmittedAnswer from '@/db/models/submitted-answer';
import { revalidatePath } from 'next/cache';

// Record quiz start time for a user
export async function recordQuizStartTime(userId: string) {
	await connectToDB();
	
	try {
		const startTime = new Date();
		
		// Store the start time in session storage or database
		// We'll store it in the database for each answer the user will submit
		
		return { 
			success: true, 
			message: 'Quiz start time recorded successfully',
			startTime: startTime 
		};
	} catch (error) {
		console.error('Error recording quiz start time:', error);
		return { 
			success: false, 
			message: 'Failed to record quiz start time' 
		};
	}
}

// Submit a single answer (used for auto-saving)
export async function submitAnswer(
	userId: string,
	questionId: string,
	selectedOptionId: number,
	startTime: Date | null = null
) {
	await connectToDB();

	try {
		// Upsert the answer (update if exists, insert if not)
		await SubmittedAnswer.findOneAndUpdate(
			{ userId, questionId },
			{ 
				selectedOptionId,
				...(startTime && { startTime })
			},
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
	answers: { questionId: string; selectedOptionId: number }[],
	startTime: Date | null = null
) {
	await connectToDB();

	try {
		const submittedAt = new Date();
		let timeTakenSeconds = null;
		
		// Calculate time taken if startTime is provided
		if (startTime) {
			timeTakenSeconds = Math.floor((submittedAt.getTime() - new Date(startTime).getTime()) / 1000);
		}
		
		// Use Promise.all to submit all answers in parallel
		await Promise.all(
			answers.map(({ questionId, selectedOptionId }) =>
				SubmittedAnswer.findOneAndUpdate(
					{ userId, questionId },
					{ 
						selectedOptionId,
						...(startTime && { startTime }),
						submittedAt,
						...(timeTakenSeconds !== null && { timeTakenSeconds })
					},
					{ upsert: true, new: true }
				)
			)
		);

		// Revalidate the quiz page to reflect the changes
		revalidatePath('/user/quiz');

		return {
			success: true,
			message: 'Quiz submitted successfully',
			timeTakenSeconds
		};
	} catch (error) {
		console.error('Error submitting quiz:', error);
		return {
			success: false,
			message: 'Failed to submit quiz',
		};
	}
}
