'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';

// Import dashboard components
import { QuizDashboard } from '../manage-quiz/_components/quiz-dashboard';
import { QuizControl } from '../dashboard/_components/quiz-control';
import { QuizSettings } from '../dashboard/_components/quiz-settings';
import { UserManagement } from '../dashboard/_components/user-management';
import { Analytics } from '../dashboard/_components/analytics';
import { Notifications } from '../dashboard/_components/notifications';

// Import manage-quiz components
import { QuestionForm } from '../manage-quiz/_components/question-form';
import { EnhancedQuestionList } from '../manage-quiz/_components/enhanced-question-list';

// Import verification components
import { DocumentVerificationList } from '../verification/_components/document-verification-list';
import { VerificationHistory } from '../verification/_components/verification-history';
import { VerificationSettings } from '../verification/_components/verification-settings';

export function AdminContent() {
	const searchParams = useSearchParams();
	const [activeSection, setActiveSection] = useState('dashboard');
	const [activeTab, setActiveTab] = useState('');

	useEffect(() => {
		// Get section and tab from URL parameters
		const section = searchParams.get('section') || 'dashboard';
		const tab = searchParams.get('tab') || getDefaultTabForSection(section);

		setActiveSection(section);
		setActiveTab(tab);
	}, [searchParams]);

	// Helper function to get the default tab for each section
	const getDefaultTabForSection = (section: string) => {
		switch (section) {
			case 'dashboard':
				return 'overview';
			case 'manage-quiz':
				return 'list';
			case 'verification':
				return 'pending';
			case 'users':
				return 'management';
			case 'analytics':
				return 'overview';
			case 'notifications':
				return 'all';
			case 'settings':
				return 'general';
			case 'quiz-config':
				return 'general';
			default:
				return '';
		}
	};

	// Render content based on active section and tab
	const renderContent = () => {
		switch (activeSection) {
			case 'dashboard':
				return renderDashboardContent();
			case 'manage-quiz':
				return renderManageQuizContent();
			case 'verification':
				return renderVerificationContent();
			case 'users':
				return renderUsersContent();
			case 'analytics':
				return renderAnalyticsContent();
			case 'notifications':
				return renderNotificationsContent();
			case 'settings':
				return renderSettingsContent();
			case 'quiz-config':
				return renderQuizConfigContent();
			default:
				return (
					<Card>
						<CardHeader>
							<CardTitle>Section Not Found</CardTitle>
						</CardHeader>
						<CardContent>
							The requested section does not exist.
						</CardContent>
					</Card>
				);
		}
	};

	// Render dashboard content based on active tab
	const renderDashboardContent = () => {
		switch (activeTab) {
			case 'overview':
				return <QuizDashboard />;
			case 'control':
				return <QuizControl />;
			default:
				return <QuizDashboard />;
		}
	};

	// Render manage-quiz content based on active tab
	const renderManageQuizContent = () => {
		switch (activeTab) {
			case 'list':
				return (
					<Card>
						<CardHeader>
							<CardTitle>Question Database</CardTitle>
							<CardDescription>
								View and manage all questions in the database
							</CardDescription>
						</CardHeader>
						<CardContent>
							<EnhancedQuestionList />
						</CardContent>
					</Card>
				);
			case 'create':
				return (
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
				);
			default:
				return (
					<Card>
						<CardHeader>
							<CardTitle>Question Database</CardTitle>
							<CardDescription>
								View and manage all questions in the database
							</CardDescription>
						</CardHeader>
						<CardContent>
							<EnhancedQuestionList />
						</CardContent>
					</Card>
				);
		}
	};

	// Render verification content based on active tab
	const renderVerificationContent = () => {
		switch (activeTab) {
			case 'pending':
				return (
					<Card>
						<CardHeader>
							<CardTitle>
								Pending Document Verifications
							</CardTitle>
							<CardDescription>
								Review and approve/reject user-submitted
								documents
							</CardDescription>
						</CardHeader>
						<CardContent>
							<DocumentVerificationList />
						</CardContent>
					</Card>
				);
			case 'history':
				return (
					<Card>
						<CardHeader>
							<CardTitle>Verification History</CardTitle>
							<CardDescription>
								View history of all document verifications
							</CardDescription>
						</CardHeader>
						<CardContent>
							<VerificationHistory />
						</CardContent>
					</Card>
				);
			case 'settings':
				return (
					<Card>
						<CardHeader>
							<CardTitle>Verification Settings</CardTitle>
							<CardDescription>
								Configure document verification requirements
							</CardDescription>
						</CardHeader>
						<CardContent>
							<VerificationSettings />
						</CardContent>
					</Card>
				);
			default:
				return (
					<Card>
						<CardHeader>
							<CardTitle>
								Pending Document Verifications
							</CardTitle>
							<CardDescription>
								Review and approve/reject user-submitted
								documents
							</CardDescription>
						</CardHeader>
						<CardContent>
							<DocumentVerificationList />
						</CardContent>
					</Card>
				);
		}
	};

	// Render users content
	const renderUsersContent = () => {
		return (
			<Card>
				<CardHeader>
					<CardTitle>User Management</CardTitle>
					<CardDescription>
						Manage user accounts and permissions
					</CardDescription>
				</CardHeader>
				<CardContent>
					<UserManagement />
				</CardContent>
			</Card>
		);
	};

	// Render analytics content
	const renderAnalyticsContent = () => {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Analytics Dashboard</CardTitle>
					<CardDescription>
						View detailed analytics and reports
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Analytics />
				</CardContent>
			</Card>
		);
	};

	// Render notifications content
	const renderNotificationsContent = () => {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Notifications Center</CardTitle>
					<CardDescription>
						Manage system notifications and announcements
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Notifications />
				</CardContent>
			</Card>
		);
	};

	// Render settings content
	const renderSettingsContent = () => {
		return (
			<Card>
				<CardHeader>
					<CardTitle>System Settings</CardTitle>
					<CardDescription>
						Configure system settings and preferences
					</CardDescription>
				</CardHeader>
				<CardContent>
					<QuizSettings />
				</CardContent>
			</Card>
		);
	};

	// Render quiz-config content
	const renderQuizConfigContent = () => {
		switch (activeTab) {
			case 'general':
				return (
					<Card>
						<CardHeader>
							<CardTitle>Quiz Configuration</CardTitle>
							<CardDescription>
								Configure global quiz settings and behavior
							</CardDescription>
						</CardHeader>
						<CardContent>
							<QuizSettings />
						</CardContent>
					</Card>
				);
			case 'reset':
				return (
					<Card>
						<CardHeader>
							<CardTitle>Reset Quiz Settings</CardTitle>
							<CardDescription>
								Reset all quiz settings to defaults
							</CardDescription>
						</CardHeader>
						<CardContent>
							<QuizSettings showResetOnly={true} />
						</CardContent>
					</Card>
				);
			default:
				return (
					<Card>
						<CardHeader>
							<CardTitle>Quiz Configuration</CardTitle>
							<CardDescription>
								Configure global quiz settings and behavior
							</CardDescription>
						</CardHeader>
						<CardContent>
							<QuizSettings />
						</CardContent>
					</Card>
				);
		}
	};

	return <div className="flex-1">{renderContent()}</div>;
}
