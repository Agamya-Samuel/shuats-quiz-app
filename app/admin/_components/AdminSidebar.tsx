'use client';

import type { Dispatch, SetStateAction } from 'react';
import {
  BarChart,
  BarChart3,
  Bell,
  CheckSquare,
  FileCheck,
  FileQuestion,
  LayoutDashboard,
  LineChart,
  Settings,
  Sliders,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function AdminSidebar({
  setSidebarOpen,
}: {
  setSidebarOpen?: Dispatch<SetStateAction<boolean>>;
}) {
  const searchParams = useSearchParams();
  const activeSection = searchParams.get('section') || 'dashboard';

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin?section=dashboard',
      icon: LayoutDashboard,
      value: 'dashboard',
    },
    {
      name: 'Manage Quiz',
      href: '/admin?section=manage-quiz',
      icon: FileQuestion,
      value: 'manage-quiz',
    },
    {
      name: 'Verification',
      href: '/admin?section=verification',
      icon: FileCheck,
      value: 'verification',
    },
    {
      name: 'User Management',
      href: '/admin?section=users',
      icon: Users,
      value: 'users',
    },
    {
      name: 'Submission',
      href: '/admin?section=submission',
      icon: CheckSquare,
      value: 'submission',
    },
    {
      name: 'Analytics',
      href: '/admin?section=analytics',
      icon: BarChart,
      value: 'analytics',
    },
    {
      name: 'Notifications',
      href: '/admin?section=notifications',
      icon: Bell,
      value: 'notifications',
    },
    {
      name: 'Settings',
      href: '/admin?section=settings',
      icon: Settings,
      value: 'settings',
    },
    {
      name: 'Site Analytics',
      href: '/admin?section=site-analytics',
      icon: LineChart,
      value: 'site-analytics',
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
              onClick={() => setSidebarOpen && setSidebarOpen(false)}
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
