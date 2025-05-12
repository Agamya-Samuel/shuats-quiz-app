'use client';

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
import { getLeaderboard } from '@/actions/quiz';
import { resetUserSubmissions } from '@/actions/super-admin';
import {
	Search,
	RefreshCw,
	RotateCcw,
	ChevronDown,
	ChevronUp,
	Filter,
	Download,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface LeaderboardEntry {
	userId: number;
	name: string;
	email: string;
	school: string;
	rank: number;
	score: number;
	totalQuestions?: number;
	attemptedQuestions?: number;
	correctAnswers: number;
	accuracy: number;
	submittedAt?: string | Date;
	totalAnswered?: number;
}

type SortField =
	| 'name'
	| 'score'
	| 'attemptedQuestions'
	| 'correctAnswers'
	| 'accuracy';
type SortDirection = 'asc' | 'desc';

export function UserSubmissions() {
	const [users, setUsers] = useState<LeaderboardEntry[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [resetLoading, setResetLoading] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [sortField, setSortField] = useState<SortField>('score');
	const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
	const { toast } = useToast();

	const loadUsers = useCallback(async () => {
		setIsLoading(true);
		try {
			const response = await getLeaderboard();
			if (response.success && response.leaderboard) {
				setUsers(response.leaderboard);
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
	}, [toast]);

	useEffect(() => {
		loadUsers();
	}, [loadUsers]);

	const handleReset = async (email: string) => {
		if (!email || email.trim() === '') {
			toast({
				variant: 'destructive',
				title: 'Error',
				description: 'Email is required to reset user submissions',
			});
			return;
		}

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

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
		} else {
			setSortField(field);
			setSortDirection('desc');
		}
	};

	const getSortIcon = (field: SortField) => {
		if (sortField !== field) return null;
		return sortDirection === 'asc' ? (
			<ChevronUp className="h-4 w-4" />
		) : (
			<ChevronDown className="h-4 w-4" />
		);
	};

	const filteredUsers = users
		.filter(
			(user) =>
				user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(user.email &&
					user.email
						.toLowerCase()
						.includes(searchQuery.toLowerCase())) ||
				user.school.toLowerCase().includes(searchQuery.toLowerCase())
		)
		.sort((a, b) => {
			let fieldA, fieldB;

			// Handle special cases for fields that might have different names
			if (sortField === 'attemptedQuestions') {
				fieldA = a.attemptedQuestions ?? a.totalAnswered ?? 0;
				fieldB = b.attemptedQuestions ?? b.totalAnswered ?? 0;
			} else {
				fieldA = a[sortField];
				fieldB = b[sortField];
			}

			if (sortDirection === 'asc') {
				return fieldA > fieldB ? 1 : -1;
			} else {
				return fieldA < fieldB ? 1 : -1;
			}
		});

	// Loading Component
	const LoadingState = () => (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<Skeleton className="h-10 w-64" />
				<Skeleton className="h-10 w-32" />
			</div>
			<div className="border rounded-lg overflow-hidden">
				<div className="grid grid-cols-7 gap-4 p-4 border-b bg-muted/20">
					{[1, 2, 3, 4, 5, 6, 7].map((i) => (
						<Skeleton key={i} className="h-4" />
					))}
				</div>
				{[1, 2, 3, 4, 5].map((i) => (
					<div
						key={i}
						className="grid grid-cols-7 gap-4 p-4 border-b last:border-0"
					>
						{[1, 2, 3, 4, 5, 6, 7].map((j) => (
							<Skeleton key={j} className="h-4" />
						))}
					</div>
				))}
			</div>
		</div>
	);

	const getScoreBadge = (score: number) => {
		if (score >= 90)
			return <Badge className="bg-green-500">Excellent</Badge>;
		if (score >= 75) return <Badge className="bg-blue-500">Good</Badge>;
		if (score >= 60)
			return <Badge className="bg-yellow-500">Average</Badge>;
		return <Badge className="bg-red-500">Needs Improvement</Badge>;
	};

	return (
		<div className="space-y-4">
			<div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
				<div className="relative w-full sm:w-64">
					<Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="text"
						placeholder="Search users..."
						className="pl-10"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<div className="flex gap-2 w-full sm:w-auto">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="w-full sm:w-auto"
							>
								<Filter className="h-4 w-4 mr-2" />
								Filter
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={() => setSearchQuery('')}
							>
								All Users
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setSearchQuery('excellent')}
							>
								Excellent Scores
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setSearchQuery('needs')}
							>
								Needs Improvement
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<Button
						variant="outline"
						size="sm"
						onClick={loadUsers}
						disabled={isLoading}
						className="w-full sm:w-auto"
					>
						<RefreshCw
							className={`h-4 w-4 mr-2 ${
								isLoading ? 'animate-spin' : ''
							}`}
						/>
						Refresh
					</Button>

					<Button
						variant="outline"
						size="sm"
						className="w-full sm:w-auto"
					>
						<Download className="h-4 w-4 mr-2" />
						Export
					</Button>
				</div>
			</div>

			{isLoading ? (
				<LoadingState />
			) : filteredUsers.length === 0 ? (
				<div className="text-center py-8 border rounded-lg bg-muted/20">
					{searchQuery ? (
						<>
							<p className="text-lg font-medium">
								No matching users found
							</p>
							<p className="text-sm text-muted-foreground mt-1">
								Try a different search term
							</p>
						</>
					) : (
						<>
							<p className="text-lg font-medium">
								No users have attempted the quiz yet
							</p>
							<p className="text-sm text-muted-foreground mt-1">
								User submissions will appear here once available
							</p>
						</>
					)}
				</div>
			) : (
				<div className="border rounded-lg overflow-hidden">
					<Table>
						<TableHeader className="bg-muted/20">
							<TableRow>
								<TableHead
									className="cursor-pointer hover:text-primary"
									onClick={() => handleSort('name')}
								>
									<div className="flex items-center gap-1">
										Name {getSortIcon('name')}
									</div>
								</TableHead>
								<TableHead className="hidden md:table-cell">
									Email
								</TableHead>
								<TableHead
									className="cursor-pointer hover:text-primary"
									onClick={() => handleSort('score')}
								>
									<div className="flex items-center gap-1">
										Score {getSortIcon('score')}
									</div>
								</TableHead>
								<TableHead
									className="cursor-pointer hover:text-primary hidden md:table-cell"
									onClick={() =>
										handleSort('attemptedQuestions')
									}
								>
									<div className="flex items-center gap-1">
										Attempted{' '}
										{getSortIcon('attemptedQuestions')}
									</div>
								</TableHead>
								<TableHead
									className="cursor-pointer hover:text-primary hidden md:table-cell"
									onClick={() => handleSort('correctAnswers')}
								>
									<div className="flex items-center gap-1">
										Correct {getSortIcon('correctAnswers')}
									</div>
								</TableHead>
								<TableHead
									className="cursor-pointer hover:text-primary hidden lg:table-cell"
									onClick={() => handleSort('accuracy')}
								>
									<div className="flex items-center gap-1">
										Accuracy {getSortIcon('accuracy')}
									</div>
								</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredUsers.map((user) => (
								<TableRow
									key={user.userId || user.email}
									className="hover:bg-muted/20"
								>
									<TableCell className="font-medium">
										{user.name}
									</TableCell>
									<TableCell className="hidden md:table-cell">
										{user.email || 'N/A'}
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											{user.score}%{' '}
											{getScoreBadge(user.score)}
										</div>
									</TableCell>
									<TableCell className="hidden md:table-cell">
										{user.attemptedQuestions}
									</TableCell>
									<TableCell className="hidden md:table-cell">
										{user.correctAnswers}
									</TableCell>
									<TableCell className="hidden lg:table-cell">
										{user.accuracy}%
									</TableCell>
									<TableCell>
										<Button
											variant="outline"
											size="sm"
											onClick={() => {
												if (user.email) {
													handleReset(user.email);
												} else {
													toast({
														variant: 'destructive',
														title: 'Error',
														description:
															'User has no email address',
													});
												}
											}}
											disabled={
												resetLoading === user.email ||
												!user.email
											}
											className="w-full sm:w-auto"
										>
											{resetLoading === user.email ? (
												<RefreshCw className="h-4 w-4 animate-spin" />
											) : (
												<>
													<RotateCcw className="h-4 w-4 mr-2" />
													Reset
												</>
											)}
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}
		</div>
	);
}
