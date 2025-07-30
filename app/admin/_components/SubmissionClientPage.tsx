'use client';

import { useEffect, useState, useTransition } from 'react';
import { RefreshCw } from 'lucide-react';
import {
	getUsersWithSubmissionCount,
	resetUserSubmissions,
} from '@/actions/admin';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

type User = {
	id: number;
	name: string;
	email: string;
	submissionCount: number;
};
export default function SubmissionClientPage() {
	const { toast } = useToast();
	const [users, setUsers] = useState<User[]>([]);
	const [totalQuestions, setTotalQuestions] = useState(0);
	const [loading, setLoading] = useState<Record<number, boolean>>({});
	const [isRefreshing, startRefreshing] = useTransition();
	const router = useRouter();

	useEffect(() => {
		const fetchUsers = async () => {
			const {
				users: fetchedUsers,
				totalQuestions: fetchedTotalQuestions,
				success,
			} = await getUsersWithSubmissionCount();
			if (success) {
				setUsers(fetchedUsers || []);
				setTotalQuestions(fetchedTotalQuestions || 0);
			} else {
				toast({
					title: 'Error',
					description: 'Failed to fetch users.',
					variant: 'destructive',
				});
			}
		};
		fetchUsers();
	}, [toast]);
	const handleReset = async (userId: number) => {
		setLoading((prev) => ({ ...prev, [userId]: true }));
		const { success, message } = await resetUserSubmissions(userId);
		if (success) {
			toast({
				title: 'Success',
				description: message,
			});
			setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
		} else {
			toast({
				title: 'Error',
				description: message,
				variant: 'destructive',
			});
		}
		setLoading((prev) => ({ ...prev, [userId]: false }));
	};

	const handleRefresh = () => {
		startRefreshing(async () => {
			const { users: newUsers, success } =
				await getUsersWithSubmissionCount();
			if (success) {
				setUsers(newUsers || []);
				toast({
					title: 'Success',
					description: 'Successfully refreshed the submission list',
				});
			} else {
				toast({
					title: 'Error',
					description: 'Failed to refresh the submission list',
					variant: 'destructive',
				});
			}
		});
	};
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>User Submissions</CardTitle>
				<Button
					onClick={handleRefresh}
					disabled={isRefreshing}
					variant="outline"
					size="sm"
				>
					<RefreshCw
						className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
					/>
					{isRefreshing ? 'Refreshing...' : 'Refresh'}
				</Button>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{users.length > 0 ? (
						users.map((user) => (
							<div
								key={user.id}
								className="flex items-center justify-between rounded-lg border p-4"
							>
								<div>
									<p className="font-semibold">{user.name}</p>
									<p className="text-sm text-gray-500">{user.email}</p>
									<p className="text-sm text-gray-500">
										Attempted: {user.submissionCount} / {totalQuestions}
									</p>
								</div>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button disabled={loading[user.id]} variant="destructive">
											{loading[user.id]
												? 'Resetting...'
												: 'Reset Submissions'}
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Are you sure?</AlertDialogTitle>
											<AlertDialogDescription>
												This will reset the user's submission and cannot be
												undone.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<AlertDialogAction onClick={() => handleReset(user.id)}>
												Continue
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						))
					) : (
						<div className="text-center text-gray-500">
							No submissions to display.
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}