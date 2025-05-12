// app/admin/login/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { LoginForm } from './forms/LoginForm';

export default function LoginPage() {
	const searchParams = useSearchParams();
	const redirect = searchParams.get('redirect');

	return (
		<div className="flex justify-center items-center h-screen">
			<div className="w-full max-w-md">
				{/* <h1 className="text-2xl font-bold mb-4">Login</h1> */}
				<LoginForm redirect={redirect || undefined} />
			</div>
		</div>
	);
}
