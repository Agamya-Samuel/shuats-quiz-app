'use client';

import { useSearchParams } from 'next/navigation';
import { AdminHeader } from './_components/AdminHeader';
import { AdminSidebar } from './_components/AdminSidebar';
import { AdminContent } from './_components/AdminContent';
import { SectionTabs } from './_components/SectionTabs';

export default function AdminPage() {
	const searchParams = useSearchParams();
	const activeSection = searchParams.get('section') || 'dashboard';

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			{/* Common Header */}
			<AdminHeader />

			<div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6 max-w-7xl">
				{/* Sidebar Navigation */}
				<aside className="w-full md:w-64 shrink-0">
					<AdminSidebar />
				</aside>

				{/* Main Content Area */}
				<main className="flex-1 space-y-6">
					<div className="flex flex-col space-y-1.5">
						<h2 className="text-3xl font-bold tracking-tight">
							{activeSection === 'dashboard' && 'Dashboard'}
							{activeSection === 'manage-quiz' && 'Manage Quiz'}
							{activeSection === 'verification' &&
								'Document Verification'}
							{activeSection === 'users' && 'User Management'}
							{activeSection === 'analytics' && 'Analytics'}
							{activeSection === 'notifications' &&
								'Notifications'}
							{activeSection === 'settings' && 'Settings'}
							{activeSection === 'quiz-config' &&
								'Quiz Configuration'}
						</h2>
						<p className="text-muted-foreground">
							{activeSection === 'dashboard' &&
								'Overview of quiz activities and system status'}
							{activeSection === 'manage-quiz' &&
								'Create and manage quiz questions'}
							{activeSection === 'verification' &&
								'Verify user documents and manage verification processes'}
							{activeSection === 'users' &&
								'Manage user accounts and permissions'}
							{activeSection === 'analytics' &&
								'View detailed analytics and reports'}
							{activeSection === 'notifications' &&
								'Manage system notifications and announcements'}
							{activeSection === 'settings' &&
								'Configure system settings and preferences'}
							{activeSection === 'quiz-config' &&
								'Configure global quiz settings and behavior'}
						</p>
					</div>

					{/* Section-specific Tabs */}
					<SectionTabs />

					{/* Dynamic Content Area */}
					<AdminContent />
				</main>
			</div>
		</div>
	);
}
