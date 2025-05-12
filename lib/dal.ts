'use server';

import 'server-only';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { connectToDB } from '@/db';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as dbSchema from '@/db/schema';

type Role = 'user' | 'admin' | 'superadmin';

// Cache the session check for the duration of a request
export const getSession = cache(async () => {
	const token = (await cookies()).get('token')?.value;

	if (!token) {
		return { user: null, session: null };
	}

	const payload = await verifyToken(token);

	if (!payload) {
		return { user: null, session: null };
	}

	return {
		user: payload,
		session: token,
	};
});

// Verify user is authenticated and has the correct role
export const verifyAuth = cache(async (requiredRole?: Role) => {
	const { user } = await getSession();

	if (!user) {
		return null;
	}

	// If a specific role is required, check for it
	if (requiredRole) {
		if (user.role !== requiredRole) {
			return null;
		}
	}

	return user;
});

// Get authenticated user or redirect to login
export const getAuthOrRedirect = cache(
	async (requiredRole?: Role, redirectPath = '/login') => {
		const { user } = await getSession();

		if (!user) {
			redirect(redirectPath);
		}

		// If a specific role is required, check for it
		if (requiredRole && user.role !== requiredRole) {
			// Redirect to appropriate login page based on the required role
			if (requiredRole === 'admin') {
				redirect('/admin/login');
			} else if (requiredRole === 'superadmin') {
				redirect('/super-admin/login');
			} else {
				redirect('/login');
			}
		}

		return user;
	}
);

// User-specific data access functions
export const getUserData = cache(async (userId: number) => {
	// Verify the user is authenticated before proceeding
	const user = await verifyAuth('user');
	if (
		!user ||
		(user.userId !== userId &&
			user.role !== 'admin' &&
			user.role !== 'superadmin')
	) {
		return null;
	}

	// Connect to database
	const db = (await connectToDB()) as unknown as NodePgDatabase<
		typeof dbSchema
	>;

	// Fetch user data
	// This is just an example - you'll need to adjust this based on your schema
	const userData = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.id, userId),
		columns: {
			id: true,
			name: true,
			email: true,
			mobile: true,
			school: true,
			rollno: true,
			branch: true,
		},
	});

	return userData;
});

// Admin-specific data access functions
export const getAdminData = cache(async (adminId: number) => {
	// Verify the user is an admin before proceeding
	const user = await verifyAuth('admin');
	if (!user) {
		return null;
	}

	// Connect to database
	const db = (await connectToDB()) as unknown as NodePgDatabase<
		typeof dbSchema
	>;

	// Fetch admin data
	// Adjust based on your schema
	const adminData = await db.query.admins.findFirst({
		where: (admins, { eq }) => eq(admins.id, adminId),
		columns: {
			id: true,
			username: true,
		},
	});

	return adminData;
});

// Super admin-specific data access functions
export const getSuperAdminData = cache(async () => {
	// Verify the user is a super admin before proceeding
	const user = await verifyAuth('superadmin');
	if (!user) {
		return null;
	}

	return {
		// Add type assertion to tell TypeScript this is a SuperAdminJwtPayload
		username: (user as { username: string }).username,
		role: user.role,
	};
});
