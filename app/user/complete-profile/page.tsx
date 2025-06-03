'use client';

import { ProfileCompletionForm } from './forms/ProfileCompletionForm';

export default function CompleteProfilePage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-12">
      <div className="w-full max-w-3xl p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Complete Your Profile
        </h1>
        <p className="text-md text-gray-600 mb-8 text-center">
          Welcome! Just a few more details to get your account set up.
        </p>
        <ProfileCompletionForm />
      </div>
    </div>
  );
}
