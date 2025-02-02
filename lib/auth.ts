// import jwt from 'jsonwebtoken';
import * as jose from 'jose';
import { UserJwtPayload } from '@/types/auth';

// Use a strong secret key
const JWT_SECRET = new TextEncoder().encode(
	process.env.JWT_SECRET || 'your-secret-key'
);

// Default expiration time - 30 days
const DEFAULT_EXPIRATION = '30d';

// export function generateToken(payload: UserJwtPayload): string {
// 	return jwt.sign(payload, JWT_SECRET, {
// 		expiresIn: parseInt(process.env.JWT_MAX_AGE || '60 * 60 * 24 * 30'),
// 	});
// }

export async function generateToken(payload: UserJwtPayload): Promise<string> {
	try {
		// Convert UserJwtPayload to a regular object to satisfy JWTPayload type
		const jwtPayload = { ...payload } as jose.JWTPayload;

		const token = await new jose.SignJWT(jwtPayload)
			.setProtectedHeader({ alg: 'HS256' })
			.setIssuedAt() // Add issued at time
			.setExpirationTime(process.env.JWT_EXPIRATION || DEFAULT_EXPIRATION)
			.sign(JWT_SECRET);

		return token;
	} catch (error) {
		console.error('Error generating token:', error);
		throw new Error('Failed to generate authentication token');
	}
}

export async function verifyToken(
	token: string
): Promise<UserJwtPayload | null> {
	try {
		const { payload } = await jose.jwtVerify(token, JWT_SECRET);
		return payload as unknown as UserJwtPayload;
	} catch (error) {
		// Only log the error type and message, not the full error object
		console.error(
			'Token verification failed:',
			error instanceof Error ? error.message : 'Unknown error'
		);
		return null;
	}
}
