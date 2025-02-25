// app/(auth)/login/page.tsx

'use client';

import { LoginForm } from './forms/LoginForm';
import { useSearchParams } from 'next/navigation';

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
