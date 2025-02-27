'use client';

import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LeaderboardEntry } from '../page';
import { Trophy, Users, BarChart3, Award } from 'lucide-react';

interface LeaderboardStatsProps {
	leaderboardData: LeaderboardEntry[];
}

export default function LeaderboardStats({
	leaderboardData,
}: LeaderboardStatsProps) {
	// Calculate statistics
	const stats = useMemo(() => {
		if (!leaderboardData.length) return null;

		// Get top 3 performers
		const topPerformers = leaderboardData.slice(0, 3);

		// Calculate average score
		const totalScore = leaderboardData.reduce(
			(sum, entry) => sum + entry.score,
			0
		);
		const averageScore =
			Math.round((totalScore / leaderboardData.length) * 100) / 100;

		// Calculate average accuracy
		const totalAccuracy = leaderboardData.reduce(
			(sum, entry) => sum + entry.accuracy,
			0
		);
		const averageAccuracy =
			Math.round((totalAccuracy / leaderboardData.length) * 100) / 100;

		// Calculate participation rate
		const totalAttempted = leaderboardData.reduce(
			(sum, entry) => sum + entry.attemptedQuestions,
			0
		);
		const totalQuestions = leaderboardData.reduce(
			(sum, entry) => sum + entry.totalQuestions,
			0
		);
		const participationRate =
			Math.round((totalAttempted / totalQuestions) * 100 * 100) / 100;

		return {
			topPerformers,
			averageScore,
			averageAccuracy,
			participationRate,
			totalParticipants: leaderboardData.length,
		};
	}, [leaderboardData]);

	if (!stats) return null;

	return (
		<div className="space-y-8">
			{/* Top Performers */}
			<div>
				<h2 className="text-2xl font-semibold mb-4 flex items-center">
					<Trophy className="mr-2 h-6 w-6 text-yellow-500" />
					Top Performers
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{stats.topPerformers.map((performer, index) => (
						<Card
							key={performer.userId}
							className={`
              ${index === 0 ? 'border-yellow-500 shadow-yellow-100' : ''}
              ${index === 1 ? 'border-gray-400 shadow-gray-100' : ''}
              ${index === 2 ? 'border-amber-700 shadow-amber-100' : ''}
              border-2
            `}
						>
							<CardContent className="p-6">
								<div className="flex justify-between items-start">
									<div>
										<h3 className="text-lg font-bold">
											{performer.name}
										</h3>
										<p className="text-sm text-muted-foreground">
											{performer.email}
										</p>
									</div>
									<div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
										{index === 0 && (
											<Trophy className="h-5 w-5 text-yellow-500" />
										)}
										{index === 1 && (
											<Award className="h-5 w-5 text-gray-400" />
										)}
										{index === 2 && (
											<Award className="h-5 w-5 text-amber-700" />
										)}
									</div>
								</div>
								<div className="mt-4 grid grid-cols-2 gap-2 text-sm">
									<div>
										<p className="text-muted-foreground">
											Score
										</p>
										<p className="font-semibold">
											{performer.score}%
										</p>
									</div>
									<div>
										<p className="text-muted-foreground">
											Accuracy
										</p>
										<p className="font-semibold">
											{performer.accuracy}%
										</p>
									</div>
									<div>
										<p className="text-muted-foreground">
											Correct
										</p>
										<p className="font-semibold">
											{performer.correctAnswers} /{' '}
											{performer.attemptedQuestions}
										</p>
									</div>
									<div>
										<p className="text-muted-foreground">
											Attempted
										</p>
										<p className="font-semibold">
											{performer.attemptedQuestions} /{' '}
											{performer.totalQuestions}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			{/* Overall Statistics */}
			<div>
				<h2 className="text-2xl font-semibold mb-4 flex items-center">
					<BarChart3 className="mr-2 h-6 w-6 text-primary" />
					Overall Statistics
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-muted-foreground">
										Total Participants
									</p>
									<p className="text-2xl font-bold">
										{stats.totalParticipants}
									</p>
								</div>
								<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
									<Users className="h-6 w-6 text-primary" />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-muted-foreground">
										Average Score
									</p>
									<p className="text-2xl font-bold">
										{stats.averageScore}%
									</p>
								</div>
								<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
									<BarChart3 className="h-6 w-6 text-primary" />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-muted-foreground">
										Average Accuracy
									</p>
									<p className="text-2xl font-bold">
										{stats.averageAccuracy}%
									</p>
								</div>
								<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
									<Award className="h-6 w-6 text-primary" />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-muted-foreground">
										Participation Rate
									</p>
									<p className="text-2xl font-bold">
										{stats.participationRate}%
									</p>
								</div>
								<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
									<Users className="h-6 w-6 text-primary" />
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
