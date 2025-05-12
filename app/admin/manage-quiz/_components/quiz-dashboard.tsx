'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
	BarChart3,
	RefreshCw,
	PlusCircle,
	FileText,
	Users,
	Clock,
} from 'lucide-react';

interface QuizStat {
	totalQuestions: number;
	activeQuizzes: number;
	totalSubmissions: number;
	averageScore: number;
	recentUsers: number;
	lastUpdated: string;
}

export function QuizDashboard() {
	const [stats, setStats] = useState<QuizStat>({
		totalQuestions: 0,
		activeQuizzes: 0,
		totalSubmissions: 0,
		averageScore: 0,
		recentUsers: 0,
		lastUpdated: '',
	});
	const [loading, setLoading] = useState(true);
	const { toast } = useToast();

	const loadStats = useCallback(async () => {
		setLoading(true);
		try {
			// This would be replaced with an actual API call in production
			// const response = await getQuizStats();

			// Mock data for demonstration
			const mockData = {
				totalQuestions: 48,
				activeQuizzes: 5,
				totalSubmissions: 126,
				averageScore: 76.3,
				recentUsers: 18,
				lastUpdated: new Date().toLocaleString(),
			};

			setStats(mockData);
		} catch (error) {
			console.error('Error loading quiz stats:', error);
			toast({
				variant: 'destructive',
				title: 'Error',
				description: 'Failed to load quiz statistics',
			});
		} finally {
			setLoading(false);
		}
	}, [toast]);

	useEffect(() => {
		loadStats();
	}, [loadStats]);

	// Loading state component
	const LoadingState = () => (
		<div className="space-y-4">
			{[1, 2, 3].map((i) => (
				<Card key={i}>
					<CardHeader>
						<Skeleton className="h-8 w-48" />
					</CardHeader>
					<CardContent>
						<Skeleton className="h-24 w-full" />
					</CardContent>
				</Card>
			))}
		</div>
	);

	if (loading) return <LoadingState />;

	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
				<h2 className="text-2xl font-bold">Quiz Dashboard</h2>
				<Button
					variant="outline"
					size="sm"
					onClick={loadStats}
					className="w-full sm:w-auto"
				>
					<RefreshCw className="h-4 w-4 mr-2" />
					Refresh Data
				</Button>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				<StatCard
					title="Total Questions"
					value={stats.totalQuestions.toString()}
					icon={<FileText className="h-8 w-8 text-primary" />}
					description="Questions in database"
				/>
				<StatCard
					title="Active Quizzes"
					value={stats.activeQuizzes.toString()}
					icon={<BarChart3 className="h-8 w-8 text-primary" />}
					description="Currently active quizzes"
				/>
				<StatCard
					title="Total Submissions"
					value={stats.totalSubmissions.toString()}
					icon={<PlusCircle className="h-8 w-8 text-primary" />}
					description="Student quiz submissions"
				/>
				<StatCard
					title="Average Score"
					value={`${stats.averageScore.toFixed(1)}%`}
					icon={<BarChart3 className="h-8 w-8 text-primary" />}
					description="Average student quiz score"
				/>
				<StatCard
					title="Recent Users"
					value={stats.recentUsers.toString()}
					icon={<Users className="h-8 w-8 text-primary" />}
					description="Users in the last 24 hours"
				/>
				<StatCard
					title="Last Updated"
					value="Now"
					icon={<Clock className="h-8 w-8 text-primary" />}
					description={stats.lastUpdated}
				/>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Recent Activity</CardTitle>
					<CardDescription>
						Latest actions in the quiz management system
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<ActivityItem
							title="New Question Added"
							description="A new biology question was added to the database"
							time="2 hours ago"
						/>
						<ActivityItem
							title="Question Updated"
							description="Question #42 was updated with new answers"
							time="Yesterday"
						/>
						<ActivityItem
							title="Quiz Created"
							description="A new physics quiz was created with 10 questions"
							time="3 days ago"
						/>
						<ActivityItem
							title="User Submissions Reviewed"
							description="12 new quiz submissions were reviewed"
							time="5 days ago"
						/>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

interface StatCardProps {
	title: string;
	value: string;
	icon: React.ReactNode;
	description?: string;
}

function StatCard({ title, value, icon, description }: StatCardProps) {
	return (
		<Card>
			<CardContent className="p-6">
				<div className="flex justify-between items-start">
					<div>
						<p className="text-sm font-medium text-muted-foreground">
							{title}
						</p>
						<h3 className="text-3xl font-bold mt-2">{value}</h3>
						{description && (
							<p className="text-xs text-muted-foreground mt-1">
								{description}
							</p>
						)}
					</div>
					<div className="bg-primary/10 p-3 rounded-full">{icon}</div>
				</div>
			</CardContent>
		</Card>
	);
}

interface ActivityItemProps {
	title: string;
	description: string;
	time: string;
}

function ActivityItem({ title, description, time }: ActivityItemProps) {
	return (
		<div className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
			<div className="flex-1">
				<h4 className="text-sm font-medium">{title}</h4>
				<p className="text-sm text-muted-foreground mt-1">
					{description}
				</p>
			</div>
			<div className="text-xs text-muted-foreground whitespace-nowrap">
				{time}
			</div>
		</div>
	);
}
