'use client';

import React, { useState } from 'react';
import { forgotPassword } from '@/actions/forgot-password';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

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

// Schema for forgot password
const forgotPasswordSchema = z.object({
	email: z.string().email('Please enter a valid email address'),
});

export function ForgotPasswordForm() {
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [emailSent, setEmailSent] = useState<boolean>(false);

	const form = useForm<z.infer<typeof forgotPasswordSchema>>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: '',
		},
	});

	async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
		setIsLoading(true);

		try {
			// Create FormData object
			const formData = new FormData();
			formData.append('email', values.email);

			// Submit form data
			const response = await forgotPassword(formData);

			if (response.success) {
				setEmailSent(true);
				toast({
					title: 'Reset Email Sent',
					description:
						'If an account exists with this email, you will receive password reset instructions.',
					variant: 'success',
				});
			} else {
				toast({
					title: 'Error',
					description:
						response.error ||
						'Something went wrong. Please try again.',
					variant: 'destructive',
				});
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'An unexpected error occurred. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-md mx-auto">
				<h1 className="text-2xl font-bold mb-6">Forgot Password</h1>

				{emailSent ? (
					<div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
						<h3 className="text-lg font-medium text-green-800">
							Check your email
						</h3>
						<p className="text-green-700 mt-2">
							If an account exists with this email, we've sent
							instructions to reset your password.
						</p>
						<div className="mt-4">
							<Link
								href="/login"
								className="text-indigo-600 hover:text-indigo-700"
							>
								Return to login
							</Link>
						</div>
					</div>
				) : (
					<>
						<p className="mb-4 text-gray-600">
							Enter your email address and we'll send you a link
							to reset your password.
						</p>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
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
								<Button
									type="submit"
									className="w-full"
									disabled={isLoading}
								>
									{isLoading ? (
										<>
											<span>Sending</span>
											<LoadingSpinner />
										</>
									) : (
										'Send Reset Link'
									)}
								</Button>
							</form>
						</Form>
						<p className="mt-4 text-sm text-gray-500">
							Remember your password?{' '}
							<Link
								href="/login"
								className="text-indigo-600 hover:text-indigo-700"
							>
								Login
							</Link>
						</p>
					</>
				)}
			</div>
		</div>
	);
}
