// app/(auth)/login/page.tsx

import { LoginForm } from './forms/LoginForm';

export default function LoginPage() {
	return (
		<div className="flex justify-center items-center h-screen">
			<div className="w-full max-w-md">
				{/* <h1 className="text-2xl font-bold mb-4">Login</h1> */}
				<LoginForm />
			</div>
		</div>
	);
}
