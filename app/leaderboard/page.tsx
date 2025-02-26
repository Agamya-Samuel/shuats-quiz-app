'use client';

import { useEffect, useState } from 'react';
import { getLeaderboard } from '@/actions/question';
import LeaderboardTable from './_components/leaderboard-table';
import LeaderboardStats from './_components/leaderboard-stats';
import LoadingState from '@/components/loading-component';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';
import Navbar from '@/components/navbar';

export interface LeaderboardEntry {
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

interface LeaderboardResponse {
	success: boolean;
	data?: LeaderboardEntry[];
	error?: string;
}

export default function LeaderboardPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
		[]
	);

	useEffect(() => {
		const fetchLeaderboard = async () => {
			try {
				const response: LeaderboardResponse = await getLeaderboard();
				if (response.success) {
					setLeaderboardData(response.data || []);
				} else {
					throw new Error(
						response.error || 'Failed to fetch leaderboard data'
					);
				}
			} catch (err) {
				setError(
					err instanceof Error ? err.message : 'An error occurred'
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchLeaderboard();
	}, []);

	if (isLoading) return <LoadingState />;

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Navbar />
				<Card className="max-w-md mx-auto mt-8">
					<CardContent className="p-6">
						<div className="text-center text-red-500">
							<h3 className="text-lg font-semibold mb-2">
								Error
							</h3>
							<p>{error}</p>
							<Button
								variant="outline"
								className="mt-4"
								onClick={() => router.push('/')}
							>
								Return to Home
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (leaderboardData.length === 0) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Navbar />
				<Card className="max-w-md mx-auto mt-8">
					<CardContent className="p-6">
						<div className="text-center">
							<AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
							<h3 className="text-xl font-semibold mb-2">
								No Data Available
							</h3>
							<p className="mb-6 text-gray-600">
								No one has attempted the quiz yet. Be the first
								to take the quiz and appear on the leaderboard!
							</p>
							<Button onClick={() => router.push('/user/quiz')}>
								Take Quiz Now
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<div className="max-w-7xl mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold mb-8 text-center">
					Quiz Leaderboard
				</h1>

				{/* Top performers stats */}
				<LeaderboardStats leaderboardData={leaderboardData} />

				{/* Full leaderboard table */}
				<div className="mt-8">
					<h2 className="text-2xl font-semibold mb-4">
						All Participants
					</h2>
					<LeaderboardTable leaderboardData={leaderboardData} />
				</div>
			</div>
		</div>
	);
}
