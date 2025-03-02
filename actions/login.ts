// actions/login.ts
'use server';

import argon2 from 'argon2';
import { connectToDB } from '@/db';
import User from '@/db/models/user';
import { generateToken } from '@/lib/auth';
import { cookies } from 'next/headers';

// 30 days in seconds
const THIRTY_DAYS = 60 * 60 * 24 * 30;

export async function loginUser({
	email,
	password,
}: {
	email: string;
	password: string;
}) {
	await connectToDB();
	const user = await User.findOne(
		{ email },
		{
			_id: 1,
			name: 1,
			email: 1,
			mobile: 1,
			password: 1,
			schoolName: 1,
			rollNo: 1,
			branch: 1,
			address: 1,
		}
	).lean(); // Use lean() to get plain JavaScript objects

	if (!user) {
		return { error: 'User not found' };
	}
	const isPasswordValid = await argon2.verify(user.password, password);
	if (!isPasswordValid) {
		return { error: 'Invalid password' };
	}

	// Convert _id to string explicitly
	const userId = user._id.toString();

	// Create serializable payload
	const payload = {
		userId,
		name: user.name,
		email: user.email,
		mobile: user.mobile,
		school: user.schoolName,
		rollNo: user.rollNo,
		branch: user.branch,
		address: user.address,
		role: 'user' as const,
	};

	// Generate JWT token
	const token = await generateToken(payload);

	const cookieStore = await cookies();

	// Set the token in the cookie with proper maxAge
	cookieStore.set('token', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		maxAge: THIRTY_DAYS, // 30 days in seconds
		path: '/', // Make sure cookie is available on all paths
	});

	// Return only serializable data
	return { success: true };
}
