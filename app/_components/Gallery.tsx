import { Button } from '@/components/ui/button';

export default function Gallery() {
	const galleryItems = [
		{
			title: 'Modern Classrooms',
			description: 'State-of-the-art learning spaces',
			color: 'from-blue-600 to-purple-600',
		},
		{
			title: 'Research Labs',
			description: 'Advanced research facilities',
			color: 'from-green-600 to-teal-600',
		},
		{
			title: 'Sports Complex',
			description: 'World-class sports facilities',
			color: 'from-red-600 to-orange-600',
		},
		{
			title: 'Library',
			description: 'Extensive collection of resources',
			color: 'from-purple-600 to-pink-600',
		},
		{
			title: 'Auditorium',
			description: 'Modern conference facilities',
			color: 'from-yellow-600 to-red-600',
		},
		{
			title: 'Campus Life',
			description: 'Vibrant student activities',
			color: 'from-indigo-600 to-blue-600',
		},
	];

	return (
		<section id="gallery" className="py-20 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold text-neutral-900 mb-4 animate__animated animate__fadeInUp">
						Campus Gallery
					</h2>
					<p className="text-lg text-neutral-600 animate__animated animate__fadeInUp animate__delay-1s">
						Take a visual tour of our state-of-the-art facilities
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{galleryItems.map((item, index) => (
						<div
							key={index}
							className={`relative group overflow-hidden rounded-xl shadow-lg h-72 animate__animated animate__fadeIn animate__delay-${index}s`}
						>
							<div
								className={`absolute inset-0 bg-gradient-to-r ${item.color} group-hover:opacity-90 transition-opacity`}
							></div>
							<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
								<div className="text-center p-4">
									<h3 className="text-xl font-bold text-white mb-2">
										{item.title}
									</h3>
									<p className="text-white">
										{item.description}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>

				<div className="text-center mt-12">
					<Button
						variant="default"
						size="lg"
						className="animate__animated animate__fadeInUp"
					>
						View More Photos
					</Button>
				</div>
			</div>
		</section>
	);
}
