'use server';

import { generateToken } from '@/lib/auth';
import { setCookie } from '@/lib/cookies';
import { SuperAdminJwtPayload } from '@/types/superadmin';
import { connectToDB } from '@/db';
import { users, userSubmissions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as dbSchema from '@/db/schema';

const THIRTY_DAYS = 60 * 60 * 24 * 30;

export async function loginSuperAdmin({ username }: { username: string }) {
	try {
		if (username !== process.env.SUPER_ADMIN_USERNAME) {
			return {
				success: false,
				message: 'Invalid Passsword',
			};
		}
		// Generate JWT token
		const payload: SuperAdminJwtPayload = {
			userId: 1,
			username: process.env.SUPER_ADMIN_USERNAME || 'superadmin',
			role: 'superadmin',
		};
		const token = await generateToken(payload);

		// Set the token in the cookie
		await setCookie('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: THIRTY_DAYS, // 30 days in seconds
			path: '/', // Make sure cookie is available on all paths
		});

		return { success: true, message: 'Super admin logged in successfully' };
	} catch (error) {
		console.error('Error logging in super admin:', error);
		return {
			success: false,
			message: `Failed to login super admin: ${error}`,
		};
	}
}

/**
 * Reset all submitted answers for a specific user
 * @param userEmail - The email of the user whose submissions should be reset
 */
export async function resetUserSubmissions(userEmail: string) {
	try {
		// Validate that an email was provided
		if (!userEmail || userEmail.trim() === '') {
			return {
				success: false,
				message: 'Email is required to reset user submissions',
			};
		}

		// Connect to the database
		const db = await connectToDB() as unknown as NodePgDatabase<typeof dbSchema>;

		// Find the user by email
		const user = await db.query.users.findFirst({
			where: eq(users.email, userEmail),
		});

		if (!user) {
			return {
				success: false,
				message: 'User not found',
			};
		}

		// Delete all submitted answers for this user using Drizzle
		// const result = await db
		await db
			.delete(userSubmissions)
			.where(eq(userSubmissions.userId, user.id));

		// Revalidate relevant pages
		revalidatePath('/user/quiz');
		revalidatePath('/super-admin');
		revalidatePath('/user/leaderboard');

		return {
			success: true,
			message: `Successfully reset submissions for ${userEmail}`,
		};
	} catch (error) {
		console.error('Error resetting user submissions:', error);
		return {
			success: false,
			message: 'Failed to reset user submissions',
		};
	}
}
