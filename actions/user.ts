'use server';

import argon2 from 'argon2';
import { connectToDB } from '@/db';
import { users, addresses } from '@/db/schema';
import { generateToken, verifyToken } from '@/lib/auth';
import { setCookie } from '@/lib/cookies';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import {
	AddressData,
	UserJwtPayload,
	UpdateUserData,
	ForgotPasswordData,
} from '@/types/user';
import { z } from 'zod';
import { sendPasswordResetEmail } from '@/lib/email';

// Import schema type for transaction
import * as dbSchema from '@/db/schema';

// Register a new user
export async function registerUser({
	email,
	name,
	password,
	mobile,
	rollno,
	school,
	branch,
	address,
}: {
	email: string;
	name: string;
	password: string;
	mobile: string;
	rollno: string;
	school: string;
	branch: string;
	address: AddressData;
}) {
	try {
		// Connect to the database
		const db = await connectToDB() as unknown as NodePgDatabase<typeof dbSchema>;

		// Check if the user already exists
		const existingUser = await db.query.users.findFirst({
			where: eq(users.email, email),
		});

		// If the user already exists, return an error
		if (existingUser) {
			return { success: false, message: 'User email already exists' };
		}

		// Hash the password
		const hashedPassword = await argon2.hash(password);

		// Use a transaction to ensure both address and user are saved
		const result = await db.transaction(async (tx: NodePgDatabase<typeof dbSchema>) => {
			// Create address first
			const [newAddress] = await tx
				.insert(addresses)
				.values({
					country: address.country,
					address1: address.address1,
					address2: address.address2 || null,
					area: address.area,
					city: address.city,
					pincode: address.pincode,
					state: address.state,
				})
				.returning({ id: addresses.id });

			// Create user with reference to address
			const [newUser] = await tx
				.insert(users)
				.values({
					email,
					password: hashedPassword,
					mobile,
					school,
					rollno,
					name,
					branch,
					addressId: newAddress.id,
				})
				.returning({ id: users.id });

			return { addressId: newAddress.id, userId: newUser.id };
		});

		return {
			success: true,
			message: 'User registered successfully',
			userId: result.userId,
		};
	} catch (error) {
		console.error('Error registering user:', error);
		return {
			success: false,
			message: `Failed to register user: ${
				error instanceof Error ? error.message : String(error)
			}`,
		};
	}
}

// Log in a user
export async function loginUser({
	email,
	password,
}: {
	email: string;
	password: string;
}) {
	try {
		// Connect to the database
		const db = await connectToDB() as unknown as NodePgDatabase<typeof dbSchema>;

		// Find user by email and include address information
		const user = await db.query.users.findFirst({
			where: eq(users.email, email),
			with: {
				address: true,
			},
		});

		// If user doesn't exist, return an error
		if (!user) {
			return { success: false, message: 'User not found' };
		}

		// Verify the password
		const isValidPassword = await argon2.verify(user.password, password);

		// If the password is not valid, return an error
		if (!isValidPassword) {
			return { success: false, message: 'Invalid credentials' };
		}

		// Create a JWT payload
		const payload: UserJwtPayload = {
			userId: user.id,
			role: 'user',
			name: user.name,
			email: user.email,
			mobile: user.mobile,
			school: user.school,
			rollno: user.rollno,
			branch: user.branch,
			address: user.address as AddressData,
		};

		// Generate a JWT token
		const token = await generateToken(payload);

		// Set the token in a cookie
		await setCookie('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7, // 7 days
			path: '/',
		});

		// Return the user data (without the password)
		return {
			success: true,
			message: 'User logged in successfully',
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				mobile: user.mobile,
				school: user.school,
				rollno: user.rollno,
				branch: user.branch,
				address: user.address as AddressData,
			},
		};
	} catch (error) {
		console.error('Login error:', error);
		return {
			success: false,
			message: 'Failed to login user. Please try again.',
		};
	}
}

// Get a user by ID
export async function getUser(userId: number) {
	try {
		// Connect to the database
		const db = await connectToDB() as unknown as NodePgDatabase<typeof dbSchema>;

		const user = await db.query.users.findFirst({
			where: eq(users.id, userId),
			columns: {
				id: true,
				name: true,
				email: true,
				mobile: true,
				school: true,
				rollno: true,
				branch: true,
			},
			with: {
				address: true,
			},
		});

		return { success: true, user };
	} catch (error) {
		console.error('Error getting user:', error);
		return {
			success: false,
			message: 'Failed to get user',
		};
	}
}

// Update a user
export async function updateUser(userId: number, userData: UpdateUserData) {
	try {
		const db = await connectToDB() as unknown as NodePgDatabase<typeof dbSchema>;

		// Check if user exists
		const existingUser = await db.query.users.findFirst({
			where: eq(users.id, userId),
			with: {
				address: true,
			},
		});

		if (!existingUser) {
			return { success: false, message: 'User not found' };
		}

		// Use a transaction to update both user and address
		await db.transaction(async (tx: NodePgDatabase<typeof dbSchema>) => {
			// Update user
			await tx
				.update(users)
				.set({
					name: userData.name,
					email: userData.email,
					mobile: userData.mobile,
					school: userData.school,
					rollno: userData.rollno,
					branch: userData.branch,
				})
				.where(eq(users.id, userId));

			// Update address if it exists
			if (existingUser.address && userData.address) {
				await tx
					.update(addresses)
					.set({
						country: userData.address.country,
						address1: userData.address.address1,
						address2: userData.address.address2 || null,
						area: userData.address.area,
						city: userData.address.city,
						pincode: userData.address.pincode,
						state: userData.address.state,
					})
					.where(eq(addresses.id, existingUser.address.id));
			}
		});

		// Get the updated user
		const updatedUser = await db.query.users.findFirst({
			where: eq(users.id, userId),
			with: {
				address: true,
			},
		});

		if (!updatedUser) {
			return { success: false, error: 'User not found after update' };
		}

		// Create new token payload with updated user data
		const payload: UserJwtPayload = {
			userId: updatedUser.id,
			role: 'user',
			name: updatedUser.name,
			email: updatedUser.email,
			mobile: updatedUser.mobile,
			school: updatedUser.school,
			rollno: updatedUser.rollno,
			branch: updatedUser.branch,
			address: updatedUser.address as AddressData,
		};

		// Generate new token
		const token = await generateToken(payload);

		// Update cookie with new token
		await setCookie('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7, // 7 days
			path: '/',
		});

		return {
			success: true,
			message: 'User updated successfully',
			user: {
				id: updatedUser.id,
				name: updatedUser.name,
				email: updatedUser.email,
				mobile: updatedUser.mobile,
				school: updatedUser.school,
				rollno: updatedUser.rollno,
				branch: updatedUser.branch,
				address: updatedUser.address || null,
			},
		};
	} catch (error) {
		console.error('Error updating user:', error);
		return {
			success: false,
			message: 'Failed to update user',
		};
	}
}

// Schema for forgot password
const forgotPasswordSchema = z.object({
	email: z.string().email('Please enter a valid email address'),
});

/**
 * Send password reset email to user
 */
export async function forgotPassword(formData: FormData) {
	try {
		const email = formData.get('email') as string;

		// Validate email
		const result = forgotPasswordSchema.safeParse({ email });
		if (!result.success) {
			return {
				success: false,
				message: 'Please enter a valid email address',
			};
		}

		// Connect to database
		const db = await connectToDB() as unknown as NodePgDatabase<typeof dbSchema>;

		// Find user by email
		const user = await db.query.users.findFirst({
			where: eq(users.email, email),
		});

		// If user not found, still return success to prevent email enumeration
		if (!user) {
			return { success: true, message: 'Email sent successfully' };
		}

		// Create reset token payload
		const forgotPasswordPayload: ForgotPasswordData = {
			id: user.id,
			email: user.email,
			purpose: 'password-reset',
			role: 'user',
		};

		// Generate reset token (valid for 1 hour)
		const resetToken = await generateToken(forgotPasswordPayload);

		// Send password reset email
		const emailSent = await sendPasswordResetEmail(user.email, resetToken);

		if (!emailSent) {
			return {
				success: false,
				message: 'Failed to send reset email. Please try again.',
			};
		}

		return { success: true, message: 'Email sent successfully' };
	} catch (error) {
		console.error('Forgot password error:', error);
		return {
			success: false,
			message: 'An error occurred. Please try again later.',
		};
	}
}

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

/**
 * Reset user password using token from email
 */
export async function resetPassword(token: string, formData: FormData) {
	try {
		// Verify token
		const payload = await verifyToken(token);

		// Check if token is valid and has the correct purpose
		if (
			!payload ||
			!('id' in payload) ||
			payload.purpose !== 'password-reset'
		) {
			return {
				success: false,
				message:
					'Invalid or expired reset link. Please request a new one.',
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

			return { success: false, message: errorMessage };
		}

		// Connect to database
		const db = await connectToDB() as unknown as NodePgDatabase<typeof dbSchema>;

		// Find user by ID
		const existingUser = await db.query.users.findFirst({
			where: eq(users.id, payload.id),
		});

		if (!existingUser) {
			return {
				success: false,
				message: 'User not found. Please request a new reset link.',
			};
		}

		// Hash the new password
		const hashedPassword = await argon2.hash(password);

		// Update user's password
		await db
			.update(users)
			.set({ password: hashedPassword })
			.where(eq(users.id, payload.id));

		return { success: true };
	} catch (error) {
		console.error('Password reset error:', error);
		return {
			success: false,
			message: 'An error occurred. Please try again later.',
		};
	}
}
