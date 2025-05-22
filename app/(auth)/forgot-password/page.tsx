'use client';

import { ForgotPasswordForm } from './forms/ForgotPasswordForm';

export default function ForgotPasswordPage() {
	return (
		<div className="flex justify-center items-center h-screen">
			<div className="w-full max-w-md">
				<ForgotPasswordForm />
			</div>
		</div>
	);
}
