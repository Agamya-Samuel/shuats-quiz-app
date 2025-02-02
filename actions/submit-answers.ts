// actions/submit-answers.ts

'use server';

import { connectToDB } from '@/db';
import SubmittedAnswer from '@/db/models/submitted-answer';

export async function submitAnswer(
	userId: string,
	questionId: string,
	selectedOptionId: number
) {
	await connectToDB();

	try {
		const submittedAnswer = new SubmittedAnswer({
			userId,
			questionId,
			selectedOptionId,
		});
		await submittedAnswer.save();
		return { success: true, message: 'Answer submitted successfully' };
	} catch (error) {
		console.error('Error submitting answers:', error);
		return { success: false, message: 'Failed to submit answer' };
	}
}
