'use client';

import React, { useState, useEffect } from 'react';
import { resetPassword } from '@/actions/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
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
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Lock, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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

// Password strength calculation
const calculatePasswordStrength = (
	password: string
): {
	score: number;
	criteria: {
		length: boolean;
		uppercase: boolean;
		lowercase: boolean;
		numbers: boolean;
		special: boolean;
	};
	isValid: boolean;
} => {
	if (!password)
		return {
			score: 0,
			criteria: {
				length: false,
				uppercase: false,
				lowercase: false,
				numbers: false,
				special: false,
			},
			isValid: false,
		};

	let strength = 0;
	const criteria = {
		length: password.length >= 8,
		uppercase: /[A-Z]/.test(password),
		lowercase: /[a-z]/.test(password),
		numbers: /[0-9]/.test(password),
		special: /[^A-Za-z0-9]/.test(password),
	};

	// Add points for each criterion
	if (criteria.length) strength += 20;
	if (criteria.uppercase) strength += 20;
	if (criteria.lowercase) strength += 20;
	if (criteria.numbers) strength += 20;
	if (criteria.special) strength += 20;

	return {
		score: strength,
		criteria,
		isValid: Object.values(criteria).every(Boolean),
	};
};

// Get color based on password strength
const getStrengthColor = (strength: number): string => {
	if (strength < 40) return 'bg-red-500';
	if (strength < 80) return 'bg-yellow-500';
	return 'bg-green-500';
};

// Get strength label
const getStrengthLabel = (strength: number): string => {
	if (strength < 40) return 'Weak';
	if (strength < 80) return 'Moderate';
	return 'Strong';
};

export function ResetPasswordForm({ token }: { token: string }) {
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [resetComplete, setResetComplete] = useState<boolean>(false);
	const [passwordStrength, setPasswordStrength] = useState<{
		score: number;
		criteria: {
			length: boolean;
			uppercase: boolean;
			lowercase: boolean;
			numbers: boolean;
			special: boolean;
		};
		isValid: boolean;
	}>({
		score: 0,
		criteria: {
			length: false,
			uppercase: false,
			lowercase: false,
			numbers: false,
			special: false,
		},
		isValid: false,
	});

	const form = useForm<z.infer<typeof resetPasswordSchema>>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	});

	// Watch the password field directly
	const password = useWatch({
		control: form.control,
		name: 'password',
		defaultValue: '',
	});

	// Update password strength when password changes
	useEffect(() => {
		setPasswordStrength(calculatePasswordStrength(password));
	}, [password]);

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
						response.message ||
						'Something went wrong. Please try again.',
					variant: 'destructive',
				});
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: `An unexpected error occurred. Please try again. ${error}`,
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<Card className="max-w-md mx-auto shadow-lg">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold">
						Reset Password
					</CardTitle>
					<CardDescription>
						Create a new password for your account
					</CardDescription>
				</CardHeader>

				<CardContent>
					{resetComplete ? (
						<Alert className="bg-green-50 border-green-200">
							<CheckCircle className="h-4 w-4 text-green-600" />
							<AlertTitle className="text-green-800">
								Password Reset Complete
							</AlertTitle>
							<AlertDescription className="text-green-700">
								Your password has been reset successfully.
							</AlertDescription>
							<div className="mt-4">
								<Link
									href="/login"
									className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
								>
									<ArrowLeft className="h-4 w-4" />
									Return to login
								</Link>
							</div>
						</Alert>
					) : (
						<>
							<Alert className="mb-6">
								<AlertCircle className="h-4 w-4" />
								<AlertTitle>Password Requirements</AlertTitle>
								<AlertDescription>
									<ul className="list-disc pl-5 text-sm mt-2">
										<li
											className={
												passwordStrength.criteria.length
													? 'text-green-600'
													: 'text-red-600'
											}
										>
											At least 8 characters long
										</li>
										<li
											className={
												passwordStrength.criteria
													.uppercase
													? 'text-green-600'
													: 'text-red-600'
											}
										>
											Include at least one uppercase
											letter
										</li>
										<li
											className={
												passwordStrength.criteria
													.lowercase
													? 'text-green-600'
													: 'text-red-600'
											}
										>
											Include at least one lowercase
											letter
										</li>
										<li
											className={
												passwordStrength.criteria
													.numbers
													? 'text-green-600'
													: 'text-red-600'
											}
										>
											Include at least one number
										</li>
										<li
											className={
												passwordStrength.criteria
													.special
													? 'text-green-600'
													: 'text-red-600'
											}
										>
											Include at least one special
											character
										</li>
									</ul>
								</AlertDescription>
							</Alert>

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
												<FormLabel>
													New Password
												</FormLabel>
												<FormControl>
													<div className="relative">
														<div className="absolute left-3 top-3 text-muted-foreground">
															<Lock className="h-4 w-4" />
														</div>
														<Input
															type="password"
															placeholder="Enter your new password"
															className="pl-10"
															autoComplete="new-password"
															{...field}
														/>
													</div>
												</FormControl>
												{/* Password strength meter */}
												<div className="mt-2 text-[0.8rem] text-muted-foreground">
													<div className="flex items-center justify-between mb-1">
														<span className="text-sm">
															Password Strength:
														</span>
														<span className="text-sm font-medium">
															{getStrengthLabel(
																passwordStrength.score
															)}
														</span>
													</div>
													<div className="relative h-2 w-full overflow-hidden rounded-full bg-primary/20">
														<div
															className={`h-full absolute left-0 top-0 transition-all ${getStrengthColor(
																passwordStrength.score
															)}`}
															style={{
																width: `${passwordStrength.score}%`,
															}}
														/>
													</div>
												</div>
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
													<div className="relative">
														<div className="absolute left-3 top-3 text-muted-foreground">
															<Lock className="h-4 w-4" />
														</div>
														<Input
															type="password"
															placeholder="Confirm your new password"
															className="pl-10"
															autoComplete="new-password"
															{...field}
														/>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Button
										type="submit"
										className="w-full mt-6"
										disabled={
											isLoading ||
											!passwordStrength.isValid
										}
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
				</CardContent>

				<CardFooter className="flex flex-col items-center justify-center pt-2 pb-6">
					<p className="text-sm text-muted-foreground">
						Remember your password?{' '}
						<Link
							href="/login"
							className="font-medium text-indigo-600 hover:text-indigo-700 underline"
						>
							Login
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}
