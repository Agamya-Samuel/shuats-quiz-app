'use client';

import {
  AlertTriangle,
  Bell,
  Database,
  FileCheck,
  LayoutDashboard,
  Settings,
  Shield,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function SuperAdminSidebar() {
  const searchParams = useSearchParams();
  const activeSection = searchParams.get('section') || 'dashboard';

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/super-admin?section=dashboard',
      icon: LayoutDashboard,
      value: 'dashboard',
    },
    {
      name: 'Admin Management',
      href: '/super-admin?section=admin-management',
      icon: Shield,
      value: 'admin-management',
    },
    {
      name: 'User Management',
      href: '/super-admin?section=users',
      icon: Users,
      value: 'users',
    },
    {
      name: 'System Settings',
      href: '/super-admin?section=settings',
      icon: Settings,
      value: 'settings',
    },
    {
      name: 'Database Control',
      href: '/super-admin?section=database',
      icon: Database,
      value: 'database',
    },
    {
      name: 'Verification Control',
      href: '/super-admin?section=verification',
      icon: FileCheck,
      value: 'verification',
    },
    {
      name: 'System Alerts',
      href: '/super-admin?section=alerts',
      icon: AlertTriangle,
      value: 'alerts',
    },
    {
      name: 'Notifications',
      href: '/super-admin?section=notifications',
      icon: Bell,
      value: 'notifications',
    },
  ];

  return (
    <Card className="overflow-auto">
      <CardContent className="p-0">
        <nav className="flex flex-col gap-1 p-2">
          {menuItems.map((item) => (
            <Link
              key={item.value}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors',
                activeSection === item.value
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted',
              )}>
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
}
