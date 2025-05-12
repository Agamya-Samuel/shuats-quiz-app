import * as z from 'zod';

// Define the Zod schema for registration form validation
export const registrationSchema = z
	.object({
		email: z
			.string()
			.email('Please enter a valid email address.')
			.nonempty('Email field cannot be empty.'),
		name: z.string().nonempty('Name field cannot be empty.'),
		mobile: z.string().regex(/^[0-9]{10}$/, {
			message: 'Please enter a valid 10-digit mobile number.',
		}),
		rollno: z.string().nonempty('Roll number field cannot be empty.'),
		school: z.string().nonempty('School name field cannot be empty.'),
		branch: z.string().nonempty('Branch field cannot be empty.'),
		// Address fields
		country: z.string().nonempty('Country field cannot be empty.'),
		address1: z.string().nonempty('Address line 1 cannot be empty.'),
		address2: z.string().optional(),
		area: z.string().nonempty('Area field cannot be empty.'),
		city: z.string().nonempty('City field cannot be empty.'),
		pincode: z.string().nonempty('Pincode field cannot be empty.'),
		state: z.string().nonempty('State field cannot be empty.'),
		// Password fields
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters long'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'], // Path to the field that should show the error
	});