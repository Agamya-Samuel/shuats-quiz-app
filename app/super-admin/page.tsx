'use client';

import { useSearchParams } from 'next/navigation';

import { SectionTabs } from './_components/SectionTabs';
import { SuperAdminContent } from './_components/SuperAdminContent';
import { SuperAdminHeader } from './_components/SuperAdminHeader';
import { SuperAdminSidebar } from './_components/SuperAdminSidebar';

export default function SuperAdminPage() {
  const searchParams = useSearchParams();
  const activeSection = searchParams.get('section') || 'dashboard';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Common Header */}
      <SuperAdminHeader />

      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6 max-w-7xl">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <SuperAdminSidebar />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 space-y-6">
          <div className="flex flex-col space-y-1.5">
            <h2 className="text-3xl font-bold tracking-tight">
              {activeSection === 'dashboard' && 'Dashboard'}
              {activeSection === 'admin-management' && 'Admin Management'}
              {activeSection === 'users' && 'User Management'}
              {activeSection === 'settings' && 'System Settings'}
              {activeSection === 'database' && 'Database Control'}
              {activeSection === 'verification' && 'Verification Control'}
              {activeSection === 'alerts' && 'System Alerts'}
              {activeSection === 'notifications' && 'Notifications'}
            </h2>
            <p className="text-muted-foreground">
              {activeSection === 'dashboard' &&
                'System overview and key metrics'}
              {activeSection === 'admin-management' &&
                'Manage administrator accounts and permissions'}
              {activeSection === 'users' &&
                'View and manage user data and submissions'}
              {activeSection === 'settings' &&
                'Configure global system settings'}
              {activeSection === 'database' &&
                'Manage database operations and backups'}
              {activeSection === 'verification' &&
                'Control verification processes and settings'}
              {activeSection === 'alerts' && 'Monitor and manage system alerts'}
              {activeSection === 'notifications' &&
                'Manage system-wide notifications'}
            </p>
          </div>

          {/* Section-specific Tabs */}
          <SectionTabs />

          {/* Dynamic Content Area */}
          <SuperAdminContent />
        </main>
      </div>
    </div>
  );
}
