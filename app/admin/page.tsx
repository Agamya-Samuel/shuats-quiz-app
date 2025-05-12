'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import { LayoutDashboard, FileQuestion, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { logout } from '@/actions/logout';

export default function AdminPage() {
	const defaultTab = 'manage-quiz';
	const searchParams = useSearchParams();
	const router = useRouter();
	const { toast } = useToast();

	// Get active tab directly from URL params or use default
	const activeTab = searchParams.get('tab') || defaultTab;

	// Update URL when tab changes
	const handleTabChange = (tab: string) => {
		// Update URL without refreshing the page
		router.push(`/admin?tab=${tab}`, { scroll: false });
	};

	// Redirect to specific page based on the tab
	useEffect(() => {
		if (activeTab === 'manage-quiz') {
			router.push('/admin/manage-quiz');
		} else if (activeTab === 'quiz-config') {
			router.push('/admin/quiz-config');
		}
	}, [activeTab, router]);

	const handleLogout = async () => {
		try {
			await logout();
			toast({
				title: 'Logged out successfully',
				description: 'You have been logged out.',
				variant: 'success',
			});
			router.push('/admin/login');
			router.refresh();
		} catch (err) {
			console.error('Logout error:', err);
			toast({
				title: 'Error',
				description: 'Failed to logout. Please try again.',
				variant: 'destructive',
			});
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			{/* Header */}
			<header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
				<div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-5xl">
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
						<LayoutDashboard className="h-6 w-6 text-primary" />
						Admin Portal
					</h1>
					<div className="flex items-center gap-4">
						<Button
							variant="destructive"
							size="sm"
							onClick={handleLogout}
							className="flex items-center gap-2"
						>
							<LogOut className="h-4 w-4" />
							<span className="hidden md:inline">Logout</span>
						</Button>
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
									onClick={() =>
										handleTabChange('manage-quiz')
									}
									className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
										activeTab === 'manage-quiz'
											? 'bg-primary text-primary-foreground'
											: 'hover:bg-muted'
									}`}
								>
									<FileQuestion className="h-5 w-5" />
									Manage Quiz
								</button>
								<button
									onClick={() =>
										handleTabChange('quiz-config')
									}
									className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
										activeTab === 'quiz-config'
											? 'bg-primary text-primary-foreground'
											: 'hover:bg-muted'
									}`}
								>
									<Settings className="h-5 w-5" />
									Quiz Configuration
								</button>
							</nav>
						</CardContent>
					</Card>
				</aside>

				{/* Main Content */}
				<main className="flex-1">
					<Card>
						<CardHeader>
							<CardTitle>Redirecting...</CardTitle>
							<CardDescription>
								Please wait while we redirect you to the
								selected section
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex justify-center p-4">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
							</div>
						</CardContent>
					</Card>
				</main>
			</div>
		</div>
	);
}
