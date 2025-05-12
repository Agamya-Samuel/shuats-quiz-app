'use server';

import { connectToDB, db } from '@/db';
import { admins } from '@/db/schema';
import { AdminJwtPayload } from '@/types/admin';
import argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import { generateToken } from '@/lib/auth';
import { setCookie } from '@/lib/cookies';

// 30 days in seconds
const THIRTY_DAYS = 60 * 60 * 24 * 30;

// Create a new admin account
export const createAdmin = async ({
	username,
	password,
}: {
	username: string;
	password: string;
}) => {
	try {
		// Connect to db
		await connectToDB();

		// Check if admin already exists
		const existingAdmin = await db.query.admins.findFirst({
			where: eq(admins.username, username),
		});

		if (existingAdmin) {
			return { success: false, message: 'Admin already exists' };
		}

		// Hash the password
		const hashedPassword = await argon2.hash(password, {
			type: argon2.argon2id,
			memoryCost: 19456,
			timeCost: 2,
			parallelism: 1,
		});

		// Insert new admin
		await db.insert(admins).values({
			username,
			password: hashedPassword,
		});

		return { success: true, message: 'Admin created successfully' };
	} catch (error) {
		console.error('Error creating admin:', error);
		return {
			success: false,
			message: `Error creating admin: ${error}`,
		};
	}
};

// Get all admins from the database (without passwords)
export const getAdmins = async () => {
	try {
		// Connect to db
		await connectToDB();

		// Get admins
		const adminsList = await db.query.admins.findMany({
			columns: {
				id: true,
				username: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		return { success: true, admins: adminsList };
	} catch (error) {
		console.error('Error getting admins:', error);
		return {
			success: false,
			message: `Error getting admins: ${error}`,
		};
	}
};

// Admin login
export async function loginAdmin({
	username,
	password,
}: {
	username: string;
	password: string;
}) {
	try {
		// Connect to db
		await connectToDB();

		// Find admin by email
		const admin = await db.query.admins.findFirst({
			where: eq(admins.username, username),
		});

		if (!admin) {
			return {
				success: false,
				message: 'Admin not found',
			};
		}

		// Verify password
		const isPasswordValid = await argon2.verify(admin.password, password);
		if (!isPasswordValid) {
			return {
				success: false,
				message: 'Invalid password',
			};
		}

		// Create JWT payload
		const payload: AdminJwtPayload = {
			userId: admin.id,
			username: admin.username,
			role: 'admin',
		};

		// Generate JWT token
		const token = await generateToken(payload);

		// Set the token in the cookie with proper maxAge
		await setCookie('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: THIRTY_DAYS, // 30 days in seconds
			path: '/', // Make sure cookie is available on all paths
		});

		// Return only serializable data
		return { success: true };
	} catch (error) {
		console.error('Login error:', error);
		return {
			success: false,
			message: `Failed to login: ${error}`,
		};
	}
}

// Delete an admin account
export async function deleteAdmin(adminId: number) {
	try {
		// Connect to db
		await connectToDB();

		// Check if admin exists
		const admin = await db.query.admins.findFirst({
			where: eq(admins.id, adminId),
		});

		if (!admin) {
			return {
				success: false,
				message: 'Admin not found',
			};
		}

		// Delete admin
		await db.delete(admins).where(eq(admins.id, adminId));

		return { success: true, message: 'Admin deleted successfully' };
	} catch (error) {
		console.error('Error deleting admin:', error);
		return {
			success: false,
			message: `Failed to delete admin: ${error}`,
		};
	}
}
