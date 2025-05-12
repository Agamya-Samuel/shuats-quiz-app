'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { logout } from '@/actions/logout';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';
import { QuestionForm } from './_components/question-form';
import { EnhancedQuestionList } from './_components/enhanced-question-list';
import { QuizDashboard } from './_components/quiz-dashboard';
import {
	LayoutDashboard,
	PlusCircle,
	ListChecks,
	LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ManageQuizPage() {
	const defaultTab = 'dashboard';
	const searchParams = useSearchParams();
	const router = useRouter();
	const { toast } = useToast();

	// Get active tab directly from URL params or use default
	const activeTab = searchParams.get('tab') || defaultTab;

	// Update URL when tab changes
	const handleTabChange = (tab: string) => {
		// Update URL without refreshing the page
		router.push(`/admin/manage-quiz?tab=${tab}`, { scroll: false });
	};

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
					<div className="flex items-center gap-3">
						<h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
							<LayoutDashboard className="h-6 w-6 text-primary" />
							Manage Quiz
						</h1>
					</div>
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
									Add Question
								</button>
								<button
									onClick={() => handleTabChange('list')}
									className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
										activeTab === 'list'
											? 'bg-primary text-primary-foreground'
											: 'hover:bg-muted'
									}`}
								>
									<ListChecks className="h-5 w-5" />
									Question List
								</button>
							</nav>
						</CardContent>
					</Card>
				</aside>

				{/* Main Content */}
				<main className="flex-1">
					{activeTab === 'dashboard' && <QuizDashboard />}

					{activeTab === 'create' && (
						<Card>
							<CardHeader>
								<CardTitle>Add New Question</CardTitle>
								<CardDescription>
									Create a new question for the quiz database
								</CardDescription>
							</CardHeader>
							<CardContent>
								<QuestionForm />
							</CardContent>
						</Card>
					)}

					{activeTab === 'list' && (
						<Card>
							<CardHeader>
								<CardTitle>Question Database</CardTitle>
								<CardDescription>
									View and manage all questions in the
									database
								</CardDescription>
							</CardHeader>
							<CardContent>
								<EnhancedQuestionList />
							</CardContent>
						</Card>
					)}
				</main>
			</div>
		</div>
	);
}
