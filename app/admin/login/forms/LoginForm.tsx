// app/admin/login/forms/LoginForm.tsx
'use client';

import React, { useState } from 'react';
import { loginAdmin } from '@/actions/admin';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { adminLoginSchema } from '@/schemas/forms/login-schema';

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
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

export function LoginForm({ redirect }: { redirect?: string }) {
	const { toast } = useToast();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const form = useForm<z.infer<typeof adminLoginSchema>>({
		resolver: zodResolver(adminLoginSchema),
		defaultValues: {
			username: '',
			password: '',
		},
	});

	async function onSubmit(values: z.infer<typeof adminLoginSchema>) {
		setIsLoading(true);

		try {
			const response = await loginAdmin({
				username: values.username,
				password: values.password,
			});

			if (response.success) {
				toast({
					title: 'Login Successful',
					description: 'You have successfully logged in.',
					variant: 'success',
				});
				router.push(redirect || '/admin/manage-quiz');
			} else {
				toast({
					title: 'Login Failed',
					description:
						response.message || 'Invalid username or password.',
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

	// Helper function to render form field with icon
	const renderField = (
		name: keyof z.infer<typeof adminLoginSchema>,
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
								className={`pl-10 ${
									name === 'password' ? 'pr-10' : ''
								}`}
								type={
									name === 'password'
										? showPassword
											? 'text'
											: 'password'
										: type
								}
								autoComplete={autoComplete}
								{...field}
							/>
							{name === 'password' && (
								<button
									type="button"
									onClick={() =>
										setShowPassword(!showPassword)
									}
									className="absolute right-3 top-3 text-muted-foreground hover:text-primary transition-colors"
									tabIndex={-1}
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</button>
							)}
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
						Admin Login
					</CardTitle>
					<CardDescription>
						Sign in to manage quizzes and students
					</CardDescription>
				</CardHeader>

				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-4"
						>
							{renderField(
								'username',
								'Username',
								'Enter your username',
								<User className="h-4 w-4" />,
								'text',
								'username'
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
					<p className="text-xs text-muted-foreground mt-2">
						This login is restricted to quiz administrators only
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}
