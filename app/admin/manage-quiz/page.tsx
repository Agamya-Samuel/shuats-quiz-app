'use client';
import { QuestionForm } from '@/app/admin/manage-quiz/_components/question-form';
import { QuestionList } from '@/app/admin/manage-quiz/_components/question-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import LoadingState from '@/components/loading-component';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { logout } from '@/actions/logout';
import { useToast } from '@/hooks/use-toast';

// Separate the main content into a client component
function QuizContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { toast } = useToast();
	const defaultTab = searchParams.get('tab') || 'add';

	const handleTabChange = (value: string) => {
		const params = new URLSearchParams(searchParams);
		params.set('tab', value);
		router.push(`?${params.toString()}`);
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
			router.refresh(); // Refresh to update cookie context
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
		<div className="container mx-auto py-8">
			<div className="mb-8 flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Quiz Management
					</h1>
					<p className="text-muted-foreground">
						Create and manage quiz questions.
					</p>
				</div>
				<Button
					variant="destructive"
					size="lg"
					onClick={handleLogout}
					className="text-md"
				>
					<LogOut className="h-5 w-5" />
					<span className="ml-2 hidden sm:block">Logout</span>
				</Button>
			</div>
			<Tabs
				defaultValue={defaultTab}
				onValueChange={handleTabChange}
				className="space-y-4"
			>
				<TabsList>
					<TabsTrigger value="add">Add Question</TabsTrigger>
					<TabsTrigger value="list">Question List</TabsTrigger>
				</TabsList>
				<TabsContent value="add" className="space-y-4">
					<div className="grid gap-6">
						<QuestionForm />
					</div>
				</TabsContent>
				<TabsContent value="list" className="space-y-4">
					<QuestionList />
				</TabsContent>
			</Tabs>
		</div>
	);
}

// Main page component with Suspense boundary
export default function QuizAdminPage() {
	return (
		<Suspense fallback={<LoadingState />}>
			<QuizContent />
		</Suspense>
	);
}
