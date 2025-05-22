'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function QuizCompletion() {
	const router = useRouter();

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
			<Card className="max-w-4xl w-full">
				<CardContent className="p-6 flex flex-col items-center">
					<h2 className="text-2xl font-bold text-center mb-4">
						Quiz Completed Successfully!
					</h2>
					<p className="text-center text-gray-600 mb-8">
						Sit back and relax, your quiz is over. Let&apos;s wait
						for the final Leaderboard results.
					</p>

					{/* YouTube Video Embed */}
					<div className="w-full aspect-video mb-8 rounded-lg overflow-hidden">
						<iframe
							className="w-full h-full"
							src="https://www.youtube.com/embed/5OX9oc5RHxk"
							title="SHUATS Inspiration"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
						></iframe>
					</div>

					{/* Action Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-2">
						<Button
							className="w-full sm:w-auto"
							onClick={() => router.push('/user/result')}
						>
							Show Results
						</Button>
						<Button
							className="w-full sm:w-auto"
							variant="outline"
							onClick={() => router.push('/user/leaderboard')}
						>
							View Leaderboard
						</Button>
						<Button
							className="w-full sm:w-auto"
							variant="secondary"
							onClick={() => router.push('/user/career-guidance')}
						>
							Get Career Guidance
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
