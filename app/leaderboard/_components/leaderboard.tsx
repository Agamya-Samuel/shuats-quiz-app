'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

// Define types for our data structure
interface SubjectPerformance {
	correct: number;
	time_spent: number;
}

interface ParticipantData {
	participant_name: string;
	total_correct: number;
	total_time: number;
	[key: string]: string | number | SubjectPerformance; // For dynamic subject access
}

// Sample data - replace with actual data from your quiz system
const leaderboardData: ParticipantData[] = [
	{
		participant_name: 'John Doe',
		total_correct: 65,
		total_time: 1800,
		Physics: { correct: 7, time_spent: 300 },
		Chemistry: { correct: 8, time_spent: 320 },
		Math: { correct: 10, time_spent: 400 },
		Biology: { correct: 6, time_spent: 240 },
		'Social Science': { correct: 8, time_spent: 300 },
		'English Language': { correct: 12, time_spent: 360 },
		'General Knowledge': { correct: 9, time_spent: 270 },
		'Computer Science': { correct: 5, time_spent: 150 },
	},
	{
		participant_name: 'Jane Smith',
		total_correct: 70,
		total_time: 1750,
		Physics: { correct: 8, time_spent: 280 },
		Chemistry: { correct: 9, time_spent: 310 },
		Math: { correct: 11, time_spent: 390 },
		Biology: { correct: 7, time_spent: 230 },
		'Social Science': { correct: 9, time_spent: 290 },
		'English Language': { correct: 13, time_spent: 350 },
		'General Knowledge': { correct: 8, time_spent: 260 },
		'Computer Science': { correct: 5, time_spent: 140 },
	},
	// Add more participants here...
];

const subjects = [
	'Physics',
	'Chemistry',
	'Math',
	'Biology',
	'Social Science',
	'English Language',
	'General Knowledge',
	'Computer Science',
] as const;

type SortBy = 'total_correct' | 'total_time';

export function QuizLeaderboard() {
	const [sortBy, setSortBy] = useState<SortBy>('total_correct');

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}m ${remainingSeconds}s`;
	};

	const sortedLeaderboard = [...leaderboardData].sort((a, b) => {
		if (sortBy === 'total_time') {
			return (a[sortBy] as number) - (b[sortBy] as number);
		}
		return (b[sortBy] as number) - (a[sortBy] as number);
	});

	// Type guard to check if a value is a SubjectPerformance
	const isSubjectPerformance = (
		value: unknown
	): value is SubjectPerformance => {
		return (
			typeof value === 'object' &&
			value !== null &&
			'correct' in value &&
			'time_spent' in value &&
			typeof (value as SubjectPerformance).correct === 'number' &&
			typeof (value as SubjectPerformance).time_spent === 'number'
		);
	};

	return (
		<div className="container mx-auto py-8">
			<h1 className="text-3xl font-bold mb-8">Quiz Leaderboard</h1>

			<Card className="mb-8">
				<CardHeader>
					<CardTitle>Leaderboard Summary</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-semibold">
							Top Performers
						</h2>
						<Select
							value={sortBy}
							onValueChange={(value: SortBy) => setSortBy(value)}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="total_correct">
									Total Correct
								</SelectItem>
								<SelectItem value="total_time">
									Total Time
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[100px]">
									Rank
								</TableHead>
								<TableHead>Name</TableHead>
								<TableHead>Total Correct</TableHead>
								<TableHead>Total Time</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{sortedLeaderboard.map((participant, index) => (
								<TableRow key={participant.participant_name}>
									<TableCell>
										{index < 3 ? (
											<Badge
												variant={
													index === 0
														? 'default'
														: index === 1
														? 'secondary'
														: 'outline'
												}
											>
												{index + 1}
											</Badge>
										) : (
											index + 1
										)}
									</TableCell>
									<TableCell className="font-medium">
										{participant.participant_name}
									</TableCell>
									<TableCell>
										{participant.total_correct}
									</TableCell>
									<TableCell>
										{formatTime(participant.total_time)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Detailed Performance</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								{subjects.map((subject) => (
									<TableHead key={subject}>
										{subject}
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{sortedLeaderboard.map((participant) => (
								<TableRow key={participant.participant_name}>
									<TableCell className="font-medium">
										{participant.participant_name}
									</TableCell>
									{subjects.map((subject) => {
										const subjectData =
											participant[subject];
										if (
											!isSubjectPerformance(subjectData)
										) {
											return (
												<TableCell key={subject}>
													N/A
												</TableCell>
											);
										}
										return (
											<TableCell key={subject}>
												{subjectData.correct} (
												{formatTime(
													subjectData.time_spent
												)}
												)
											</TableCell>
										);
									})}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}
