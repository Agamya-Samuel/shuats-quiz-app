'use server';

import { cookies } from 'next/headers';
import { generateToken } from '@/lib/auth';
import type { UserJwtPayload } from '@/types/auth';

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
		maxAge: parseInt(process.env.JWT_MAX_AGE || '86400'), // 30 days
	});
	return { success: true, payload };
}
