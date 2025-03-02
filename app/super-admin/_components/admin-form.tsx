'use client';

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
import { toast } from '@/hooks/use-toast';
import { createMaintainer } from '@/actions/maintainer';
import { LoadingSpinner } from '@/components/loading-spinner';
import { useState } from 'react';

const formSchema = z.object({
	userName: z.string().min(2, 'UserName must be at least 2 characters'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
});

export function AdminForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			userName: '',
			password: '',
		},
	});

	const [isLoading, setIsLoading] = useState(false);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);
		try {
			const response = await createMaintainer(values);

			if (response.success) {
				toast({
					title: 'Success',
					description: 'Maintainer created successfully',
					variant: 'success'
				});
				form.reset();

			} else {
				throw new Error(response.error);
			}
		} catch (error) {
			toast({
				title: 'Error',
				description:
					error instanceof Error
						? error.message
						: 'Failed to create admin',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="userName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>UserName</FormLabel>
							<FormControl>
								<Input
									type="text"
									placeholder="johnDoe"
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
								<Input type="password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={isLoading}>
					{isLoading ? <LoadingSpinner /> : 'Create Admin'}
				</Button>
			</form>
		</Form>
	);
}
