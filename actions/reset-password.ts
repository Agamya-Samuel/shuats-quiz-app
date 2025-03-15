'use server';

import { connectToDB } from '@/db';
import User from '@/db/models/user';
import { verifyToken } from '@/lib/auth';
import argon2 from 'argon2';
import { z } from 'zod';

// Schema for password reset
const resetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.max(100, 'Password is too long'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

export async function resetPassword(token: string, formData: FormData) {
	try {
		// Verify token
		const payload = await verifyToken(token);

		// Check if token is valid and has the correct purpose
		if (
			!payload ||
			!payload.userId ||
			payload.purpose !== 'password-reset'
		) {
			return {
				success: false,
				error: 'Invalid or expired reset link. Please request a new one.',
			};
		}

		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirmPassword') as string;

		// Validate password
		const result = resetPasswordSchema.safeParse({
			password,
			confirmPassword,
		});

		if (!result.success) {
			const fieldErrors = result.error.flatten().fieldErrors;
			const errorMessage =
				fieldErrors.password?.[0] ||
				fieldErrors.confirmPassword?.[0] ||
				'Invalid password';

			return { success: false, error: errorMessage };
		}

		// Connect to database
		await connectToDB();

		// Find user by ID
		const user = await User.findById(payload.userId);

		if (!user) {
			return {
				success: false,
				error: 'User not found. Please request a new reset link.',
			};
		}

		// Hash the new password
		const hashedPassword = await argon2.hash(password);

		// Update user's password
		user.password = hashedPassword;
		await user.save();

		return { success: true };
	} catch (error) {
		console.error('Reset password error:', error);
		return {
			success: false,
			error: 'An error occurred. Please try again later.',
		};
	}
}
