'use server';

import argon2 from 'argon2';
import { eq, sql, desc, count } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { connectToDB } from '@/db';
import { admins, users } from '@/db/schema';
import * as dbSchema from '@/db/schema';
import { generateToken } from '@/lib/auth';
import { setCookie } from '@/lib/cookies';
import { verifyAuth } from '@/lib/dal';
import { sendAccountTerminationEmail, sendCustomEmail } from '@/lib/email';
import { AdminJwtPayload } from '@/types/admin';
import { revalidatePath } from 'next/cache';

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
    const db = (await connectToDB()) as unknown as NodePgDatabase<
      typeof dbSchema
    >;

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
  // First verify that the requester is an admin or superadmin
  const user = await verifyAuth();

  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return {
      success: false,
      message: 'Unauthorized: You do not have permission to view admins',
    };
  }

  try {
    // Connect to db
    const db = (await connectToDB()) as unknown as NodePgDatabase<
      typeof dbSchema
    >;

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
    const db = (await connectToDB()) as unknown as NodePgDatabase<
      typeof dbSchema
    >;

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
  // First verify that the requester is an admin or superadmin
  const user = await verifyAuth();

  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return {
      success: false,
      message: 'Unauthorized: You do not have permission to delete admins',
    };
  }

  try {
    // Connect to db
    const db = (await connectToDB()) as unknown as NodePgDatabase<
      typeof dbSchema
    >;

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

// Get all users from the database (without passwords)
export const getUsers = async () => {
  // First verify that the requester is an admin or superadmin
  const user = await verifyAuth();

  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return {
      success: false,
      message: 'Unauthorized: You do not have permission to view users',
    };
  }

  try {
    // Connect to db
    const db = (await connectToDB()) as unknown as NodePgDatabase<
      typeof dbSchema
    >;

    // Get users with their addresses
    const usersList = await db.query.users.findMany({
      columns: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        school: true,
        branch: true,
        rollno: true,
        createdAt: true,
        updatedAt: true,
      },
      with: {
        address: {
          columns: {
            city: true,
            state: true,
            country: true,
          },
        },
        uploads: true,
      },
    });

    return { success: true, users: usersList };
  } catch (error) {
    console.error('Error getting users:', error);
    return {
      success: false,
      message: 'Failed to fetch users',
    };
  }
};

// Delete a user account and all associated data
export async function deleteUser(userId: number) {
  // First verify that the requester is an admin or superadmin
  const user = await verifyAuth();

  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return {
      success: false,
      message: 'Unauthorized: You do not have permission to delete users',
    };
  }

  try {
    // Connect to db
    const db = (await connectToDB()) as unknown as NodePgDatabase<
      typeof dbSchema
    >;

    // Check if user exists
    const userToDelete = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!userToDelete) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    // Delete user - this will cascade delete all associated data due to our schema setup
    await db.delete(users).where(eq(users.id, userId));

    return { success: true, message: 'User deleted successfully' };
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      message: 'Failed to delete user',
    };
  }
}

export async function deleteUserWithNotification(
  userId: number,
  email: string,
  name: string,
  reason: string,
) {
  try {
    // Send termination email
    await sendAccountTerminationEmail(email, name, reason);

    // Delete user from database
    await deleteUser(userId);

    return {
      success: true,
      message: 'User deleted and notified successfully',
    };
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      message: 'Failed to delete user',
    };
  }
}

// Reset all submitted answers for a specific user
export async function resetUserSubmissions(userId: number) {
  // First verify that the requester is an admin or superadmin
  const user = await verifyAuth();

  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return {
      success: false,
      message: 'Unauthorized: You do not have permission to reset submissions',
    };
  }

  try {
    // Connect to db
    const db = (await connectToDB()) as unknown as NodePgDatabase<
      typeof dbSchema
    >;

    // Check if user exists
    const userToReset = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!userToReset) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    // Delete all submitted answers for this user
    // Delete all submitted answers for this user
    
    await db
      .delete(dbSchema.userSubmissions)
      .where(eq(dbSchema.userSubmissions.userId, userId));

    // Reset the quizAttempted flag for the user
    await db
      .update(users)
      .set({
        quizAttempted: false,
        quizCompletedAt: null,
        quizStartedAt: null,
      })
      .where(eq(users.id, userId));

    revalidatePath('/admin?section=submission');
    return {
      success: true,
      message: `Successfully reset submissions for user ${userToReset.email}`,
    };
  } catch (error) {
    console.error('Error resetting user submissions:', error);
    return {
      success: false,
      message: 'Failed to reset user submissions',
    };
  }
}

export const getUsersWithSubmissionCount = async () => {
  // First verify that the requester is an admin or superadmin
  const user = await verifyAuth();

  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return {
      success: false,
      message: 'Unauthorized: You do not have permission to view users',
    };
  }

  try {
    // Connect to db
    const db = (await connectToDB()) as unknown as NodePgDatabase<
      typeof dbSchema
    >;

    // Get total number of questions
    const totalQuestions = await db
      .select({ value: count() })
      .from(dbSchema.questions);

    // Get users with their submission count
    const usersWithSubmissions = await db
      .select({
        id: dbSchema.users.id,
        name: dbSchema.users.name,
        email: dbSchema.users.email,
        submissionCount: count(dbSchema.userSubmissions.id),
      })
      .from(dbSchema.users)
      .leftJoin(
        dbSchema.userSubmissions,
        eq(dbSchema.users.id, dbSchema.userSubmissions.userId),
      )
      .groupBy(dbSchema.users.id)
      .having(sql`${count(dbSchema.userSubmissions.id)} > 0`);

    return {
      success: true,
      users: usersWithSubmissions,
      totalQuestions: totalQuestions[0].value,
    };
  } catch (error) {
    console.error('Error getting users with submission count:', error);
    return {
      success: false,
      message: 'Failed to fetch users with submission count',
    };
  }
};

// Send a custom email to a user
export async function emailUser({
  email,
  subject,
  content,
}: {
  email: string;
  subject: string;
  content: string;
}) {
  // First verify that the requester is an admin or superadmin
  const user = await verifyAuth();

  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return {
      success: false,
      message: 'Unauthorized: You do not have permission to send emails',
    };
  }

  try {
    await sendCustomEmail(email, subject, content);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      message: `Failed to send email: ${error}`,
    };
  }
}
