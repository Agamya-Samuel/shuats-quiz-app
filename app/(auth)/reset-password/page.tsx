'use client';

import { ResetPasswordForm } from './forms/ResetPasswordForm';
import { useSearchParams } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
	const searchParams = useSearchParams();
	const token = searchParams.get('token');

	if (!token) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="w-full max-w-md">
					<Alert variant="destructive" className="mb-4">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Invalid Reset Link</AlertTitle>
						<AlertDescription>
							The password reset link is invalid or has expired.
						</AlertDescription>
					</Alert>
					<div className="text-center mt-4">
						<Link
							href="/forgot-password"
							className="text-indigo-600 hover:text-indigo-700"
						>
							Request a new reset link
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex justify-center items-center h-screen">
			<div className="w-full max-w-md">
				<ResetPasswordForm token={token} />
			</div>
		</div>
	);
}
