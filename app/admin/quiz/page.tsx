'use client';
import { QuestionForm } from '@/app/admin/quiz/_components/question-form';
import { QuestionList } from '@/app/admin/quiz/_components/question-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams, useRouter } from 'next/navigation';

export default function QuizAdminPage() {
	// Use the new App Router hooks
	const searchParams = useSearchParams();
	const router = useRouter();

	// Get the tab from search params
	const defaultTab = searchParams.get('tab') || 'add';

	// Updated function to handle tab changes
	const handleTabChange = (value: string) => {
		// Create a new URLSearchParams instance
		const params = new URLSearchParams(searchParams);
		params.set('tab', value);

		// Use the new router.push format
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
