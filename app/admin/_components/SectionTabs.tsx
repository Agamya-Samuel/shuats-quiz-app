'use client';

import type { Dispatch, SetStateAction } from 'react';
import {
  CheckSquare,
  Clock,
  FileText,
  History,
  LayoutDashboard,
  ListChecks,
  PlusCircle,
  RefreshCcw,
  Sliders,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function SectionTabs({
  setSidebarOpen,
}: {
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const section = searchParams.get('section') || 'dashboard';
  const activeTab = searchParams.get('tab') || 'overview';

  const handleTabChange = (tab: string) => {
    router.push(`/admin?section=${section}&tab=${tab}`, { scroll: false });
    setSidebarOpen(false);
  };

  // Render tabs based on active section
  const renderTabs = () => {
    switch (section) {
      case 'manage-quiz':
        return renderManageQuizTabs();
      case 'verification':
        return renderVerificationTabs();
      case 'site-analytics':
        return renderSiteAnalyticsTabs();
      default:
        return null;
    }
  };

  const renderManageQuizTabs = () => (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="w-full">
      <TabsList className="flex flex-wrap items-center gap-2">
        <TabsTrigger
          value="dashboard"
          className="flex items-center gap-2">
          <LayoutDashboard className="h-4 w-4" />
          <span>Overview</span>
        </TabsTrigger>
        <TabsTrigger
          value="add"
          className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Add Question</span>
        </TabsTrigger>
        <TabsTrigger
          value="list"
          className="flex items-center gap-2">
          <ListChecks className="h-4 w-4" />
          <span>Question List</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );

  const renderVerificationTabs = () => (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="w-full">
      <TabsList className="flex flex-wrap items-center gap-2">
        <TabsTrigger
          value="pending"
          className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4" />
          <span>Pending</span>
        </TabsTrigger>
        <TabsTrigger
          value="approved"
          className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4" />
          <span>Approved</span>
        </TabsTrigger>
        <TabsTrigger
          value="rejected"
          className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4" />
          <span>Rejected</span>
        </TabsTrigger>
        <TabsTrigger
          value="settings"
          className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span>Settings</span>
        </TabsTrigger>
        <TabsTrigger
          value="history"
          className="flex items-center gap-2">
          <History className="h-4 w-4" />
          <span>History</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );


  const renderSiteAnalyticsTabs = () => (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="w-full">
      <TabsList className="flex flex-wrap items-center gap-2">
        <TabsTrigger
          value="original"
          className="flex items-center gap-2">
          <LayoutDashboard className="h-4 w-4" />
          <span>Quiz Analytics</span>
        </TabsTrigger>
        <TabsTrigger
          value="simple"
          className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span>Simple Analytics</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );

  return <div className="w-full mb-6">{renderTabs()}</div>;
}
