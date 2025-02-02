// actions/login.ts
'use server';

import argon2 from 'argon2';
import { connectToDB } from '@/db';
import User from '@/db/models/user';
import { generateToken } from '@/lib/auth';
import { cookies } from 'next/headers';

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
	);

	if (!user) {
		return { error: 'User not found' };
	}
	const isPasswordValid = await argon2.verify(user.password, password);
	if (!isPasswordValid) {
		return { error: 'Invalid password' };
	}

	// payload
	const payload = {
		userId: user._id as string,
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
	
	// Set the token in the cookie
	cookieStore.set('token', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		maxAge: parseInt(process.env.JWT_MAX_AGE || '60 * 60 * 24 * 30'), // 30 days
	});

	return { success: 'Login successful', payload };
}
