'use server';

import { connectToDB } from '@/db';
import User from '@/db/models/user';

interface UserData {
	_id: string;
	name: string;
	email: string;
	mobile: string;
	schoolName: string;
	rollNo: string;
	branch: string;
	address: string;
}

export async function getUser(userId: string) {
	await connectToDB();
	const user = await User.findById(userId, {
		_id: 1,
		name: 1,
		email: 1,
		mobile: 1,
		schoolName: 1,
		rollNo: 1,
		branch: 1,
		address: 1,
	});

	return { success: true, user };
}

export async function updateUser(userId: string, userData: UserData) {
	await connectToDB();
	await User.findByIdAndUpdate(userId, userData);
	return { success: true, message: 'User updated successfully' };
}
