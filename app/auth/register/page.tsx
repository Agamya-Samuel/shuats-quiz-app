import { RegistrationForm } from '@/app/auth/register/forms/RegistrationForm';

export default function RegisterPage() {
	return (
		<div className="flex justify-center items-center h-screen">
			<div className="w-full max-w-md">
				{/* <h1 className="text-2xl font-bold mb-4">Register</h1> */}
				<RegistrationForm />
			</div>
		</div>
	);
};
