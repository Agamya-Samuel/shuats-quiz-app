'use client';
import { useSearchParams } from 'next/navigation';
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
import SubmissionClientPage from './SubmissionClientPage';

const knownSections = [
  'dashboard',
  'manage-quiz',
  'verification',
  'submission',
  'users',
  'analytics',
  'notifications',
  'settings',
  'site-analytics',
];

export default function AdminContent() {
  const searchParams = useSearchParams();
  const activeSection = searchParams.get('section') || 'dashboard';
  const activeTab = searchParams.get('tab');

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
  case 'submission':
        return <SubmissionClientPage />;
       case 'users':
         return <DashboardUserManagement />;
       case 'settings':
      return <QuizSettings />;
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
}
