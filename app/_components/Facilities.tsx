import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Book,
	FlaskConical,
	Bike,
	Monitor,
	Utensils,
	Drama,
} from 'lucide-react';

export default function Facilities() {
	const facilities = [
		{
			title: 'Modern Library',
			icon: <Book />,
			bgGradient: 'from-blue-400 to-purple-500',
			description:
				'Extensive collection of books, digital resources, and quiet study spaces for focused learning.',
		},
		{
			title: 'Research Labs',
			icon: <FlaskConical />,
			bgGradient: 'from-green-400 to-teal-500',
			description:
				'State-of-the-art laboratories equipped with modern instruments for practical learning.',
		},
		{
			title: 'Sports Complex',
			icon: <Bike />,
			bgGradient: 'from-red-400 to-orange-500',
			description:
				'Multi-purpose sports facilities including indoor and outdoor courts for physical activities.',
		},
		{
			title: 'Computing Center',
			icon: <Monitor />,
			bgGradient: 'from-indigo-400 to-purple-600',
			description:
				'Advanced computing facilities with latest software and high-speed internet access.',
		},
		{
			title: 'Auditorium',
			icon: <Drama />,
			bgGradient: 'from-pink-400 to-rose-500',
			description:
				'Modern auditorium for conferences, seminars, and cultural events.',
		},
		{
			title: 'Cafeteria',
			icon: <Utensils />,
			bgGradient: 'from-yellow-400 to-orange-500',
			description:
				'Spacious dining area serving nutritious meals in a comfortable environment.',
		},
	];

	return (
		<section id="facilities" className="py-20 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold text-neutral-900 mb-4 animate__animated animate__fadeInUp">
						Our World-Class Facilities
					</h2>
					<p className="text-lg text-neutral-600 animate__animated animate__fadeInUp animate__delay-1s">
						Discover the state-of-the-art amenities that enhance
						your learning experience
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{facilities.map((facility, index) => (
						<Card
							key={index}
							className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
						>
							<CardHeader>
								<CardTitle className="flex items-center text-xl font-semibold">
									<span
										className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br text-white mr-2 ${facility.bgGradient}`}
									>
										{facility.icon}
									</span>
									{facility.title}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-neutral-600">
									{facility.description}
								</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
