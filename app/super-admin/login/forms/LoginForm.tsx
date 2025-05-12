// app/(auth)/login/forms/LoginForm.tsx
'use client';

import React, { useState } from 'react';
import { loginSuperAdmin } from '@/actions/super-admin';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { superAdminLoginSchema } from '@/schemas/forms/login-schema';

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
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Lock, ShieldAlert } from 'lucide-react';

export function LoginForm() {
	const { toast } = useToast();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const form = useForm<z.infer<typeof superAdminLoginSchema>>({
		resolver: zodResolver(superAdminLoginSchema),
		defaultValues: {
			username: '',
		},
	});
	function onSubmit(values: z.infer<typeof superAdminLoginSchema>) {
		setIsLoading(true);

		// Login super admin
		loginSuperAdmin({
			username: values.username,
		})
			.then((response) => {
				setIsLoading(false);
				if (response.success) {
					toast({
						title: 'Login Successful',
						description: 'You have successfully logged in.',
						variant: 'success',
					});
					router.push('/super-admin'); // Redirect to super admin page after successful login
				} else {
					toast({
						title: 'Login Failed',
						description: 'Invalid password.',
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

	// Helper function to render form field with icon
	const renderField = (
		name: keyof z.infer<typeof superAdminLoginSchema>,
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
						Super Admin Login
					</CardTitle>
					<CardDescription>
						Access the system administration panel
					</CardDescription>
				</CardHeader>

				<CardContent>
					<div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-3">
						<ShieldAlert className="h-5 w-5 text-amber-600 mt-0.5" />
						<div>
							<p className="text-sm font-medium text-amber-800">
								Restricted Access
							</p>
							<p className="text-xs text-amber-700 mt-1">
								This area is restricted to authorized super
								administrators only. Unauthorized access
								attempts are logged and monitored.
							</p>
						</div>
					</div>

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-4"
						>
							{renderField(
								'username',
								'Username',
								'Enter super admin password',
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
			</Card>
		</div>
	);
}
