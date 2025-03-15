'use client';

import React, { useState } from 'react';
import { resetPassword } from '@/actions/reset-password';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

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

// Schema for reset password
const resetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.max(100, 'Password is too long'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

export function ResetPasswordForm({ token }: { token: string }) {
	const { toast } = useToast();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [resetComplete, setResetComplete] = useState<boolean>(false);

	const form = useForm<z.infer<typeof resetPasswordSchema>>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	});

	async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
		setIsLoading(true);

		try {
			// Create FormData object
			const formData = new FormData();
			formData.append('password', values.password);
			formData.append('confirmPassword', values.confirmPassword);

			// Submit form data
			const response = await resetPassword(token, formData);

			if (response.success) {
				setResetComplete(true);
				toast({
					title: 'Password Reset Successful',
					description: 'Your password has been reset successfully.',
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
				<h1 className="text-2xl font-bold mb-6">Reset Password</h1>

				{resetComplete ? (
					<div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
						<h3 className="text-lg font-medium text-green-800">
							Password Reset Complete
						</h3>
						<p className="text-green-700 mt-2">
							Your password has been reset successfully.
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
							Enter your new password below.
						</p>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>New Password</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="Enter your new password"
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
											<FormLabel>
												Confirm Password
											</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder="Confirm your new password"
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
											<span>Resetting</span>
											<LoadingSpinner />
										</>
									) : (
										'Reset Password'
									)}
								</Button>
							</form>
						</Form>
					</>
				)}
			</div>
		</div>
	);
}
