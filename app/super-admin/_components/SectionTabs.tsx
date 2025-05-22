import {
  Bell,
  Database,
  FileCheck,
  History,
  LayoutDashboard,
  Settings,
  Shield,
  Users,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function SectionTabs() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getDefaultTabForSection = (section: string) => {
    switch (section) {
      case 'dashboard':
        return 'overview';
      case 'admin-management':
        return 'list';
      case 'users':
        return 'active';
      case 'database':
        return 'status';
      case 'verification':
        return 'pending';
      default:
        return '';
    }
  };

  const section = searchParams.get('section') || 'dashboard';
  const activeTab = searchParams.get('tab') || getDefaultTabForSection(section);

  const handleTabChange = (tab: string) => {
    router.push(`/super-admin?section=${section}&tab=${tab}`, {
      scroll: false,
    });
  };

  const renderTabs = () => {
    switch (section) {
      case 'dashboard':
        return renderDashboardTabs();
      case 'admin-management':
        return renderAdminManagementTabs();
      case 'users':
        return renderUserManagementTabs();
      case 'database':
        return renderDatabaseTabs();
      case 'verification':
        return renderVerificationTabs();
      default:
        return null;
    }
  };

  const renderDashboardTabs = () => (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="w-full">
      <TabsList className="grid grid-cols-2 gap-2">
        <TabsTrigger
          value="overview"
          className="flex items-center gap-2">
          <LayoutDashboard className="h-4 w-4" />
          <span>Overview</span>
        </TabsTrigger>
        <TabsTrigger
          value="metrics"
          className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span>System Metrics</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );

  const renderAdminManagementTabs = () => (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="w-full">
      <TabsList className="grid grid-cols-3 gap-2">
        <TabsTrigger
          value="list"
          className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>Admin List</span>
        </TabsTrigger>
        <TabsTrigger
          value="roles"
          className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span>Roles</span>
        </TabsTrigger>
        <TabsTrigger
          value="permissions"
          className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span>Permissions</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );

  const renderUserManagementTabs = () => (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="w-full">
      <TabsList className="grid grid-cols-3 gap-2">
        <TabsTrigger
          value="active"
          className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>Active Users</span>
        </TabsTrigger>
        <TabsTrigger
          value="blocked"
          className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          <span>Blocked Users</span>
        </TabsTrigger>
        <TabsTrigger
          value="reports"
          className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span>Reports</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );

  const renderDatabaseTabs = () => (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="w-full">
      <TabsList className="grid grid-cols-3 gap-2">
        <TabsTrigger
          value="status"
          className="flex items-center gap-2">
          <Database className="h-4 w-4" />
          <span>Status</span>
        </TabsTrigger>
        <TabsTrigger
          value="backups"
          className="flex items-center gap-2">
          <History className="h-4 w-4" />
          <span>Backups</span>
        </TabsTrigger>
        <TabsTrigger
          value="logs"
          className="flex items-center gap-2">
          <FileCheck className="h-4 w-4" />
          <span>Logs</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );

  const renderVerificationTabs = () => (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className="w-full">
      <TabsList className="grid grid-cols-3 gap-2">
        <TabsTrigger
          value="pending"
          className="flex items-center gap-2">
          <FileCheck className="h-4 w-4" />
          <span>Pending</span>
        </TabsTrigger>
        <TabsTrigger
          value="history"
          className="flex items-center gap-2">
          <History className="h-4 w-4" />
          <span>History</span>
        </TabsTrigger>
        <TabsTrigger
          value="settings"
          className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );

  return <div className="mt-6">{renderTabs()}</div>;
}
