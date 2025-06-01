import { eq } from 'drizzle-orm';
import { OAuth2Client } from 'google-auth-library';
import * as jose from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { connectToDB } from '@/db';
import { addresses, uploadFiles, users } from '@/db/schema';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const JWT_SECRET_BYTES = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(request: Request) {
  try {
    const { token: idToken } = await request.json();

    // Ensure DB is connected before proceeding
    const db = await connectToDB();
    if (!db) {
      // connectToDB might return null or throw, handle appropriately
      console.error('Google Auth API Error: Failed to connect to database.');
      return NextResponse.json(
        { success: false, message: 'Database connection failed.' },
        { status: 500 },
      );
    }

    if (!idToken) {
      return NextResponse.json(
        { success: false, message: 'ID token not provided.' },
        { status: 400 },
      );
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.name) {
      return NextResponse.json(
        { success: false, message: 'Invalid Google token or missing data.' },
        { status: 400 },
      );
    }

    const { email, name, picture } = payload;

    // Check if user exists
    let user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .leftJoin(addresses, eq(users.addressId, addresses.id))
      .limit(1);

    let sessionToken;
    let profileComplete = false;
    let userIdToUse: number | undefined;

    if (user && user.length > 0) {
      // User exists
      const existingUser = user[0].users;
      userIdToUse = existingUser.id; // Capture userId
      const existingAddress = user[0].addresses;

      // Generate JWT using jose
      sessionToken = await new jose.SignJWT({
        userId: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        picture,
        role: 'user', // Assuming role for user
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(JWT_SECRET_BYTES);

      // Check profile completeness
      profileComplete = !!(
        existingUser.mobile &&
        existingUser.school &&
        existingUser.rollno &&
        existingUser.branch &&
        existingUser.addressId &&
        existingAddress
      );
    } else {
      // User does not exist, create new user
      // ! TODO: Fix this, remove the unique suffix
      // Generate a unique placeholder suffix, e.g., based on timestamp or a short random string
      const uniqueSuffix =
        Date.now().toString(36) + Math.random().toString(36).substring(2, 5);

      const newUserResult = await db
        .insert(users)
        .values({
          email,
          name,
          password: null, // Password is null for OAuth accounts
          // For NOT NULL fields, provide placeholders that user must update.
          // Ensure these placeholders are handled/validated during profile completion.
          // For unique fields like mobile, these placeholders must be unique.
          mobile: `oauth_mobile_${uniqueSuffix}`,
          school: 'OAuth User - School Needed',
          rollno: `oauth_rollno_${uniqueSuffix}`,
          branch: 'OAuth User - Branch Needed',
          isOAuthAccount: true, // Mark as OAuth account
          // addressId will be null initially and handled during profile completion
        })
        .returning();

      if (!newUserResult || newUserResult.length === 0) {
        return NextResponse.json(
          { success: false, message: 'Failed to create new user.' },
          { status: 500 },
        );
      }
      const newDbUser = newUserResult[0];
      userIdToUse = newDbUser.id; // Capture userId

      // Generate JWT for new user using jose
      sessionToken = await new jose.SignJWT({
        userId: newDbUser.id,
        email: newDbUser.email,
        name: newDbUser.name,
        picture,
        role: 'user', // Assuming role for user
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(JWT_SECRET_BYTES);
      profileComplete = false; // New user needs to complete profile
    }

    // After user is identified or created, and if picture URL exists, save it to uploadFiles
    if (userIdToUse && picture) {
      try {
        await db.insert(uploadFiles).values({
          userId: userIdToUse,
          documentType: 'profile_pic', // Or 'google_profile_pic' to distinguish
          mimeType: 'image/jpeg', // Assuming jpeg, Google URLs often don't specify
          fileUrl: picture,
          fileName: `google_avatar_${userIdToUse}.jpg`,
          fileKey: `google_oauth_avatar_${userIdToUse}`, // Placeholder key for external URL
          verified: true, // Auto-verified as it comes from Google
          rejected: false,
          // fileSize can be omitted or set to null/unknown
        });
        console.log(
          `Saved Google profile picture for user ${userIdToUse} to uploadFiles.`,
        );
      } catch (uploadError) {
        console.error(
          `Failed to save Google profile picture for user ${userIdToUse}:`,
          uploadError,
        );
        // Non-fatal error, continue with login/registration flow
      }
    }

    const cookieStore = await cookies();
    cookieStore.set('token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json({
      success: true,
      message:
        user && user.length > 0
          ? 'Login successful'
          : 'Registration successful, please complete your profile',
      profileComplete,
      token: sessionToken, // Sending token in response for client-side handling if needed, though cookie is set
      user: {
        id: userIdToUse, // Use the consistently named variable
        email,
        name,
        picture,
        // Potentially add role here too if needed by the client immediately
      },
    });
  } catch (error) {
    console.error('Google Auth API Error:', error);
    // Check if it's a Google specific error for a more precise message
    if (
      error instanceof Error &&
      error.message.includes('Invalid token signature')
    ) {
      return NextResponse.json(
        { success: false, message: 'Invalid Google token signature.' },
        { status: 401 },
      );
    }
    return NextResponse.json(
      { success: false, message: 'An internal server error occurred.' },
      { status: 500 },
    );
  }
}
