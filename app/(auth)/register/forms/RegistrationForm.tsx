// app/(auth)/register/forms/RegistrationForm.tsx
'use client';

import React, { useState } from 'react';
import { registerUser } from '@/actions/register';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { registrationSchema } from '@/schemas/forms/registration-schema';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/loading-spinner';
import Link from 'next/link';

export function RegistrationForm() {
	const { toast } = useToast();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const form = useForm<z.infer<typeof registrationSchema>>({
		resolver: zodResolver(registrationSchema),
		defaultValues: {
			email: '',
			name: '',
			mobile: '',
			rollNo: '',
			schoolName: '',
			branch: '',
			address: '',
			password: '',
			confirmPassword: '',
		},
	});

	function onSubmit(values: z.infer<typeof registrationSchema>) {
		setIsLoading(true);

		// Save user data to database
		registerUser({
			email: values.email,
			name: values.name,
			mobile: values.mobile,
			rollNo: values.rollNo,
			schoolName: values.schoolName,
			branch: values.branch,
			address: values.address,
			password: values.password,
		})
			.then((response) => {
				setIsLoading(false); // Stop loading
				if (response.success) {
					toast({
						title: 'Registration Successful',
						description: 'You have successfully registered.',
						variant: 'success',
					});
					setTimeout(() => {
						// Redirect to login page after successful registration
						router.push('/login');
					}, 1000);
				} else {
					toast({
						title: 'Registration Failed',
						description: response.error,
						variant: 'destructive',
					});
				}
			})
			.catch((error) => {
				setIsLoading(false); // Stop loading on error
				toast({
					title: 'Registration Error',
					description: `An unexpected error occurred ${error}. Please try again later.`,
					variant: 'destructive',
				});
			});
	}
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-md mx-auto">
				<h1 className="text-2xl font-bold mb-6">Register</h1>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-1"
					>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter your email"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter your name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="mobile"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Mobile</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter your mobile number"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="schoolName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>School Name</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter your school name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="rollNo"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Roll Number</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter your roll number"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="branch"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Preferred Branch</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter your Preferred Branch"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="address"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Address</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter your address"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="Enter your password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="Confirm your password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							className="w-full"
							disabled={isLoading}
						>
							{isLoading ? (
								<>
									<span>Registering</span>
									<LoadingSpinner />
								</>
							) : (
								'Register'
							)}
						</Button>
					</form>
				</Form>
				<p className="mt-4 text-sm text-gray-500">
					Already have an account?{' '}
					<Link
						href="/login"
						className="text-indigo-600 hover:text-indigo-700"
					>
						Login
					</Link>
				</p>
			</div>
		</div>
	);
}
