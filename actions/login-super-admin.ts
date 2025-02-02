'use server';

import { cookies } from "next/headers";

export async function loginSuperAdmin({ password }: { password: string }) {
	if (password !== process.env.SUPER_ADMIN_PASSWORD) {
		return { error: 'Invalid password' };
	}
	// Fix: Await the cookies() promise and then set the cookie
	const cookieStore = await cookies();
	cookieStore.set('super_admin_auth', password);
	return { success: true };
}
