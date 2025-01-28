// actions/login.ts
'use server';

import bcrypt from 'bcrypt';
import { connectToDB } from '@/db';
import User from '@/db/models/User';

export async function loginUser({
	email,
	password,
}: {
	email: string;
	password: string;
}) {
	await connectToDB();
	const user = await User.findOne({ email });
	if (!user) {
		return { error: 'User not found' };
	}
	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
		return { error: 'Invalid password' };
	}
	return { success: 'Login successful' };
}
