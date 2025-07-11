'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Analytics } from '../dashboard/_components/analytics';
import { Notifications } from '../dashboard/_components/notifications';
import { QuizControl } from '../dashboard/_components/quiz-control';
import { QuizSettings } from '../dashboard/_components/quiz-settings';
import { UserManagement as DashboardUserManagement } from '../dashboard/_components/user-management';
import { EnhancedQuestionList } from '../manage-quiz/_components/enhanced-question-list';
import { QuestionForm } from '../manage-quiz/_components/question-form';
import { QuizDashboard } from '../manage-quiz/_components/quiz-dashboard';
import { DocumentVerificationList } from '../verification/_components/document-verification-list';
import { VerificationHistory } from '../verification/_components/verification-history';
import { VerificationSettings } from '../verification/_components/verification-settings';
import { SimpleAnalyticsDashboard } from './SimpleAnalyticsDashboard';

const knownSections = [
  'dashboard',
  'manage-quiz',
  'verification',
  'users',
  'analytics',
  'notifications',
  'settings',
  'quiz-config',
  'site-analytics',
];

export function AdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeSection = searchParams.get('section') || 'dashboard';

  const getDefaultTabForSection = (section: string) => {
    switch (section) {
      case 'dashboard':
        return 'overview';
      case 'manage-quiz':
        return 'dashboard';
      case 'verification':
        return 'pending';
      case 'users':
        return 'list';
      case 'quiz-config':
        return 'general';
      case 'site-analytics':
        return 'original';
      default:
        return '';
    }
  };
  const activeTab =
    searchParams.get('tab') || getDefaultTabForSection(activeSection);

  useEffect(() => {
    if (!activeSection || !knownSections.includes(activeSection)) {
      router.replace('/admin?section=dashboard&tab=overview');
    } else if (
      activeSection &&
      !activeTab &&
      getDefaultTabForSection(activeSection)
    ) {
    }
  }, [activeSection, activeTab, router]);

  const renderDashboardContent = () => {
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
        router.replace('/admin?section=dashboard&tab=overview');
        return <Analytics />;
    }
  };

  const renderManageQuizContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <QuizDashboard />;
      case 'add':
        return <QuestionForm />;
      case 'list':
        return <EnhancedQuestionList />;
      default:
        router.replace('/admin?section=manage-quiz&tab=dashboard');
        return <QuizDashboard />;
    }
  };

  const renderVerificationContent = () => {
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
        router.replace('/admin?section=verification&tab=pending');
        return <DocumentVerificationList />;
    }
  };

  const renderUsersContent = () => {
    switch (activeTab) {
      case 'list':
        return <DashboardUserManagement />;
      case 'profile':
        return (
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p>User profile view (placeholder).</p>
            </CardContent>
          </Card>
        );
      case 'roles':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Role Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Role management interface (placeholder).</p>
            </CardContent>
          </Card>
        );
      default:
        router.replace('/admin?section=users&tab=list');
        return <DashboardUserManagement />;
    }
  };

  const renderQuizConfigContent = () => {
    switch (activeTab) {
      case 'general':
        return <QuizSettings />;
      case 'reset':
        return <QuizSettings showResetOnly={true} />;
      default:
        router.replace('/admin?section=quiz-config&tab=general');
        return <QuizSettings />;
    }
  };

  const renderSiteAnalyticsContent = () => {
    switch (activeTab) {
      case 'original':
        return <Analytics />;
      case 'simple':
        return <SimpleAnalyticsDashboard />;
      default:
        router.replace('/admin?section=site-analytics&tab=original');
        return <Analytics />;
    }
  };

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
        return renderDashboardContent();
      case 'manage-quiz':
        return renderManageQuizContent();
      case 'verification':
        return renderVerificationContent();
      case 'users':
        return renderUsersContent();
      case 'analytics':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Main Analytics</CardTitle>
              <CardDescription>
                Detailed system-wide analytics and reports.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Main analytics content goes here. (Tab: {activeTab || 'None'})
              </p>
            </CardContent>
          </Card>
        );
      case 'notifications':
        return (
          <Card>
            <CardHeader>
              <CardTitle>System Notifications</CardTitle>
              <CardDescription>
                Manage system notifications and announcements.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Notifications content goes here. (Tab: {activeTab || 'None'})
              </p>
            </CardContent>
          </Card>
        );
      case 'settings':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Site Settings</CardTitle>
              <CardDescription>
                Configure global site settings and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                General settings content goes here. (Tab: {activeTab || 'None'})
              </p>
            </CardContent>
          </Card>
        );
      case 'quiz-config':
        return renderQuizConfigContent();
      case 'site-analytics':
        return renderSiteAnalyticsContent();
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
              <p className="text-muted-foreground">
                This section is recognized but has no specific content defined
                for the current tab.
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return <div className="mt-6">{renderContent()}</div>;
}
