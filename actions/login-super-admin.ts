'use server';

import { cookies } from 'next/headers';
import { generateToken } from '@/lib/auth';
import type { UserJwtPayload } from '@/types/auth';

const THIRTY_DAYS = 60 * 60 * 24 * 30;

export async function loginSuperAdmin({ password }: { password: string }) {
	if (password !== process.env.SUPER_ADMIN_PASSWORD) {
		return { error: 'Invalid password' };
	}
	// Generate JWT token
	const payload: UserJwtPayload = {
		userId: 'super_admin',
		username: process.env.SUPER_ADMIN_USERNAME,
		role: 'superadmin' as const,
	};
	const token = await generateToken(payload);

	const cookieStore = await cookies();

	// Set the token in the cookie
	cookieStore.set('token', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		maxAge: THIRTY_DAYS, // 30 days in seconds
		path: '/', // Make sure cookie is available on all paths
	});
	return { success: true };
}
