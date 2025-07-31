'use client';
import { useSearchParams } from 'next/navigation';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { SectionTabs } from './SectionTabs';
import AdminContent from './AdminContent';
import { Suspense, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function AdminPageClient() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sp = useSearchParams();
  const activeSection = sp.get('section') || 'dashboard';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminHeader
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="container mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:flex-row">
        <aside className="hidden w-full shrink-0 md:block md:w-64">
          <AdminSidebar />
        </aside>

        <main className="flex-1 space-y-6">
          <div className="flex flex-col space-y-1.5">
            <h2 className="text-3xl font-bold tracking-tight">
              {activeSection === 'dashboard' && 'Dashboard'}
              {activeSection === 'manage-quiz' && 'Manage Quiz'}
              {activeSection === 'verification' && 'Document Verification'}
              {activeSection === 'submission' && 'Submission'}
              {activeSection === 'users' && 'User Management'}
              {activeSection === 'analytics' && 'Analytics'}
              {activeSection === 'notifications' && 'Notifications'}
              {activeSection === 'settings' && 'Settings'}
              {activeSection === 'site-analytics' && 'Site Analytics'}
            </h2>
            <p className="text-muted-foreground">
              {activeSection === 'dashboard' &&
                'Overview of quiz activities and system status'}
              {activeSection === 'manage-quiz' &&
                'Create and manage quiz questions'}
              {activeSection === 'verification' &&
                'Verify user documents and manage verification processes'}
              {activeSection === 'submission' &&
                'Reset quiz submissions for a specific user'}
              {activeSection === 'users' &&
                'Manage user accounts and permissions'}
              {activeSection === 'analytics' &&
                'View detailed analytics and reports'}
              {activeSection === 'notifications' &&
                'Manage system notifications and announcements'}
              {activeSection === 'settings' &&
                'Configure system settings and preferences'}
              {activeSection === 'site-analytics' &&
                'View website analytics powered by Simple Analytics'}
            </p>
          </div>

          {activeSection !== 'submission' && (
            <Suspense fallback={<Skeleton className="h-12 w-full" />}>
              <SectionTabs setSidebarOpen={setSidebarOpen} />
            </Suspense>
          )}

          <div className="mt-6">
            <Suspense
              fallback={
                <Card>
                  <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-32 w-full" />
                  </CardContent>
                </Card>
              }
            >
              <AdminContent />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}