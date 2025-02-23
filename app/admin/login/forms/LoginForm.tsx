// app/(auth)/login/forms/LoginForm.tsx
'use client';

import React, { useState } from 'react';
import { loginMaintainer } from '@/actions/login-maintainer';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { maintainerLoginSchema } from '@/schemas/forms/login-schema';

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

export function LoginForm({ redirect }: { redirect?: string }) {
	const { toast } = useToast();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const form = useForm<z.infer<typeof maintainerLoginSchema>>({
		resolver: zodResolver(maintainerLoginSchema),
		defaultValues: {
			username: '',
			password: '',
		},
	});

	async function onSubmit(values: z.infer<typeof maintainerLoginSchema>) {
		setIsLoading(true);

		try {
			const response = await loginMaintainer(values);

			if (response.success) {
				toast({
					title: 'Login Successful',
					description: 'You have successfully logged in.',
					variant: 'success',
				});
				// Store maintainer info in localStorage with correct key
				localStorage.setItem(
					'user',
					JSON.stringify(response.payload)
				);
				router.push(redirect || '/admin/manage-quiz');
			} else {
				toast({
					title: 'Login Failed',
					description:
						response.error || 'Invalid username or password.',
					variant: 'destructive',
				});
			}
		} catch (error) {
			setIsLoading(false);
			toast({
				title: 'Login Error',
				description: `An error occurred while logging in. Please try again. ${error}`,
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-md mx-auto">
				<h1 className="text-2xl font-bold mb-6">Maintainer Login</h1>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-1"
					>
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter your username"
											autoComplete="username"
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
											autoComplete="current-password"
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
									<span>Logging in</span>
									<LoadingSpinner />
								</>
							) : (
								'Login'
							)}
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
