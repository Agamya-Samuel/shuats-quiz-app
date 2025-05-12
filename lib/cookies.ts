import { cookies } from 'next/headers';

/**
 * Helper function to set a cookie with proper typing
 * This avoids the Promise<ReadonlyRequestCookies> issue
 */
export async function setCookie(
	name: string,
	value: string,
	options: {
		httpOnly?: boolean;
		secure?: boolean;
		maxAge?: number;
		path?: string;
	}
) {
	const cookieStore = await cookies();
	cookieStore.set(name, value, options);
}
