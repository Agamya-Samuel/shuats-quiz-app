import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { getLeaderboard } from '@/actions/question';
import { resetUserSubmissions } from '@/actions/admin';

interface LeaderboardEntry {
	userId: string | null;
	name: string;
	email: string;
	rank: number;
	score: number;
	totalQuestions: number;
	attemptedQuestions: number;
	correctAnswers: number;
	accuracy: number;
	submittedAt: string;
}

export function UserSubmissions() {
	const [users, setUsers] = useState<LeaderboardEntry[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [resetLoading, setResetLoading] = useState<string | null>(null);
	const { toast } = useToast();

	const loadUsers = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await getLeaderboard();
			if (response.success && response.data) {
				setUsers(response.data);
			} else {
				toast({
					variant: 'destructive',
					title: 'Error',
					description: 'Failed to load users',
				});
			}
		} catch (error) {
			console.error('Error loading users:', error);
			toast({
				variant: 'destructive',
				title: 'Error',
				description: 'An error occurred while loading users',
			});
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadUsers();
	}, [loadUsers]);

	const handleReset = async (email: string) => {
		setResetLoading(email);
		try {
			const response = await resetUserSubmissions(email);

			if (response.success) {
				toast({
					title: 'Success',
					description:
						response.message ||
						'Successfully reset user submissions',
				});
				// Reload the user list
				await loadUsers();
			} else {
				toast({
					variant: 'destructive',
					title: 'Error',
					description:
						response.message || 'Failed to reset user submissions',
				});
			}
		} catch (error) {
			console.error('Error resetting submissions:', error);
			toast({
				variant: 'destructive',
				title: 'Error',
				description: 'An error occurred while resetting submissions',
			});
		} finally {
			setResetLoading(null);
		}
	};

	if (isLoading) {
		return <div>Loading users...</div>;
	}

	return (
		<div className="space-y-4">
			{users.length === 0 ? (
				<div className="text-center py-4 text-muted-foreground">
					No users have attempted the quiz yet.
				</div>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Score</TableHead>
							<TableHead>Attempted</TableHead>
							<TableHead>Correct</TableHead>
							<TableHead>Accuracy</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{users.map((user) => (
							<TableRow key={user.userId || user.email}>
								<TableCell>{user.name}</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>{user.score}%</TableCell>
								<TableCell>{user.attemptedQuestions}</TableCell>
								<TableCell>{user.correctAnswers}</TableCell>
								<TableCell>{user.accuracy}%</TableCell>
								<TableCell>
									<Button
										variant="destructive"
										size="sm"
										onClick={() => handleReset(user.email)}
										disabled={resetLoading === user.email}
									>
										{resetLoading === user.email
											? 'Resetting...'
											: 'Reset Quiz'}
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
}
