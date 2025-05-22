'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Import existing components
import { AdminForm } from './admin-form';
import { AdminList } from './admin-list';
import { UserSubmissions } from './user-submissions';

export function SuperAdminContent() {
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    const section = searchParams.get('section') || 'dashboard';
    const tab = searchParams.get('tab') || getDefaultTabForSection(section);

    setActiveSection(section);
    setActiveTab(tab);
  }, [searchParams]);

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

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboardContent();
      case 'admin-management':
        return renderAdminManagementContent();
      case 'users':
        return renderUsersContent();
      case 'settings':
        return renderSettingsContent();
      case 'database':
        return renderDatabaseContent();
      case 'verification':
        return renderVerificationContent();
      case 'alerts':
        return renderAlertsContent();
      case 'notifications':
        return renderNotificationsContent();
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Section Not Found</CardTitle>
            </CardHeader>
            <CardContent>The requested section does not exist.</CardContent>
          </Card>
        );
    }
  };

  const renderDashboardContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
              <CardDescription>Key system metrics and status</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add system overview content here */}
              System overview content coming soon...
            </CardContent>
          </Card>
        );
      case 'metrics':
        return (
          <Card>
            <CardHeader>
              <CardTitle>System Metrics</CardTitle>
              <CardDescription>
                Detailed system performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add system metrics content here */}
              System metrics content coming soon...
            </CardContent>
          </Card>
        );
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
              <CardDescription>Key system metrics and status</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add system overview content here */}
              System overview content coming soon...
            </CardContent>
          </Card>
        );
    }
  };

  const renderAdminManagementContent = () => {
    switch (activeTab) {
      case 'list':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Admin List</CardTitle>
              <CardDescription>Manage administrator accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminList />
            </CardContent>
          </Card>
        );
      case 'roles':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Admin Roles</CardTitle>
              <CardDescription>Manage administrator roles</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add roles management content here */}
              Roles management content coming soon...
            </CardContent>
          </Card>
        );
      case 'permissions':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Admin Permissions</CardTitle>
              <CardDescription>Configure admin permissions</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add permissions management content here */}
              Permissions management content coming soon...
            </CardContent>
          </Card>
        );
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Admin List</CardTitle>
              <CardDescription>Manage administrator accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminList />
            </CardContent>
          </Card>
        );
    }
  };

  const renderUsersContent = () => {
    switch (activeTab) {
      case 'active':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Active Users</CardTitle>
              <CardDescription>View and manage active users</CardDescription>
            </CardHeader>
            <CardContent>
              <UserSubmissions />
            </CardContent>
          </Card>
        );
      case 'blocked':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Blocked Users</CardTitle>
              <CardDescription>Manage blocked user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add blocked users content here */}
              Blocked users content coming soon...
            </CardContent>
          </Card>
        );
      case 'reports':
        return (
          <Card>
            <CardHeader>
              <CardTitle>User Reports</CardTitle>
              <CardDescription>View and manage user reports</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add user reports content here */}
              User reports content coming soon...
            </CardContent>
          </Card>
        );
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Active Users</CardTitle>
              <CardDescription>View and manage active users</CardDescription>
            </CardHeader>
            <CardContent>
              <UserSubmissions />
            </CardContent>
          </Card>
        );
    }
  };

  const renderDatabaseContent = () => {
    switch (activeTab) {
      case 'status':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Database Status</CardTitle>
              <CardDescription>
                Current database status and health
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add database status content here */}
              Database status content coming soon...
            </CardContent>
          </Card>
        );
      case 'backups':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Database Backups</CardTitle>
              <CardDescription>Manage database backups</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add database backups content here */}
              Database backups content coming soon...
            </CardContent>
          </Card>
        );
      case 'logs':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Database Logs</CardTitle>
              <CardDescription>View database operation logs</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add database logs content here */}
              Database logs content coming soon...
            </CardContent>
          </Card>
        );
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Database Status</CardTitle>
              <CardDescription>
                Current database status and health
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add database status content here */}
              Database status content coming soon...
            </CardContent>
          </Card>
        );
    }
  };

  const renderVerificationContent = () => {
    switch (activeTab) {
      case 'pending':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Pending Verifications</CardTitle>
              <CardDescription>
                Review pending verification requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add pending verifications content here */}
              Pending verifications content coming soon...
            </CardContent>
          </Card>
        );
      case 'history':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Verification History</CardTitle>
              <CardDescription>View verification history</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add verification history content here */}
              Verification history content coming soon...
            </CardContent>
          </Card>
        );
      case 'settings':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Verification Settings</CardTitle>
              <CardDescription>Configure verification settings</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add verification settings content here */}
              Verification settings content coming soon...
            </CardContent>
          </Card>
        );
      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Pending Verifications</CardTitle>
              <CardDescription>
                Review pending verification requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add pending verifications content here */}
              Pending verifications content coming soon...
            </CardContent>
          </Card>
        );
    }
  };

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
          {/* Add settings content here */}
          Settings content coming soon...
        </CardContent>
      </Card>
    );
  };

  const renderAlertsContent = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
          <CardDescription>View and manage system alerts</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Add alerts content here */}
          Alerts content coming soon...
        </CardContent>
      </Card>
    );
  };

  const renderNotificationsContent = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage system notifications</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Add notifications content here */}
          Notifications content coming soon...
        </CardContent>
      </Card>
    );
  };

  return <div className="flex-1">{renderContent()}</div>;
}
