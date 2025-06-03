import * as jose from 'jose';
import { cookies } from 'next/headers';

import { AdminJwtPayload } from '@/types/admin';
import { SuperAdminJwtPayload } from '@/types/superadmin';
import { ForgotPasswordData, UserJwtPayload } from '@/types/user';

// Use a strong secret key
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}
const JWT_SECRET_BYTES = new TextEncoder().encode(JWT_SECRET);

// 30 days in seconds
const THIRTY_DAYS = 60 * 60 * 24 * 30;

// export function generateToken(payload: UserJwtPayload): string {
// 	return jwt.sign(payload, JWT_SECRET, {
// 		expiresIn: parseInt(process.env.JWT_MAX_AGE || '60 * 60 * 24 * 30'),
// 	});
// }

export async function generateToken(
  payload:
    | UserJwtPayload
    | AdminJwtPayload
    | SuperAdminJwtPayload
    | ForgotPasswordData,
): Promise<string> {
  try {
    // Convert UserJwtPayload to a regular object to satisfy JWTPayload type
    const jwtPayload = { ...payload } as jose.JWTPayload;

    const token = await new jose.SignJWT(jwtPayload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt() // Add issued at time
      .setExpirationTime(`${THIRTY_DAYS}s`) // Set expiration to 30 days
      .sign(JWT_SECRET_BYTES);

    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Failed to generate authentication token');
  }
}

export interface UserSessionPayload {
  userId: number;
  email: string;
  name: string;
  role: string;
  picture?: string; // Optional based on your JWT payload
  // Add other fields you put in the JWT
  [key: string]: any;
}

export async function getUserSession(): Promise<UserSessionPayload | null> {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get('token');

  if (!tokenCookie || !tokenCookie.value) {
    return null;
  }

  try {
    const { payload } = await jose.jwtVerify<UserSessionPayload>(
      tokenCookie.value,
      JWT_SECRET_BYTES,
    );
    return payload;
  } catch (error) {
    console.error('Failed to verify session token:', error);
    return null;
  }
}

export async function verifyToken(
  token: string,
): Promise<UserSessionPayload | null> {
  try {
    const { payload } = await jose.jwtVerify<UserSessionPayload>(
      token,
      JWT_SECRET_BYTES,
    );
    return payload;
  } catch (error) {
    console.error('Invalid token:', error); // Optionally log
    return null;
  }
}
