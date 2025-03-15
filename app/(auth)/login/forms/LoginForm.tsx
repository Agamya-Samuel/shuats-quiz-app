// app/(auth)/login/forms/LoginForm.tsx
'use client';

import React, { useState } from 'react';
import { loginUser } from '@/actions/login';

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
		loginUser(values)
			.then((response) => {
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
						description: 'Invalid email or password.',
						variant: 'destructive',
					});
				}
			})
			.catch((error) => {
				setIsLoading(false);
				toast({
					title: 'Login Error',
					description: `An error occurred while logging in: ${error}. Please try again.`,
					variant: 'destructive',
				});
			});
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-md mx-auto">
				<h1 className="text-2xl font-bold mb-6">Login</h1>
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
									<div className="text-right">
										<Link
											href="/forgot-password"
											className="text-sm text-indigo-600 hover:text-indigo-700"
										>
											Forgot password?
										</Link>
									</div>
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							className="w-full mt-4"
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
				<p className="mt-4 text-sm text-gray-500">
					Don&apos;t have an account?{' '}
					<Link
						href="/register"
						className="text-indigo-600 hover:text-indigo-700"
					>
						Register
					</Link>
				</p>
			</div>
		</div>
	);
}
