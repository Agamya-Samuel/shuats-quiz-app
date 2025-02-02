// app/admin/dashboard/layout.tsx
import ErrorBoundary from '@/components/ErrorBoundary';

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <ErrorBoundary>{children}</ErrorBoundary>;
}
