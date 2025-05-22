'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	LayoutDashboard,
	PlusCircle,
	ListChecks,
	Clock,
	CheckSquare,
	History,
	FileText,
	Sliders,
	RefreshCcw,
} from 'lucide-react';

export function SectionTabs() {
	const searchParams = useSearchParams();
	const router = useRouter();

	// Helper function to get the default tab for each section
	const getDefaultTabForSection = (section: string) => {
		switch (section) {
			case 'dashboard':
				return 'overview';
			case 'manage-quiz':
				return 'list';
			case 'verification':
				return 'pending';
			case 'quiz-config':
				return 'general';
			default:
				return '';
		}
	};

	const section = searchParams.get('section') || 'dashboard';
	const activeTab =
		searchParams.get('tab') || getDefaultTabForSection(section);

	const handleTabChange = (tab: string) => {
		router.push(`/admin?section=${section}&tab=${tab}`, { scroll: false });
	};

	// Render tabs based on active section
	const renderTabs = () => {
		switch (section) {
			case 'dashboard':
				return renderDashboardTabs();
			case 'manage-quiz':
				return renderManageQuizTabs();
			case 'verification':
				return renderVerificationTabs();
			case 'quiz-config':
				return renderQuizConfigTabs();
			default:
				return null;
		}
	};

	const renderDashboardTabs = () => (
		<Tabs
			value={activeTab}
			onValueChange={handleTabChange}
			className="w-full"
		>
			<TabsList className="grid grid-cols-2 gap-2">
				<TabsTrigger
					value="overview"
					className="flex items-center gap-2"
				>
					<LayoutDashboard className="h-4 w-4" />
					<span>Overview</span>
				</TabsTrigger>
				<TabsTrigger
					value="control"
					className="flex items-center gap-2"
				>
					<Clock className="h-4 w-4" />
					<span>Quiz Control</span>
				</TabsTrigger>
			</TabsList>
		</Tabs>
	);

	const renderManageQuizTabs = () => (
		<Tabs
			value={activeTab}
			onValueChange={handleTabChange}
			className="w-full"
		>
			<TabsList className="grid grid-cols-2 gap-2">
				<TabsTrigger value="list" className="flex items-center gap-2">
					<ListChecks className="h-4 w-4" />
					<span>Question List</span>
				</TabsTrigger>
				<TabsTrigger value="create" className="flex items-center gap-2">
					<PlusCircle className="h-4 w-4" />
					<span>Add Question</span>
				</TabsTrigger>
			</TabsList>
		</Tabs>
	);

	const renderVerificationTabs = () => (
		<Tabs
			value={activeTab}
			onValueChange={handleTabChange}
			className="w-full"
		>
			<TabsList className="grid grid-cols-3 gap-2">
				<TabsTrigger
					value="pending"
					className="flex items-center gap-2"
				>
					<CheckSquare className="h-4 w-4" />
					<span>Pending Verifications</span>
				</TabsTrigger>
				<TabsTrigger
					value="history"
					className="flex items-center gap-2"
				>
					<History className="h-4 w-4" />
					<span>Verification History</span>
				</TabsTrigger>
				<TabsTrigger
					value="settings"
					className="flex items-center gap-2"
				>
					<FileText className="h-4 w-4" />
					<span>Verification Settings</span>
				</TabsTrigger>
			</TabsList>
		</Tabs>
	);

	const renderQuizConfigTabs = () => (
		<Tabs
			value={activeTab}
			onValueChange={handleTabChange}
			className="w-full"
		>
			<TabsList className="grid grid-cols-2 gap-2">
				<TabsTrigger
					value="general"
					className="flex items-center gap-2"
				>
					<Sliders className="h-4 w-4" />
					<span>General Settings</span>
				</TabsTrigger>
				<TabsTrigger value="reset" className="flex items-center gap-2">
					<RefreshCcw className="h-4 w-4" />
					<span>Reset Settings</span>
				</TabsTrigger>
			</TabsList>
		</Tabs>
	);

	return <div className="w-full mb-6">{renderTabs()}</div>;
}
