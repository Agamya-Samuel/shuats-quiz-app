import { AdminHeader } from '../_components/AdminHeader';
import { AdminSidebar } from '../_components/AdminSidebar';

export default function SubmissionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6 max-w-7xl">
        <aside className="w-full md:w-64 shrink-0">
          <AdminSidebar />
        </aside>
        <main className="flex-1 space-y-6">{children}</main>
      </div>
    </div>
  );
}