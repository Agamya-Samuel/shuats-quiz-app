import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, School, FlaskRoundIcon as Flask, Wifi } from 'lucide-react';

export default function Infrastructure() {
	const stats = [
		{
			title: 'Campus Area',
			value: '50',
			unit: 'Acres',
			color: 'text-blue-600',
			width: '100%',
		},
		{
			title: 'Classrooms',
			value: '100+',
			unit: '',
			color: 'text-green-600',
			width: '85%',
		},
		{
			title: 'Laboratories',
			value: '50+',
			unit: '',
			color: 'text-purple-600',
			width: '90%',
		},
	];

	const features = [
		{
			title: 'Modern Architecture',
			description:
				'Contemporary building design with sustainable features',
			icon: Building2,
			color: 'bg-blue-100 text-blue-600',
		},
		{
			title: 'Power Backup',
			description:
				'24/7 uninterrupted power supply with green energy integration',
			icon: School,
			color: 'bg-green-100 text-green-600',
		},
		{
			title: 'Security Systems',
			description: 'Advanced surveillance and security protocols',
			icon: Flask,
			color: 'bg-purple-100 text-purple-600',
		},
		{
			title: 'Wi-Fi Campus',
			description:
				'High-speed internet connectivity throughout the campus',
			icon: Wifi,
			color: 'bg-red-100 text-red-600',
		},
	];

	return (
		<section id="infrastructure" className="py-20 bg-neutral-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold text-neutral-900 mb-4 animate__animated animate__fadeInUp">
						Campus Infrastructure
					</h2>
					<p className="text-lg text-neutral-600 animate__animated animate__fadeInUp animate__delay-1s">
						Modern facilities designed to support your educational
						journey
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
					{/* Infrastructure Stats */}
					<div className="space-y-8 animate__animated animate__fadeInLeft">
						{stats.map((stat, index) => (
							<Card
								key={index}
								className="hover:shadow-xl transition duration-300"
							>
								<CardContent className="p-6">
									<div className="flex justify-between items-center">
										<h3 className="text-2xl font-bold text-neutral-900">
											{stat.title}
										</h3>
										<span
											className={`text-3xl font-bold ${stat.color}`}
										>
											{stat.value}
										</span>
									</div>
									<p className="text-neutral-600 mt-2">
										{stat.unit} of green campus
									</p>
									<div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
										<div
											className={`${stat.color} h-2.5 rounded-full`}
											style={{ width: stat.width }}
										></div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>

					{/* Features List */}
					<Card className="animate__animated animate__fadeInRight">
						<CardHeader>
							<CardTitle className="text-2xl font-bold mb-6 text-neutral-900">
								Key Infrastructure Features
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{features.map((feature, index) => (
								<div
									key={index}
									className="flex items-start space-x-4"
								>
									<div
										className={`flex-shrink-0 w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center`}
									>
										<feature.icon className="w-6 h-6" />
									</div>
									<div>
										<h4 className="text-lg font-semibold text-neutral-900">
											{feature.title}
										</h4>
										<p className="text-neutral-600">
											{feature.description}
										</p>
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
}
