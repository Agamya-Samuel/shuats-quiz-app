// app/user/quiz/page.tsx
'use client';

import QuizInterface from '@/app/user/quiz/_components/quiz-interface';
import Navbar from '@/components/navbar';

export default function QuizPage() {
	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header with user details */}
			<Navbar showTime={true} />
			<QuizInterface />
		</div>
	);
}
