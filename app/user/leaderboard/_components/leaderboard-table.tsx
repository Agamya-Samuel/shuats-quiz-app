'use client';

import { useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Medal, Search, ChevronDown, ArrowUpDown } from 'lucide-react';
import { LeaderboardEntry } from '../page';
import { Card } from '@/components/ui/card';

interface LeaderboardTableProps {
	leaderboardData: LeaderboardEntry[];
}

export default function LeaderboardTable({
	leaderboardData,
}: LeaderboardTableProps) {
	const [searchTerm, setSearchTerm] = useState('');
	const [sortBy, setSortBy] = useState<keyof LeaderboardEntry>('rank');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

	// Filter data based on search term
	const filteredData = leaderboardData.filter(
		(entry) =>
			entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			entry.email.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Sort data based on selected column and order
	const sortedData = [...filteredData].sort((a, b) => {
		const aValue = a[sortBy];
		const bValue = b[sortBy];

		if (typeof aValue === 'number' && typeof bValue === 'number') {
			return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
		}

		// For string values
		const aString = String(aValue).toLowerCase();
		const bString = String(bValue).toLowerCase();
		return sortOrder === 'asc'
			? aString.localeCompare(bString)
			: bString.localeCompare(aString);
	});

	// Handle sort change
	const handleSort = (column: keyof LeaderboardEntry) => {
		if (sortBy === column) {
			setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
		} else {
			setSortBy(column);
			setSortOrder('asc');
		}
	};

	// Format date
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString();
	};

	// Render medal for top 3
	const renderRank = (rank: number) => {
		if (rank === 1) return <Medal className="h-5 w-5 text-yellow-500" />;
		if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
		if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />;
		return rank;
	};

	return (
		<Card className="overflow-hidden">
			<div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
				<div className="relative w-full sm:w-64">
					<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search participants..."
						className="pl-8"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="ml-auto">
							Sort By <ChevronDown className="ml-2 h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => handleSort('rank')}>
							Rank
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleSort('name')}>
							Name
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => handleSort('score')}>
							Score
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => handleSort('accuracy')}
						>
							Accuracy
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => handleSort('submittedAt')}
						>
							Submission Date
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-16">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleSort('rank')}
								>
									Rank
									<ArrowUpDown className="ml-2 h-4 w-4" />
								</Button>
							</TableHead>
							<TableHead>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleSort('name')}
								>
									Name
									<ArrowUpDown className="ml-2 h-4 w-4" />
								</Button>
							</TableHead>
							<TableHead className="w-24">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleSort('score')}
								>
									Score
									<ArrowUpDown className="ml-2 h-4 w-4" />
								</Button>
							</TableHead>
							<TableHead className="w-24">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleSort('accuracy')}
								>
									Accuracy
									<ArrowUpDown className="ml-2 h-4 w-4" />
								</Button>
							</TableHead>
							<TableHead className="w-32">
								<Button
									variant="ghost"
									size="sm"
									onClick={() =>
										handleSort('attemptedQuestions')
									}
								>
									Attempted
									<ArrowUpDown className="ml-2 h-4 w-4" />
								</Button>
							</TableHead>
							<TableHead className="w-32">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleSort('correctAnswers')}
								>
									Correct
									<ArrowUpDown className="ml-2 h-4 w-4" />
								</Button>
							</TableHead>
							<TableHead className="w-40">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => handleSort('submittedAt')}
								>
									Submitted
									<ArrowUpDown className="ml-2 h-4 w-4" />
								</Button>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{sortedData.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={7}
									className="text-center py-8 text-muted-foreground"
								>
									No results found
								</TableCell>
							</TableRow>
						) : (
							sortedData.map((entry) => (
								<TableRow key={entry.userId}>
									<TableCell className="font-medium">
										<div className="flex items-center justify-center">
											{renderRank(entry.rank)}
										</div>
									</TableCell>
									<TableCell>
										<div>
											<div className="font-medium">
												{entry.name}
											</div>
											<div className="text-sm text-muted-foreground">
												{entry.email}
											</div>
										</div>
									</TableCell>
									<TableCell className="font-semibold">
										{entry.score}%
									</TableCell>
									<TableCell>{entry.accuracy}%</TableCell>
									<TableCell>
										{entry.attemptedQuestions} /{' '}
										{entry.totalQuestions}
									</TableCell>
									<TableCell>
										{entry.correctAnswers} /{' '}
										{entry.attemptedQuestions}
									</TableCell>
									<TableCell className="text-muted-foreground">
										{formatDate(entry.submittedAt)}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</Card>
	);
}
