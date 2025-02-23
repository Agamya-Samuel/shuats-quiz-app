'use client';
import { QuestionForm } from '@/app/admin/manage-quiz/_components/question-form';
import { QuestionList } from '@/app/admin/manage-quiz/_components/question-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import LoadingState from '@/components/loading-component';

// Separate the main content into a client component
function QuizContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const defaultTab = searchParams.get('tab') || 'add';

	const handleTabChange = (value: string) => {
		const params = new URLSearchParams(searchParams);
		params.set('tab', value);
		router.push(`?${params.toString()}`);
	};

	return (
		<div className="container mx-auto py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight">
					Quiz Management
				</h1>
				<p className="text-muted-foreground">
					Create and manage quiz questions.
				</p>
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
