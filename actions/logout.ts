'use server';

import { cookies } from 'next/headers';

export async function logout() {
	const cookieStore = await cookies();

	// Remove the token cookie
	cookieStore.delete({
		name: 'token',
		path: '/'
	});

	return { success: true };
}
