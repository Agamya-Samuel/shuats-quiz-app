// actions/submit-answers.ts

'use server';

import { connectToDB, db } from '@/db';
import { userSubmissions } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { and, eq } from 'drizzle-orm';

// Record quiz start time for a user
export async function recordQuizStartTime(userId: string, startTime?: Date) {
	await connectToDB();

	try {
		// Use provided startTime or create a new one
		const quizStartTime = startTime || new Date();

		// In the new schema, we don't store start time with submissions
		// This is just a utility function to track time client-side

		return {
			success: true,
			message: 'Quiz start time recorded successfully',
			startTime: quizStartTime,
		};
	} catch (error) {
		console.error('Error recording quiz start time:', error);
		return {
			success: false,
			message: 'Failed to record quiz start time',
		};
	}
}

// Submit a single answer
export async function submitAnswer(
	userId: number,
	questionId: number,
	selectedOption: string // Now a string like "A", "B", "C", etc.
) {
	await connectToDB();

	try {
		// Check if answer exists
		const existingAnswer = await db.query.userSubmissions.findFirst({
			where: and(
				eq(userSubmissions.userId, userId),
				eq(userSubmissions.questionId, questionId)
			),
		});

		if (existingAnswer) {
			// Update existing answer
			await db
				.update(userSubmissions)
				.set({
					option: selectedOption,
				})
				.where(
					and(
						eq(userSubmissions.userId, userId),
						eq(userSubmissions.questionId, questionId)
					)
				);
		} else {
			// Insert new answer
			await db.insert(userSubmissions).values({
				userId,
				questionId: questionId,
				option: selectedOption,
			});
		}

		return { success: true, message: 'Answer submitted successfully' };
	} catch (error) {
		console.error('Error submitting answer:', error);
		return { success: false, message: 'Failed to submit answer' };
	}
}

// Submit all answers for the quiz
export async function submitQuiz(
	userId: number,
	answers: { questionId: number; selectedOption: string }[]
) {
	await connectToDB();

	try {
		// Use Promise.all to submit all answers in parallel
		await Promise.all(
			answers.map(async ({ questionId, selectedOption }) => {
				// Check if answer exists
				const existingAnswer = await db.query.userSubmissions.findFirst(
					{
						where: and(
							eq(userSubmissions.userId, userId),
							eq(userSubmissions.questionId, questionId)
						),
					}
				);

				if (existingAnswer) {
					// Update existing answer
					await db
						.update(userSubmissions)
						.set({
							option: selectedOption,
						})
						.where(
							and(
								eq(userSubmissions.userId, userId),
								eq(userSubmissions.questionId, questionId)
							)
						);
				} else {
					// Insert new answer
					await db.insert(userSubmissions).values({
						userId,
						questionId: questionId,
						option: selectedOption,
					});
				}
			})
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
