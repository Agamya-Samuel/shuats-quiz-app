export const dynamic = 'force-dynamic';
import { AdminHeader } from './_components/AdminHeader';
import { AdminSidebar } from './_components/AdminSidebar';
import { SectionTabs } from './_components/SectionTabs';
import SubmissionContent from './_components/SubmissionContent';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Analytics } from './dashboard/_components/analytics';
import { Notifications } from './dashboard/_components/notifications';
import { QuizControl } from './dashboard/_components/quiz-control';
import { QuizSettings } from './dashboard/_components/quiz-settings';
import { UserManagement as DashboardUserManagement } from './dashboard/_components/user-management';
import { EnhancedQuestionList } from './manage-quiz/_components/enhanced-question-list';
import { QuestionForm } from './manage-quiz/_components/question-form';
import { QuizDashboard } from './manage-quiz/_components/quiz-dashboard';
import { DocumentVerificationList } from './verification/_components/document-verification-list';
import { VerificationHistory } from './verification/_components/verification-history';
import { VerificationSettings } from './verification/_components/verification-settings';
import { SimpleAnalyticsDashboard } from './_components/SimpleAnalyticsDashboard';

const knownSections = [
  'dashboard',
  'manage-quiz',
  'verification',
  'users',
  'analytics',
  'notifications',
  'settings',
  'site-analytics',
  'submission',
];

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { section?: string; tab?: string };
}) {
  const activeSection = searchParams.section || 'dashboard';
  const activeTab = searchParams.tab;

  const renderContent = () => {
    if (!knownSections.includes(activeSection)) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Section Not Found</CardTitle>
            <CardDescription>
              The section '{activeSection}' does not exist. Redirecting to
              dashboard...
            </CardDescription>
          </CardHeader>
          <CardContent>Please wait while we redirect you.</CardContent>
        </Card>
      );
    }

    switch (activeSection) {
      case 'dashboard':
        switch (activeTab) {
          case 'overview':
            return <Analytics />;
          case 'control':
            return <QuizControl />;
          case 'settings':
            return <QuizSettings />;
          case 'users':
            return <DashboardUserManagement />;
          case 'analytics':
            return <Analytics />;
          case 'notifications':
            return <Notifications />;
          default:
            return <Analytics />;
        }
      case 'manage-quiz':
        switch (activeTab) {
          case 'dashboard':
            return <QuizDashboard />;
          case 'add':
            return <QuestionForm />;
          case 'list':
            return <EnhancedQuestionList />;
          default:
            return <QuizDashboard />;
        }
      case 'verification':
        switch (activeTab) {
          case 'pending':
            return <DocumentVerificationList />;
          case 'approved':
            return <DocumentVerificationList />;
          case 'rejected':
            return <DocumentVerificationList />;
          case 'settings':
            return <VerificationSettings />;
          case 'history':
            return <VerificationHistory />;
          default:
            return <DocumentVerificationList />;
        }
      case 'users':
        return <DashboardUserManagement />;
      case 'submission':
        return <SubmissionContent />;
      case 'site-analytics':
        switch (activeTab) {
          case 'original':
            return <Analytics />;
          case 'simple':
            return <SimpleAnalyticsDashboard />;
          default:
            return <Analytics />;
        }
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Content Area</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Selected section: {activeSection}, Tab: {activeTab || 'None'}
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminHeader />

      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6 max-w-7xl">
        <aside className="hidden md:block w-full md:w-64 shrink-0">
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

          {activeSection !== 'submission' && <SectionTabs />}

          <div className="mt-6">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
}
