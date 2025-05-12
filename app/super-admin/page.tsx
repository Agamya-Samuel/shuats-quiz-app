'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import { AdminForm } from './_components/admin-form';
import { AdminList } from './_components/admin-list';
import { UserSubmissions } from './_components/user-submissions';
import {
	LayoutDashboard,
	Users,
	ClipboardList,
	PlusCircle,
	BarChart3,
} from 'lucide-react';

// Add interface definitions for component props
interface DashboardCardProps {
	title: string;
	value: string;
	icon: React.ReactNode;
	description?: string;
}

interface ActivityItemProps {
	title: string;
	description: string;
	time: string;
}

export default function SuperAdminPage() {
	const defaultTab = 'dashboard';
	const searchParams = useSearchParams();
	const router = useRouter();

	// Get active tab directly from URL params or use default
	const activeTab = searchParams.get('tab') || defaultTab;

	// Update URL when tab changes
	const handleTabChange = (tab: string) => {
		// Update URL without refreshing the page
		router.push(`/super-admin?tab=${tab}`, { scroll: false });
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			{/* Header */}
			<header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
				<div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-5xl">
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
						<LayoutDashboard className="h-6 w-6 text-primary" />
						Super Admin Portal
					</h1>
					<div className="flex items-center gap-4">
						<span className="hidden md:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
							Super Admin Access
						</span>
					</div>
				</div>
			</header>

			<div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6 max-w-5xl">
				{/* Sidebar Navigation */}
				<aside className="w-full md:w-64 shrink-0">
					<Card className="sticky top-24">
						<CardContent className="p-0">
							<nav className="flex flex-col md:flex-col gap-1 p-2">
								<button
									onClick={() => handleTabChange('dashboard')}
									className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
										activeTab === 'dashboard'
											? 'bg-primary text-primary-foreground'
											: 'hover:bg-muted'
									}`}
								>
									<LayoutDashboard className="h-5 w-5" />
									Dashboard
								</button>
								<button
									onClick={() => handleTabChange('create')}
									className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
										activeTab === 'create'
											? 'bg-primary text-primary-foreground'
											: 'hover:bg-muted'
									}`}
								>
									<PlusCircle className="h-5 w-5" />
									Create Admin
								</button>
								<button
									onClick={() => handleTabChange('list')}
									className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
										activeTab === 'list'
											? 'bg-primary text-primary-foreground'
											: 'hover:bg-muted'
									}`}
								>
									<Users className="h-5 w-5" />
									Admin List
								</button>
								<button
									onClick={() =>
										handleTabChange('submissions')
									}
									className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
										activeTab === 'submissions'
											? 'bg-primary text-primary-foreground'
											: 'hover:bg-muted'
									}`}
								>
									<ClipboardList className="h-5 w-5" />
									User Submissions
								</button>
							</nav>
						</CardContent>
					</Card>
				</aside>

				{/* Main Content */}
				<main className="flex-1">
					{activeTab === 'dashboard' && (
						<div className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								<DashboardCard
									title="Total Admins"
									value="5"
									icon={
										<Users className="h-8 w-8 text-primary" />
									}
									description="Active administrator accounts"
								/>
								<DashboardCard
									title="User Submissions"
									value="128"
									icon={
										<ClipboardList className="h-8 w-8 text-primary" />
									}
									description="Total quiz submissions"
								/>
								<DashboardCard
									title="Average Score"
									value="76%"
									icon={
										<BarChart3 className="h-8 w-8 text-primary" />
									}
									description="Average user quiz score"
								/>
							</div>

							<Card>
								<CardHeader>
									<CardTitle>Recent Activity</CardTitle>
									<CardDescription>
										Latest actions in the admin portal
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<ActivityItem
											title="New Admin Created"
											description="John Doe was added as an administrator"
											time="2 hours ago"
										/>
										<ActivityItem
											title="User Submission Reset"
											description="Quiz data for user@example.com was reset"
											time="Yesterday"
										/>
										<ActivityItem
											title="System Update"
											description="The quiz system was updated to version 2.1"
											time="3 days ago"
										/>
									</div>
								</CardContent>
							</Card>
						</div>
					)}

					{activeTab === 'create' && (
						<Card>
							<CardHeader>
								<CardTitle>Create New Administrator</CardTitle>
								<CardDescription>
									Add a new administrator to manage the system
								</CardDescription>
							</CardHeader>
							<CardContent>
								<AdminForm />
							</CardContent>
						</Card>
					)}

					{activeTab === 'list' && (
						<Card>
							<CardHeader>
								<CardTitle>Administrator Accounts</CardTitle>
								<CardDescription>
									View and manage all administrator accounts
								</CardDescription>
							</CardHeader>
							<CardContent>
								<AdminList />
							</CardContent>
						</Card>
					)}

					{activeTab === 'submissions' && (
						<Card>
							<CardHeader>
								<CardTitle>User Quiz Submissions</CardTitle>
								<CardDescription>
									View and manage all user quiz submissions
									and results
								</CardDescription>
							</CardHeader>
							<CardContent>
								<UserSubmissions />
							</CardContent>
						</Card>
					)}
				</main>
			</div>
		</div>
	);
}

function DashboardCard({
	title,
	value,
	icon,
	description,
}: DashboardCardProps) {
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

function ActivityItem({ title, description, time }: ActivityItemProps) {
	return (
		<div className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
			<div className="bg-primary/10 p-2 rounded-full">
				<ClipboardList className="h-4 w-4 text-primary" />
			</div>
			<div className="flex-1">
				<h4 className="text-sm font-medium">{title}</h4>
				<p className="text-xs text-muted-foreground mt-1">
					{description}
				</p>
			</div>
			<div className="text-xs text-muted-foreground">{time}</div>
		</div>
	);
}
