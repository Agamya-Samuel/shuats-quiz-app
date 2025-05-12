// app/(auth)/login/forms/LoginForm.tsx
'use client';

import React, { useState } from 'react';
import { loginUser } from '@/actions/user';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { loginSchema } from '@/schemas/forms/login-schema';

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
import { AddressData } from '@/types/user';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Mail, Lock } from 'lucide-react';

// Define response type for better type safety
interface LoginResponse {
	success: boolean;
	message: string;
	user?: {
		id: number;
		name: string;
		email: string;
		mobile: string;
		school: string;
		rollno: string;
		branch: string;
		address: AddressData;
	};
}

export function LoginForm({ redirect }: { redirect?: string }) {
	const { toast } = useToast();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	function onSubmit(values: z.infer<typeof loginSchema>) {
		setIsLoading(true);

		// Login user
		loginUser({
			email: values.email,
			password: values.password,
		})
			.then((response: LoginResponse) => {
				setIsLoading(false);
				if (response.success) {
					toast({
						title: 'Login Successful',
						description: 'You have successfully logged in.',
						variant: 'success',
					});
					router.push(redirect || '/user/quiz'); // Redirect to quiz page after successful login
				} else {
					toast({
						title: 'Login Failed',
						description: response.message || 'Invalid email or password.',
						variant: 'destructive',
					});
				}
			})
			.catch((error: Error) => {
				setIsLoading(false);
				toast({
					title: 'Login Error',
					description: `An error occurred while logging in: ${error.message}. Please try again.`,
					variant: 'destructive',
				});
			});
	}

	// Helper function to render form field with icon
	const renderField = (
		name: keyof z.infer<typeof loginSchema>,
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
					{name === 'password' && (
						<div className="text-right">
							<Link
								href="/forgot-password"
								className="text-sm text-indigo-600 hover:text-indigo-700"
							>
								Forgot password?
							</Link>
						</div>
					)}
				</FormItem>
			)}
		/>
	);

	return (
		<div className="container mx-auto px-4 py-8">
			<Card className="max-w-md mx-auto shadow-lg">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold">
						Welcome Back
					</CardTitle>
					<CardDescription>
						Sign in to your account to continue
					</CardDescription>
				</CardHeader>

				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-4"
						>
							{renderField(
								'email',
								'Email',
								'Enter your email',
								<Mail className="h-4 w-4" />,
								'email',
								'email'
							)}
							
							{renderField(
								'password',
								'Password',
								'Enter your password',
								<Lock className="h-4 w-4" />,
								'password',
								'current-password'
							)}
							
							<Button
								type="submit"
								className="w-full mt-6"
								disabled={isLoading}
							>
								{isLoading ? (
									<>
										<span>Logging in</span>
										<LoadingSpinner />
									</>
								) : (
									'Login'
								)}
							</Button>
						</form>
					</Form>
				</CardContent>

				<CardFooter className="flex flex-col items-center justify-center pt-2 pb-6">
					<p className="text-sm text-muted-foreground">
						Don&apos;t have an account?{' '}
						<Link
							href="/register"
							className="font-medium text-indigo-600 hover:text-indigo-700 underline"
						>
							Register
						</Link>
					</p>
					<p className="text-xs text-muted-foreground mt-2">
						By logging in, you agree to our{' '}
						<Link
							href="/terms"
							className="underline hover:text-primary"
						>
							Terms of Service
						</Link>{' '}
						and{' '}
						<Link
							href="/privacy"
							className="underline hover:text-primary"
						>
							Privacy Policy
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}
