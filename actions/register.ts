// actions/register.ts
'use server';

import argon2 from 'argon2';
import { connectToDB } from '@/db';
import User from '@/db/models/user';

export async function registerUser({
	email,
	name,
	password,
	mobile,
	rollNo,
	schoolName,
	branch,
	address,
}: {
	email: string;
	name: string;
	password: string;
	mobile: string;
	rollNo: string;
	schoolName: string;
	branch: string;
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
	const hashedPassword = await argon2.hash(password);

	// Create a new user
	const newUser = new User({
		email,
		password: hashedPassword,
		mobile,
		schoolName,
		rollNo,
		address,
		name,
		branch,
	});

	// Save the user to the database
	await newUser.save();
	return { success: 'User registered successfully' };
}
