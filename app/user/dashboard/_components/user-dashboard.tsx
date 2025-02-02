'use client';

import { useEffect, useState } from 'react';
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
	password: z.string().min(8, {
		message: 'Password must be at least 8 characters.',
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

	useEffect(() => {
		// Read user from local storage
		setIsLoading(true);
		const user = localStorage.getItem('user');
		if (user) {
			setUser(JSON.parse(user));
			setIsLoading(false);
		}
	}, []);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: user ? user : undefined,
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		// TODO: Implement actual update logic
		await updateUser(user?._id as string, {
			name: values.name,
			email: values.email,
			mobile: values.mobile,
			schoolName: values.schoolName,
			rollNo: values.rollNo,
			branch: values.branch,
			address: values.address,
			_id: user?._id as string,
		});

		toast({
			title: 'Profile updated',
			description: 'Your profile has been successfully updated.',
			variant: 'success',
		});
		setIsEditing(false);
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
								.split(' ')
								.map((n) => n[0])
								.join('')}
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
											value={user?.name}
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
											value={user?.email}
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
											value={user?.mobile}
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
											value={user?.school}
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
											value={user?.rollNo}
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
											value={user?.branch}
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
											value={user?.address}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{isEditing && (
							<Button type="submit">Save Changes</Button>
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
