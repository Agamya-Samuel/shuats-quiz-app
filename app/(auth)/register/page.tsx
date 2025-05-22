// app/(auth)/register/page.tsx
import { RegistrationForm } from './forms/RegistrationForm';

export default function RegisterPage() {

	return (
		<div className="flex justify-center items-center h-screen">
			<div className="w-full max-w-xl">
				{/* <h1 className="text-2xl font-bold mb-4">Register</h1> */}
				<RegistrationForm />
			</div>
		</div>
	);
};
