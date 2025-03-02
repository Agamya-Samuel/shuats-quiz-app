'use server';

import { connectToDB } from '@/db';
import User from '@/db/models/user';
import { generateToken } from '@/lib/auth';
import { cookies } from 'next/headers';

interface UpdateUserData {
	_id: string;
	name: string;
	email: string;
	mobile: string;
	schoolName: string;
	rollNo: string;
	branch: string;
	address: string;
}

export async function getUser(userId: string) {
	await connectToDB();
	const user = await User.findById(userId, {
		_id: 1,
		name: 1,
		email: 1,
		mobile: 1,
		schoolName: 1,
		rollNo: 1,
		branch: 1,
		address: 1,
	});

	return { success: true, user };
}

export async function updateUser(userId: string, userData: UpdateUserData) {
	try {
		await connectToDB();

		// Update user in database
		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{
				name: userData.name,
				email: userData.email,
				mobile: userData.mobile,
				schoolName: userData.schoolName,
				rollNo: userData.rollNo,
				branch: userData.branch,
				address: userData.address,
			},
			{ new: true } // Return the updated document
		).lean();

		if (!updatedUser) {
			return { success: false, error: 'User not found' };
		}

		// Create new token payload with updated user data
		const payload = {
			userId: updatedUser._id.toString(),
			name: updatedUser.name,
			email: updatedUser.email,
			mobile: updatedUser.mobile,
			school: updatedUser.schoolName,
			rollNo: updatedUser.rollNo,
			branch: updatedUser.branch,
			address: updatedUser.address,
			role: 'user' as const,
		};

		// Generate new token
		const token = await generateToken(payload);

		// Update cookie with new token
		const cookieStore = await cookies();
		cookieStore.set('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 30, // 30 days
			path: '/',
		});

		return {
			success: true,
			user: {
				...payload,
				_id: updatedUser._id.toString(),
			},
		};
	} catch (error) {
		console.error('Error updating user:', error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: 'Failed to update user',
		};
	}
}
