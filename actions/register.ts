// actions/register.ts
'use server';

import bcrypt from 'bcrypt';
// import { cookies } from 'next/headers';
import { connectToDB } from '@/db';
import User from '@/db/models/user';

export async function registerUser({
	email,
	password,
	mobile,
	schoolName,
	address,
}: {
	email: string;
	password: string;
	mobile: string;
	schoolName: string;
	address: string;
}) {
	// Connect to the database
	await connectToDB();

	// Check if the user already exists
	const isUserExisting = await User.findOne({ email });

	// If the user already exists, return an error
	if (isUserExisting) {
		return { error: 'User email already exists' }; // Return error if user exists
	}

	// Hash the password
	const hashedPassword = await bcrypt.hash(password, 10);

	// Create a new user
	const newUser = new User({
		email,
		password: hashedPassword,
		mobile,
		schoolName,
		address,
	});

	// Save the user to the database
	await newUser.save();
	return { success: 'User registered successfully' };
}
