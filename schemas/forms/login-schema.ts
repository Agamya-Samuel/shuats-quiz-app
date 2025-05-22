import * as z from 'zod';

export const loginSchema = z.object({
	email: z
		.string()
		.email('Please enter a valid email address.')
		.nonempty('Email field cannot be empty'),
	password: z.string().nonempty('Password field cannot be empty.'),
});

export const adminLoginSchema = z.object({
	username: z
		.string()
		.nonempty('Username field cannot be empty.'),
	password: z.string().nonempty('Password field cannot be empty.'),
});

export const superAdminLoginSchema = z.object({
	username: z.string().nonempty('Username field cannot be empty.'),
});
