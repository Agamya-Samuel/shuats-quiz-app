import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Trophy } from 'lucide-react';

export default function CampusLife() {
	const activities = [
		{
			title: 'Cultural Events',
			description:
				'Annual festivals, cultural performances, and celebrations throughout the year.',
			icon: Calendar,
			color: 'text-blue-400',
			items: ['Annual Tech Fest', 'Cultural Nights'],
		},
		{
			title: 'Student Clubs',
			description:
				'Join diverse clubs and societies to explore your interests.',
			icon: Users,
			color: 'text-green-400',
			items: ['Coding Club', 'Robotics Club'],
		},
		{
			title: 'Sports Activities',
			description:
				'Comprehensive sports facilities and regular tournaments.',
			icon: Trophy,
			color: 'text-red-400',
			items: ['Annual Sports Meet', 'Inter-college Tournaments'],
		},
	];

	return (
		<section id="campuslife" className="py-20 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold text-neutral-900 mb-4 animate__animated animate__fadeInUp">
						Campus Life
					</h2>
					<p className="text-lg text-neutral-600 animate__animated animate__fadeInUp animate__delay-1s">
						Experience a vibrant and enriching student life at our
						campus
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{activities.map((activity, index) => (
						<Card
							key={index}
							className="group overflow-hidden shadow-lg animate__animated animate__fadeInUp"
						>
							<CardHeader className="bg-neutral-800 p-8">
								<div className={`${activity.color} mb-4`}>
									<activity.icon className="w-10 h-10" />
								</div>
								<CardTitle className="text-xl font-bold text-white mb-3">
									{activity.title}
								</CardTitle>
							</CardHeader>
							<CardContent className="p-8">
								<p className="text-neutral-600 mb-4">
									{activity.description}
								</p>
								<ul className="text-neutral-700 space-y-2">
									{activity.items.map((item, itemIndex) => (
										<li
											key={itemIndex}
											className="flex items-center"
										>
											<svg
												className="w-4 h-4 mr-2 text-green-500"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path
													fillRule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
													clipRule="evenodd"
												/>
											</svg>
											{item}
										</li>
									))}
								</ul>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
