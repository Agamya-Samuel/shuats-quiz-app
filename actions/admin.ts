'use server';

import { connectToDB } from '@/db';
import SubmittedAnswer from '@/db/models/submitted-answer';
import User from '@/db/models/user';
import { revalidatePath } from 'next/cache';

/**
 * Reset all submitted answers for a specific user
 * @param userEmail - The email of the user whose submissions should be reset
 */
export async function resetUserSubmissions(userEmail: string) {
	// Validate that an email was provided
	if (!userEmail || userEmail.trim() === '') {
		return {
			success: false,
			message: 'Email is required to reset user submissions',
		};
	}

	await connectToDB();

	try {
		// Find the user by email
		const user = await User.findOne({ email: userEmail });

		if (!user) {
			return {
				success: false,
				message: 'User not found',
			};
		}

		// Delete all submitted answers for this user
		const result = await SubmittedAnswer.deleteMany({ userId: user._id });

		// Revalidate relevant pages
		revalidatePath('/user/quiz');
		revalidatePath('/super-admin');
		revalidatePath('/user/leaderboard');

		return {
			success: true,
			message: `Successfully reset ${result.deletedCount} submissions for ${userEmail}`,
		};
	} catch (error) {
		console.error('Error resetting user submissions:', error);
		return {
			success: false,
			message: 'Failed to reset user submissions',
		};
	}
}
