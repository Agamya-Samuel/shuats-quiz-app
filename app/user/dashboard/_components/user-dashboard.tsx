'use client';

import { useEffect, useState } from 'react';
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
import { toast } from '@/hooks/use-toast';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { updateUser } from '@/actions/user';
import LoadingState from '@/components/loading-component';
import { useCookies } from '@/contexts/cookie-context';
import { redirect } from 'next/navigation';
import { LoadingSpinner } from '@/components/loading-spinner';

const formSchema = z.object({
	name: z.string().min(2, {
		message: 'Name must be at least 2 characters.',
	}),
	email: z.string().email({
		message: 'Please enter a valid email address.',
	}),
	mobile: z.string().regex(/^[0-9]{10}$/, {
		message: 'Please enter a valid 10-digit mobile number.',
	}),
	schoolName: z.string().min(2, {
		message: 'School name must be at least 2 characters.',
	}),
	rollNo: z.string().min(1, {
		message: 'Roll number is required.',
	}),
	branch: z.string().min(2, {
		message: 'Branch must be at least 2 characters.',
	}),
	address: z.string().min(5, {
		message: 'Address must be at least 5 characters.',
	}),
});

interface IUser {
	_id: string;
	name: string;
	email: string;
	mobile: string;
	school: string;
	rollNo: string;
	branch: string;
	address: string;
}

export function UserDashboard() {
	const [isEditing, setIsEditing] = useState(false);
	const [user, setUser] = useState<IUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const { user: currentUser } = useCookies();
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			email: '',
			mobile: '',
			schoolName: '',
			rollNo: '',
			branch: '',
			address: '',
		},
	});

	if (currentUser?.role === 'maintainer') {
		toast({
			title: 'You are not authorized to access this page',
			description: 'Please contact the administrator',
			variant: 'destructive',
		});
		redirect('/admin/login');
	}

	useEffect(() => {
		if (currentUser) {
			const userData = {
				_id: currentUser.userId,
				name: currentUser.name || '',
				school: currentUser.school || '',
				email: currentUser.email || '',
				mobile: currentUser.mobile || '',
				rollNo: currentUser.rollNo || '',
				branch: currentUser.branch || '',
				address: currentUser.address || '',
			};
			setUser(userData);

			// Reset form with user data
			form.reset({
				name: userData.name,
				email: userData.email,
				mobile: userData.mobile,
				schoolName: userData.school,
				rollNo: userData.rollNo,
				branch: userData.branch,
				address: userData.address,
			});
		} else {
			setUser(null);
		}
		setIsLoading(false);
	}, [currentUser, form]); // Add form to dependency array

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsSaving(true);
		try {
			const response = await updateUser(user?._id as string, {
				name: values.name,
				email: values.email,
				mobile: values.mobile,
				schoolName: values.schoolName,
				rollNo: values.rollNo,
				branch: values.branch,
				address: values.address,
				_id: user?._id as string,
			});

			if (response.success) {
				// Update local user state
				setUser({
					...user!,
					name: values.name,
					email: values.email,
					mobile: values.mobile,
					school: values.schoolName,
					rollNo: values.rollNo,
					branch: values.branch,
					address: values.address,
				});

				toast({
					title: 'Profile updated',
					description: 'Your profile has been successfully updated.',
					variant: 'success',
				});

				// Refresh the page to update the token and user context
				router.refresh();
				setIsEditing(false);
			} else {
				throw new Error(response.error || 'Failed to update profile');
			}
		} catch (err) {
			console.error('Failed to update profile:', err);
			toast({
				title: 'Error',
				description:
					err instanceof Error
						? err.message
						: 'Failed to update profile. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setIsSaving(false);
		}
	}

	if (isLoading) {
		return <LoadingState />;
	}

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader>
				<div className="flex items-center space-x-4">
					<Avatar className="w-20 h-20">
						<AvatarImage
							src="/placeholder.svg?height=80&width=80"
							alt={user?.name}
						/>
						<AvatarFallback>
							{user?.name
								? user.name
										.split(' ')
										.map((n) => n[0])
										.join('')
								: '?'}
						</AvatarFallback>
					</Avatar>
					<div>
						<CardTitle>{user?.name}</CardTitle>
						<CardDescription>{user?.email}</CardDescription>
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-2"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											{...field}
											disabled={!isEditing}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											{...field}
											disabled={!isEditing}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="mobile"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Mobile</FormLabel>
									<FormControl>
										<Input
											{...field}
											disabled={!isEditing}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="schoolName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>School Name</FormLabel>
									<FormControl>
										<Input
											{...field}
											disabled={!isEditing}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="rollNo"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Roll Number</FormLabel>
									<FormControl>
										<Input
											{...field}
											disabled={!isEditing}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="branch"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Branch</FormLabel>
									<FormControl>
										<Input
											{...field}
											disabled={!isEditing}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="address"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Address</FormLabel>
									<FormControl>
										<Input
											{...field}
											disabled={!isEditing}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{isEditing && (
							<div className="flex gap-2">
								<Button type="submit" disabled={isSaving}>
									{isSaving ? (
										<>
											<span>Saving</span>
											<LoadingSpinner />
										</>
									) : (
										'Save Changes'
									)}
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										setIsEditing(false);
										form.reset(); // Reset form to original values
									}}
									disabled={isSaving}
								>
									Cancel
								</Button>
							</div>
						)}
					</form>
				</Form>
			</CardContent>
			<CardFooter>
				{!isEditing && (
					<Button onClick={() => setIsEditing(true)}>
						Edit Profile
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}
