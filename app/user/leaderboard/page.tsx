'use client';

import { useEffect, useState } from 'react';
import { getLeaderboard } from '@/actions/question';
import LeaderboardTable from './_components/leaderboard-table';
import LeaderboardStats from './_components/leaderboard-stats';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Printer } from 'lucide-react';
import ImageCarousel from '@/components/image-carousel';

export interface LeaderboardEntry {
	userId: string | null;
	name: string;
	school: string;
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

/**
 * Custom loading component for the leaderboard page
 * Displays a centered spinner with text
 */
function LeaderboardLoading() {
	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center">
			<div className="flex flex-col items-center gap-4">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
				<p className="text-gray-500 font-medium">
					Loading leaderboard data...
				</p>
			</div>
		</div>
	);
}

export default function LeaderboardPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
		[]
	);

	// Handle print functionality
	const handlePrint = () => {
		window.print();
	};

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

	if (isLoading) return <LeaderboardLoading />;

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50">
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
				<div className="max-w-4xl mx-auto px-4 py-8">
					<Card>
						<CardContent className="p-6">
							<div className="text-center">
								<AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
								<h3 className="text-xl font-semibold mb-2">
									No Data Available
								</h3>
								<p className="mb-6 text-gray-600">
									No one has attempted the quiz yet. Be the
									first to take the quiz and appear on the
									leaderboard!
								</p>
								<Button
									onClick={() => router.push('/user/quiz')}
								>
									Take Quiz Now
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 py-8">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-center">
						Quiz Leaderboard
					</h1>
					<Button
						onClick={handlePrint}
						variant="outline"
						className="flex items-center gap-2 print:hidden"
					>
						<Printer className="h-4 w-4" />
						Print Leaderboard
					</Button>
				</div>

				{/* SHUATS Image Carousel */}
				<div className="mb-8 print:hidden">
					<h2 className="text-xl font-semibold mb-4">
						SHUATS Campus Gallery
					</h2>
					<ImageCarousel
						category={['cultural', 'dept', 'lab']}
						className="shadow-md"
					/>
				</div>

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
