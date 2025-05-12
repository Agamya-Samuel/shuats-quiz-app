'use client';

import React, { useState } from 'react';
import { forgotPassword } from '@/actions/user';
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
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
					description: response.message || 'Something went wrong. Please try again.',
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

	// Helper function to render form field with icon
	const renderField = (
		name: keyof z.infer<typeof forgotPasswordSchema>,
		label: string,
		placeholder: string,
		icon: React.ReactNode,
		type = 'text',
		autoComplete = ''
	) => (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<div className="relative">
							<div className="absolute left-3 top-3 text-muted-foreground">
								{icon}
							</div>
							<Input
								placeholder={placeholder}
								className="pl-10"
								type={type}
								autoComplete={autoComplete}
								{...field}
							/>
						</div>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);

	return (
		<div className="container mx-auto px-4 py-8">
			<Card className="max-w-md mx-auto shadow-lg">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold">
						Forgot Password
					</CardTitle>
					<CardDescription>
						Enter your email to receive a password reset link
					</CardDescription>
				</CardHeader>

				<CardContent>
					{emailSent ? (
						<Alert className="bg-green-50 border-green-200">
							<AlertCircle className="h-4 w-4 text-green-600" />
							<AlertTitle className="text-green-800">
								Check your email
							</AlertTitle>
							<AlertDescription className="text-green-700">
								If an account exists with this email, we&apos;ve
								sent instructions to reset your password.
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
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
								{renderField(
									'email',
									'Email',
									'Enter your email address',
									<Mail className="h-4 w-4" />,
									'email',
									'email'
								)}

								<Button
									type="submit"
									className="w-full mt-6"
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
