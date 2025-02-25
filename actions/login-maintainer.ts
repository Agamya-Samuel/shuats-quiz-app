'use server';

import argon2 from 'argon2';
import { connectToDB } from '@/db';
import Maintainer from '@/db/models/maintainer';
import { generateToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import type { UserJwtPayload } from '@/types/auth';

// 30 days in seconds
const THIRTY_DAYS = 60 * 60 * 24 * 30;

export async function loginMaintainer({
	username,
	password,
}: {
	username: string;
	password: string;
}) {
	await connectToDB();

	// Find maintainer by username
	const maintainer = await Maintainer.findOne(
		{ username },
		{
			_id: 1,
			username: 1,
			password: 1,
		}
	).lean(); // Use lean() to get plain JavaScript objects

	if (!maintainer) {
		return { error: 'Maintainer not found' };
	}

	// Verify password
	const isPasswordValid = await argon2.verify(maintainer.password, password);
	if (!isPasswordValid) {
		return { error: 'Invalid password' };
	}

	// Convert _id to string explicitly
	const userId = maintainer._id.toString();

	// Create JWT payload with serializable data
	const payload: UserJwtPayload = {
		userId,
		username: maintainer.username,
		role: 'maintainer' as const,
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
